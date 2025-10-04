package com.example.backend.controller;

import com.example.backend.entity.Commande;
import com.example.backend.entity.Adherent;
import com.example.backend.entity.Produit;
import com.example.backend.entity.Status;
import com.example.backend.dto.CommandeDTO;
import com.example.backend.service.CommandeService;
import com.example.backend.service.AdherentService;
import com.example.backend.service.ProduitService;
import com.example.backend.repository.ProduitRepository;
import com.example.backend.mapper.CommandeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
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
    private ProduitRepository produitRepository;
    
    @Autowired
    private CommandeMapper commandeMapper;

    @PostMapping
    public ResponseEntity<?> createCommande(@Valid @RequestBody CommandeDTO commandeDTO) {
        try {
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
            
            if (commandeDTO.getStatut() == null || commandeDTO.getStatut().isEmpty()) {
                commandeDTO.setStatut("EN_COURS");
            } else {
                try {
                    Status.valueOf(commandeDTO.getStatut());
                } catch (IllegalArgumentException e) {
                    commandeDTO.setStatut("EN_COURS");
                }
            }
            
            Commande commande = commandeMapper.toEntity(commandeDTO);
            
            if (commande.getMontantTotal() == null && commandeDTO.getMontantTotal() != null) {
                commande.setMontantTotal(commandeDTO.getMontantTotal());
            }
            
            Optional<Adherent> adherentOpt = adherentService.getAdherentById(commandeDTO.getAdherentId());
            if (!adherentOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid adherent ID",
                    "message", "No adherent found with ID: " + commandeDTO.getAdherentId() + ". Please log in again to refresh your user data."
                ));
            }
            commande.setAdherent(adherentOpt.get());
            
            if (commandeDTO.getProduitIds() != null && !commandeDTO.getProduitIds().isEmpty()) {
                List<Produit> produits = commandeDTO.getProduitIds().stream()
                    .map(produitService::getProduitEntityById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
                
                for (Produit produit : produits) {
                    if (produit.getStock() > 0) {
                        produit.setStock(produit.getStock() - 1);
                        produitRepository.save(produit);
                    }
                }
                
                commande.setProduits(produits);
            } else {
                commande.setProduits(List.of());
            }
            
            Commande savedCommande = commandeService.saveCommande(commande);
            return ResponseEntity.ok(savedCommande);
        } catch (Exception e) {
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
    public ResponseEntity<?> getCommandeById(@PathVariable Integer id) {
        try {
            Optional<Commande> commande = commandeService.getCommandeById(id);
            if (commande.isPresent()) {
                return ResponseEntity.ok(commande.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "Commande not found",
                    "message", "No commande found with ID: " + id
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Commande data error",
                "message", "The commande with ID: " + id + " appears to be corrupted and cannot be loaded."
            ));
        }
    }

    @GetMapping("/user/{adherentId}")
    public ResponseEntity<?> getCommandesByAdherentId(@PathVariable Integer adherentId, HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Authentication required"
                ));
            }
            
            List<Commande> commandes = commandeService.getCommandesByAdherentId(adherentId);
            return ResponseEntity.ok(commandes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Internal server error",
                "message", "Failed to retrieve orders"
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCommande(@PathVariable Integer id, @RequestBody CommandeDTO commandeDTO) {
        try {
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
            
            if (commandeDTO.getStatut() == null || commandeDTO.getStatut().isEmpty()) {
                commandeDTO.setStatut("EN_COURS");
            } else {
                try {
                    Status.valueOf(commandeDTO.getStatut());
                } catch (IllegalArgumentException e) {
                    commandeDTO.setStatut("EN_COURS");
                }
            }
            
            Commande commande = commandeMapper.toEntity(commandeDTO);
            commande.setIdCommande(id);
            
            if (commande.getMontantTotal() == null && commandeDTO.getMontantTotal() != null) {
                commande.setMontantTotal(commandeDTO.getMontantTotal());
            }
            
            Optional<Adherent> adherentOpt = adherentService.getAdherentById(commandeDTO.getAdherentId());
            if (!adherentOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid adherent ID",
                    "message", "No adherent found with ID: " + commandeDTO.getAdherentId() + ". Please log in again to refresh your user data."
                ));
            }
            commande.setAdherent(adherentOpt.get());
            
            if (commandeDTO.getProduitIds() != null && !commandeDTO.getProduitIds().isEmpty()) {
                List<Produit> produits = commandeDTO.getProduitIds().stream()
                    .map(produitService::getProduitEntityById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
                commande.setProduits(produits);
            } else {
                Optional<Commande> existingCommandeOpt = commandeService.getCommandeById(id);
                if (existingCommandeOpt.isPresent()) {
                    commande.setProduits(existingCommandeOpt.get().getProduits());
                } else {
                    commande.setProduits(List.of());
                }
            }
            
            Commande updatedCommande = commandeService.updateCommande(id, commande);
            return ResponseEntity.ok(updatedCommande);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Commande not found or corrupted",
                "message", "No valid commande found with ID: " + id + ". The order may be corrupted. Error: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Internal server error",
                "message", "Failed to update commande with ID: " + id + ". Error: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommande(@PathVariable Integer id) {
        try {
            try {
                commandeService.deleteCommande(id);
                return ResponseEntity.noContent().build();
            } catch (Exception deleteException) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "Failed to delete commande",
                    "message", "Could not delete commande with ID: " + id + ". The order may be corrupted."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Internal server error",
                "message", "Failed to delete commande with ID: " + id
            ));
        }
    }
}