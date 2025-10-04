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
            if (adherent.getNom() == null || adherent.getNom().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid input",
                    "message", "Last name is required"
                ));
            }
            
            if (adherent.getPrénom() == null || adherent.getPrénom().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid input",
                    "message", "First name is required"
                ));
            }
            
            if (adherent.getEmail() == null || adherent.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid input",
                    "message", "Email is required"
                ));
            }
            
            if (adherentService.getAdherentByEmail(adherent.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid input",
                    "message", "An account with this email already exists"
                ));
            }
            
            if (adherent.getMotDePasse() == null || adherent.getMotDePasse().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                    "error", "Invalid input",
                    "message", "Password is required"
                ));
            }
            
            Adherent savedAdherent = adherentService.saveAdherent(adherent);
            return ResponseEntity.ok(savedAdherent);
        } catch (Exception e) {
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
                    return ResponseEntity.ok(adherent);
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}  