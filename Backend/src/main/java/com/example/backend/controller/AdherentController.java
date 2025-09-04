package com.example.backend.controller;

import com.example.backend.entity.Adherent;
import com.example.backend.service.AdherentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adherents")
public class AdherentController {

    @Autowired
    private AdherentService adherentService;

    @PostMapping
    public ResponseEntity<Adherent> createAdherent(@RequestBody Adherent adherent) {
        Adherent savedAdherent = adherentService.saveAdherent(adherent);
        return ResponseEntity.ok(savedAdherent);
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
} 