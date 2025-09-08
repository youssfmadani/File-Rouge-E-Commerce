package com.example.backend.controller;

import com.example.backend.entity.Administrateur;
import com.example.backend.service.AdministrateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/administrateurs")
@CrossOrigin(origins = {"http://localhost:*", "http://127.0.0.1:*"}, allowCredentials = "true")
public class AdministrateurController {

    @Autowired
    private AdministrateurService administrateurService;

    @PostMapping
    public ResponseEntity<Administrateur> createAdministrateur(@RequestBody Administrateur administrateur) {
        Administrateur savedAdministrateur = administrateurService.saveAdministrateur(administrateur);
        return ResponseEntity.ok(savedAdministrateur);
    }

    @GetMapping
    public ResponseEntity<List<Administrateur>> getAllAdministrateurs() {
        return ResponseEntity.ok(administrateurService.getAllAdministrateurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Administrateur> getAdministrateurById(@PathVariable Integer id) {
        Optional<Administrateur> administrateur = administrateurService.getAdministrateurById(id);
        return administrateur.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Administrateur> updateAdministrateur(@PathVariable Integer id, @RequestBody Administrateur administrateur) {
        Administrateur updatedAdministrateur = administrateurService.updateAdministrateur(id, administrateur);
        return ResponseEntity.ok(updatedAdministrateur);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdministrateur(@PathVariable Integer id) {
        administrateurService.deleteAdministrateur(id);
        return ResponseEntity.noContent().build();
    }
} 