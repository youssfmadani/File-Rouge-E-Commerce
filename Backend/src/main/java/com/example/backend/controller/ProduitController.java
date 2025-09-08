package com.example.backend.controller;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.exception.NotFoundException;
import com.example.backend.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = {"http://localhost:*", "http://127.0.0.1:*"}, allowCredentials = "true")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    @PostMapping
    public ResponseEntity<ProduitDTO> createProduit(@RequestBody ProduitDTO produitDTO) {
        ProduitDTO savedProduit = produitService.saveProduit(produitDTO);
        return ResponseEntity.ok(savedProduit);
    }

    @GetMapping    public ResponseEntity<List<ProduitDTO>> getAllProduits() {
        return ResponseEntity.ok(produitService.getAllProduits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitDTO> getProduitById(@PathVariable Integer id) {
        try {
            ProduitDTO produit = produitService.getProduitById(id);
            return ResponseEntity.ok(produit);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProduitDTO> updateProduit(@PathVariable Integer id, @RequestBody ProduitDTO produitDTO) {
        try {
            ProduitDTO updatedProduit = produitService.updateProduit(id, produitDTO);
            return ResponseEntity.ok(updatedProduit);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Integer id) {
        try {
            produitService.deleteProduit(id);
            return ResponseEntity.noContent().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 