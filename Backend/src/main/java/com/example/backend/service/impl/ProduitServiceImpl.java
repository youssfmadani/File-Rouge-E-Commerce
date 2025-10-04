package com.example.backend.service.impl;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.entity.Categorie;
import com.example.backend.entity.Produit;
import com.example.backend.exception.NotFoundException;
import com.example.backend.mapper.ProduitMapper;
import com.example.backend.repository.CategorieRepository;
import com.example.backend.repository.ProduitRepository;
import com.example.backend.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProduitServiceImpl implements ProduitService {

    @Autowired
    private ProduitRepository produitRepository;
    @Autowired
    private CategorieRepository categorieRepository;
    @Autowired
    private ProduitMapper produitMapper;

    @Override
    public ProduitDTO saveProduit(ProduitDTO produitDTO) {
        Produit produit = new Produit();
        
        if (produitDTO.getNom() != null) {
            produit.setNom(produitDTO.getNom().trim());
        } else {
            produit.setNom("Product");
        }
        
        if (produitDTO.getDescription() != null) {
            produit.setDescription(produitDTO.getDescription().trim());
        } else {
            produit.setDescription("No description available");
        }
        
        produit.setPrix(produitDTO.getPrix() >= 0 ? produitDTO.getPrix() : 0);
        
        if (produitDTO.getStock() != null && produitDTO.getStock() >= 0) {
            produit.setStock(produitDTO.getStock());
        } else {
            produit.setStock(0);
        }
        
        if (produitDTO.getImage() != null) {
            produit.setImage(produitDTO.getImage());
        }
        
        if (produitDTO.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(produitDTO.getCategorieId())
                .orElseThrow(() -> new NotFoundException("Categorie not found with id: " + produitDTO.getCategorieId()));
            produit.setCategorie(categorie);
        }
        
        Produit saved = produitRepository.save(produit);
        return produitMapper.toDTO(saved);
    }

    @Override
    public ProduitDTO updateProduit(Integer id, ProduitDTO produitDTO) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produit not found with id: " + id));
        
        if (produitDTO.getNom() != null) {
            produit.setNom(produitDTO.getNom().trim());
        }
        
        if (produitDTO.getDescription() != null) {
            produit.setDescription(produitDTO.getDescription().trim());
        }
        
        if (produitDTO.getPrix() >= 0) {
            produit.setPrix(produitDTO.getPrix());
        }
        
        if (produitDTO.getStock() != null && produitDTO.getStock() >= 0) {
            produit.setStock(produitDTO.getStock());
        }
        
        if (produitDTO.getImage() != null) {
            produit.setImage(produitDTO.getImage());
        }
        
        if (produitDTO.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(produitDTO.getCategorieId())
                    .orElseThrow(() -> new NotFoundException("Categorie not found with id: " + produitDTO.getCategorieId()));
            produit.setCategorie(categorie);
        }
        
        Produit updated = produitRepository.save(produit);
        return produitMapper.toDTO(updated);
    }

    @Override
    public void deleteProduit(Integer id) {
        if (!produitRepository.existsById(id)) {
            throw new NotFoundException("Produit not found with id: " + id);
        }
        produitRepository.deleteById(id);
    }

    @Override
    public ProduitDTO getProduitById(Integer id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produit not found with id: " + id));
        return produitMapper.toDTO(produit);
    }
    
    @Override
    public Optional<Produit> getProduitEntityById(Integer id) {
        return produitRepository.findById(id);
    }

    @Override
    public List<ProduitDTO> getAllProduits() {
        return produitRepository.findAll().stream().map(produitMapper::toDTO).collect(Collectors.toList());
    }
}