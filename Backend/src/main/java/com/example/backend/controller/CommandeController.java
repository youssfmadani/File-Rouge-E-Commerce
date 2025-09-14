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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
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
    public ResponseEntity<Commande> createCommande(@Valid @RequestBody CommandeDTO commandeDTO) {
        try {
            System.out.println("Received commandeDTO: " + commandeDTO);
            
            // Validate required fields
            if (commandeDTO.getAdherentId() == null) {
                System.out.println("Adherent ID is null");
                return ResponseEntity.badRequest().body(null);
            }
            
            if (commandeDTO.getDateCommande() == null) {
                System.out.println("Date commande is null");
                return ResponseEntity.badRequest().body(null);
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
                System.out.println("Adherent not found with ID: " + commandeDTO.getAdherentId());
                return ResponseEntity.badRequest().body(null);
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
            }
            
            System.out.println("Saving commande: " + commande);
            Commande savedCommande = commandeService.saveCommande(commande);
            System.out.println("Saved commande: " + savedCommande);
            return ResponseEntity.ok(savedCommande);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error creating commande: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
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
    public ResponseEntity<Void> deleteCommande(@PathVariable Integer id) {
        commandeService.deleteCommande(id);
        return ResponseEntity.noContent().build();
    }
}