package com.example.backend.controller;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.exception.NotFoundException;
import com.example.backend.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = {"http://localhost:*", "http://127.0.0.1:*"}, allowCredentials = "true")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    @PostMapping
    public ResponseEntity<?> createProduit(@RequestBody ProduitDTO produitDTO) {
        try {
            if (produitDTO.getNom() == null || produitDTO.getNom().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid product name",
                    "message", "Product name is required."
                ));
            }
            
            if (produitDTO.getDescription() == null || produitDTO.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid product description",
                    "message", "Product description is required."
                ));
            }
            
            if (produitDTO.getPrix() < 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid product price",
                    "message", "Product price must be zero or positive."
                ));
            }
            
            if (produitDTO.getStock() != null && produitDTO.getStock() < 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid product stock",
                    "message", "Product stock must be zero or positive."
                ));
            }
            
            ProduitDTO savedProduit = produitService.saveProduit(produitDTO);
            return ResponseEntity.ok(savedProduit);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to create product",
                "message", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<ProduitDTO>> getAllProduits() {
        return ResponseEntity.ok(produitService.getAllProduits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduitById(@PathVariable Integer id) {
        try {
            ProduitDTO produit = produitService.getProduitById(id);
            return ResponseEntity.ok(produit);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to retrieve product",
                "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduit(@PathVariable Integer id, @RequestBody ProduitDTO produitDTO) {
        try {
            if (produitDTO.getNom() == null || produitDTO.getNom().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid product name",
                    "message", "Product name is required."
                ));
            }
            
            if (produitDTO.getDescription() == null || produitDTO.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid product description",
                    "message", "Product description is required."
                ));
            }
            
            if (produitDTO.getPrix() < 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid product price",
                    "message", "Product price must be zero or positive."
                ));
            }
            
            if (produitDTO.getStock() != null && produitDTO.getStock() < 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid product stock",
                    "message", "Product stock must be zero or positive."
                ));
            }
            
            ProduitDTO updatedProduit = produitService.updateProduit(id, produitDTO);
            return ResponseEntity.ok(updatedProduit);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to update product",
                "message", "An error occurred while updating the product: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Integer id) {
        try {
            produitService.deleteProduit(id);
            return ResponseEntity.noContent().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}