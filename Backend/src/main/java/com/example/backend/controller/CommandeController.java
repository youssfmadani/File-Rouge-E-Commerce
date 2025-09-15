package com.example.backend.controller;

import com.example.backend.entity.Commande;
import com.example.backend.entity.Adherent;
import com.example.backend.entity.Produit;
import com.example.backend.entity.Status;
import com.example.backend.dto.CommandeDTO;
import com.example.backend.service.CommandeService;
import com.example.backend.service.AdherentService;
import com.example.backend.service.ProduitService;
import com.example.backend.mapper.CommandeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = {"http://localhost:*", "http://127.0.0.1:*"}, allowCredentials = "true")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;
    
    @Autowired
    private AdherentService adherentService;
    
    @Autowired
    private ProduitService produitService;
    
    @Autowired
    private CommandeMapper commandeMapper;

    @PostMapping
    public ResponseEntity<?> createCommande(@Valid @RequestBody CommandeDTO commandeDTO) {
        try {
            // Validate required fields
            if (commandeDTO.getAdherentId() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid adherent ID",
                    "message", "Adherent ID is required. Please log in again to refresh your user data."
                ));
            }
            
            if (commandeDTO.getDateCommande() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid date",
                    "message", "Order date is required."
                ));
            }
            
            // Set default status if not provided or invalid
            if (commandeDTO.getStatut() == null || commandeDTO.getStatut().isEmpty()) {
                commandeDTO.setStatut("EN_COURS");
            } else {
                // Validate status is a valid enum value
                try {
                    Status.valueOf(commandeDTO.getStatut());
                } catch (IllegalArgumentException e) {
                    // If not valid, default to EN_COURS
                    commandeDTO.setStatut("EN_COURS");
                }
            }
            
            // Convert DTO to entity
            Commande commande = commandeMapper.toEntity(commandeDTO);
            
            // Set montantTotal if not set
            if (commande.getMontantTotal() == null && commandeDTO.getMontantTotal() != null) {
                commande.setMontantTotal(commandeDTO.getMontantTotal());
            }
            
            // Set the adherent
            Optional<Adherent> adherentOpt = adherentService.getAdherentById(commandeDTO.getAdherentId());
            if (!adherentOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid adherent ID",
                    "message", "No adherent found with ID: " + commandeDTO.getAdherentId() + ". Please log in again to refresh your user data."
                ));
            }
            commande.setAdherent(adherentOpt.get());
            
            // Set the products if provided
            if (commandeDTO.getProduitIds() != null && !commandeDTO.getProduitIds().isEmpty()) {
                List<Produit> produits = commandeDTO.getProduitIds().stream()
                    .map(produitService::getProduitEntityById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
                commande.setProduits(produits);
            } else {
                // Initialize empty list if no products provided
                commande.setProduits(List.of());
            }
            
            Commande savedCommande = commandeService.saveCommande(commande);
            return ResponseEntity.ok(savedCommande);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error creating commande: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Internal server error",
                "message", "There was a problem with your order. Please log out and log in again to refresh your session."
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<Commande>> getAllCommandes() {
        return ResponseEntity.ok(commandeService.getAllCommandes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable Integer id) {
        Optional<Commande> commande = commandeService.getCommandeById(id);
        return commande.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Commande> updateCommande(@PathVariable Integer id, @RequestBody Commande commande) {
        Commande updatedCommande = commandeService.updateCommande(id, commande);
        return ResponseEntity.ok(updatedCommande);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommande(@PathVariable Integer id) {
        try {
            System.out.println("Attempting to delete commande with ID: " + id);
            
            // Check if the commande exists
            Optional<Commande> commandeOpt = commandeService.getCommandeById(id);
            if (!commandeOpt.isPresent()) {
                System.out.println("Commande not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "Commande not found",
                    "message", "No commande found with ID: " + id
                ));
            }
            
            System.out.println("Deleting commande with ID: " + id);
            commandeService.deleteCommande(id);
            System.out.println("Commande deleted successfully with ID: " + id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.err.println("Runtime error deleting commande with ID: " + id + ", Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Commande not found",
                "message", "No commande found with ID: " + id
            ));
        } catch (Exception e) {
            System.err.println("Unexpected error deleting commande with ID: " + id + ", Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Internal server error",
                "message", "Failed to delete commande with ID: " + id
            ));
        }
    }
}