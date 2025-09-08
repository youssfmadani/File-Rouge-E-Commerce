package com.example.backend.controller;

import com.example.backend.entity.Commande;
import com.example.backend.service.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = {"http://localhost:*", "http://127.0.0.1:*"}, allowCredentials = "true")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;

    @PostMapping
    public ResponseEntity<Commande> createCommande(@RequestBody Commande commande) {
        Commande savedCommande = commandeService.saveCommande(commande);
        return ResponseEntity.ok(savedCommande);
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