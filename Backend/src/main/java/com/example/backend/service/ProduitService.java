package com.example.backend.service;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.entity.Produit;
import java.util.List;
import java.util.Optional;

public interface ProduitService {
    ProduitDTO saveProduit(ProduitDTO produitDTO);
    ProduitDTO updateProduit(Integer id, ProduitDTO produitDTO);
    void deleteProduit(Integer id);
    ProduitDTO getProduitById(Integer id);
    Optional<Produit> getProduitEntityById(Integer id);
    List<ProduitDTO> getAllProduits();
}