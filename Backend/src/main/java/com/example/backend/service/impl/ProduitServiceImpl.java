package com.example.backend.service.impl;

import com.example.backend.entity.Produit;
import com.example.backend.repository.ProduitRepository;
import com.example.backend.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitServiceImpl implements ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    @Override
    public Produit saveProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    @Override
    public Produit updateProduit(Integer id, Produit produit) {
        Optional<Produit> existingProduitOpt = produitRepository.findById(id);
        if (existingProduitOpt.isPresent()) {
            Produit existingProduit = existingProduitOpt.get();
            existingProduit.setNom(produit.getNom());
            existingProduit.setDescription(produit.getDescription());
            existingProduit.setPrix(produit.getPrix());
            existingProduit.setCategorie(produit.getCategorie());
            return produitRepository.save(existingProduit);
        } else {
            throw new RuntimeException("Produit not found with id: " + id);
        }
    }

    @Override
    public void deleteProduit(Integer id) {
        produitRepository.deleteById(id);
    }

    @Override
    public Optional<Produit> getProduitById(Integer id) {
        return produitRepository.findById(id);
    }

    @Override
    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }
} 