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
        Produit produit = produitMapper.toEntity(produitDTO);
        // Set the category if categorieId is provided
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
        produit.setNom(produitDTO.getNom());
        produit.setDescription(produitDTO.getDescription());
        produit.setPrix(produitDTO.getPrix());
        if (produitDTO.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(produitDTO.getCategorieId())
                    .orElseThrow(() -> new NotFoundException("Categorie not found with id: " + produitDTO.getCategorieId()));
            produit.setCategorie(categorie);
        } else {
            produit.setCategorie(null);
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
    public List<ProduitDTO> getAllProduits() {
        return produitRepository.findAll().stream().map(produitMapper::toDTO).collect(Collectors.toList());
    }
} 