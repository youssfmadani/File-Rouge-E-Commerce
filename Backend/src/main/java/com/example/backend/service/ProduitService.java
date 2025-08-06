package com.example.backend.service;

import com.example.backend.dto.ProduitDTO;
import java.util.List;

public interface ProduitService {
    ProduitDTO saveProduit(ProduitDTO produitDTO);
    ProduitDTO updateProduit(Integer id, ProduitDTO produitDTO);
    void deleteProduit(Integer id);
    ProduitDTO getProduitById(Integer id);
    List<ProduitDTO> getAllProduits();
} 