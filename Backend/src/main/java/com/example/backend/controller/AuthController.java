package com.example.backend.controller;

import com.example.backend.entity.Adherent;
import com.example.backend.service.AdherentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:*", "http://127.0.0.1:*"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AdherentService adherentService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "");
        String role = email.toLowerCase().contains("admin") ? "ADMIN" : "USER";

        Map<String, Object> result = new HashMap<>();
        result.put("token", "dummy-token-" + System.currentTimeMillis());
        result.put("role", role);
        

        try {
            Optional<Adherent> adherentOpt = adherentService.getAdherentByEmail(email);
            Adherent adherent;
            
            if (adherentOpt.isPresent()) {
                adherent = adherentOpt.get();
            } else {
                // Create a new adherent
                Adherent newAdherent = new Adherent();
                newAdherent.setEmail(email);
                newAdherent.setNom("User");
                newAdherent.setPrénom(email.split("@")[0]);
                newAdherent.setMotDePasse("default-password"); // In a real app, this would be properly hashed
                adherent = adherentService.saveAdherent(newAdherent);
            }
            
            // Add user data to response
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", adherent.getId());
            userMap.put("email", adherent.getEmail());
            userMap.put("nom", adherent.getNom());
            userMap.put("prénom", adherent.getPrénom());
            userMap.put("role", role);
            
            result.put("user", userMap);
        } catch (Exception e) {
            // If there's an error creating/retrieving user, continue with just token and role
            System.err.println("Error processing user data: " + e.getMessage());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(result);
    }
}