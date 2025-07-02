package com.example.backend.service;

import com.example.backend.entity.Produit;
import java.util.List;
import java.util.Optional;

public interface ProduitService {
    Produit saveProduit(Produit produit);
    Produit updateProduit(Integer id, Produit produit);
    void deleteProduit(Integer id);
    Optional<Produit> getProduitById(Integer id);
    List<Produit> getAllProduits();
} 