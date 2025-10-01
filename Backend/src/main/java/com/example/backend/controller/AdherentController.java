package com.example.backend.controller;

import com.example.backend.entity.Adherent;
import com.example.backend.service.AdherentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/adherents")
@CrossOrigin(origins = {"http://localhost:*", "http://127.0.0.1:*", "http://localhost", "https://localhost"}, allowCredentials = "true")
public class AdherentController {

    @Autowired
    private AdherentService adherentService;

    @PostMapping
    public ResponseEntity<?> createAdherent(@RequestBody Adherent adherent) {
        try {
            System.out.println("Received adherent data: " + adherent);
            System.out.println("Received adherent JSON: nom=" + adherent.getNom() + ", prenom=" + adherent.getPrénom() + ", email=" + adherent.getEmail() + ", motDePasse=" + adherent.getMotDePasse());
            
            // Additional debugging
            System.out.println("Checking for null values:");
            System.out.println("  nom is null: " + (adherent.getNom() == null));
            System.out.println("  prénom is null: " + (adherent.getPrénom() == null));
            System.out.println("  email is null: " + (adherent.getEmail() == null));
            System.out.println("  motDePasse is null: " + (adherent.getMotDePasse() == null));
            
            if (adherent.getNom() != null) {
                System.out.println("  nom length: " + adherent.getNom().length());
                System.out.println("  nom trimmed length: " + adherent.getNom().trim().length());
            }
            
            if (adherent.getPrénom() != null) {
                System.out.println("  prénom length: " + adherent.getPrénom().length());
                System.out.println("  prénom trimmed length: " + adherent.getPrénom().trim().length());
            }
            
            if (adherent.getEmail() != null) {
                System.out.println("  email length: " + adherent.getEmail().length());
                System.out.println("  email trimmed length: " + adherent.getEmail().trim().length());
            }
            
            if (adherent.getMotDePasse() != null) {
                System.out.println("  motDePasse length: " + adherent.getMotDePasse().length());
                System.out.println("  motDePasse trimmed length: " + adherent.getMotDePasse().trim().length());
            }
            
            // Validate required fields
            if (adherent.getNom() == null || adherent.getNom().trim().isEmpty()) {
                System.out.println("Validation failed: Last name is required");
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid input",
                    "message", "Last name is required"
                ));
            }
            
            if (adherent.getPrénom() == null || adherent.getPrénom().trim().isEmpty()) {
                System.out.println("Validation failed: First name is required");
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid input",
                    "message", "First name is required"
                ));
            }
            
            if (adherent.getEmail() == null || adherent.getEmail().trim().isEmpty()) {
                System.out.println("Validation failed: Email is required");
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid input",
                    "message", "Email is required"
                ));
            }
            
            // Check if email already exists
            if (adherentService.getAdherentByEmail(adherent.getEmail()).isPresent()) {
                System.out.println("Validation failed: Email already exists");
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid input",
                    "message", "An account with this email already exists"
                ));
            }
            
            if (adherent.getMotDePasse() == null || adherent.getMotDePasse().trim().isEmpty()) {
                System.out.println("Validation failed: Password is required");
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid input",
                    "message", "Password is required"
                ));
            }
            
            System.out.println("Saving adherent with data: nom=" + adherent.getNom() + ", prénom=" + adherent.getPrénom() + ", email=" + adherent.getEmail());
            Adherent savedAdherent = adherentService.saveAdherent(adherent);
            System.out.println("Adherent saved successfully with ID: " + savedAdherent.getId());
            return ResponseEntity.ok(savedAdherent);
        } catch (Exception e) {
            System.err.println("Error creating adherent: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of(
                "error", "Internal server error",
                "message", "Failed to create account. Please try again."
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<Adherent>> getAllAdherents() {
        return ResponseEntity.ok(adherentService.getAllAdherents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Adherent> getAdherentById(@PathVariable Integer id) {
        Optional<Adherent> adherent = adherentService.getAdherentById(id);
        return adherent.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Adherent> getAdherentByEmail(@PathVariable String email) {
        Optional<Adherent> adherent = adherentService.getAdherentByEmail(email);
        return adherent.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Adherent> updateAdherent(@PathVariable Integer id, @RequestBody Adherent adherent) {
        Adherent updatedAdherent = adherentService.updateAdherent(id, adherent);
        return ResponseEntity.ok(updatedAdherent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdherent(@PathVariable Integer id) {
        adherentService.deleteAdherent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/make-admin")
    public ResponseEntity<Adherent> makeAdmin(@PathVariable Integer id) {
        try {
            Optional<Adherent> adherentOpt = adherentService.getAdherentById(id);
            if (adherentOpt.isPresent()) {
                Adherent adherent = adherentOpt.get();
                
                String currentEmail = adherent.getEmail();
                if (!currentEmail.toLowerCase().contains("admin")) {
                    String newEmail = "admin." + currentEmail;
                    adherent.setEmail(newEmail);
                    Adherent updatedAdherent = adherentService.updateAdherent(id, adherent);
                    return ResponseEntity.ok(updatedAdherent);
                } else {
                    return ResponseEntity.ok(adherent); // Already admin
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}  