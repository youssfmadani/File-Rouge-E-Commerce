package com.example.backend.mapper.example;

import com.example.backend.dto.AdherentDTO;
import com.example.backend.dto.ProduitDTO;
import com.example.backend.entity.Adherent;
import com.example.backend.entity.Produit;
import com.example.backend.mapper.AdherentMapper;
import com.example.backend.mapper.MapperConfig;
import com.example.backend.mapper.MapperUtils;
import com.example.backend.mapper.ProduitMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Example class demonstrating how to use the mappers in different scenarios.
 * This is for educational purposes and shows best practices.
 */
@Component
public class MapperUsageExample {

    @Autowired
    private ProduitMapper produitMapper;

    @Autowired
    private AdherentMapper adherentMapper;

    @Autowired
    private MapperConfig mapperConfig;

    /**
     * Example 1: Basic entity to DTO mapping
     */
    public ProduitDTO mapProduitToDTO(Produit produit) {
        return produitMapper.toDTO(produit);
    }

    /**
     * Example 2: Basic DTO to entity mapping
     */
    public Produit mapDTOToProduit(ProduitDTO produitDTO) {
        return produitMapper.toEntity(produitDTO);
    }

    /**
     * Example 3: List mapping
     */
    public List<ProduitDTO> mapProduitListToDTO(List<Produit> produits) {
        return produitMapper.toDTOList(produits);
    }

    /**
     * Example 4: Using MapperUtils for safe mapping
     */
    public ProduitDTO safeMapProduit(Produit produit) {
        return MapperUtils.mapSafely(produit, produitMapper::toDTO);
    }

    /**
     * Example 5: Using MapperUtils for safe list mapping
     */
    public List<ProduitDTO> safeMapProduitList(List<Produit> produits) {
        return MapperUtils.mapListSafely(produits, produitMapper::toDTO);
    }

    /**
     * Example 6: Using MapperConfig to get mappers
     */
    public AdherentDTO mapAdherentUsingConfig(Adherent adherent) {
        AdherentMapper mapper = mapperConfig.getAdherentMapper();
        return mapper.toDTO(adherent);
    }

    /**
     * Example 7: Stream-based mapping (alternative to toDTOList)
     */
    public List<ProduitDTO> mapProduitsUsingStream(List<Produit> produits) {
        return produits.stream()
                .map(produitMapper::toDTO)
                .toList();
    }

    /**
     * Example 8: Conditional mapping
     */
    public ProduitDTO mapProduitConditionally(Produit produit, boolean includeCategory) {
        ProduitDTO dto = produitMapper.toDTO(produit);
        
        if (!includeCategory) {
            dto.setCategorieId(null);
        }
        
        return dto;
    }

    /**
     * Example 9: Batch processing with mappers
     */
    public void processProduits(List<Produit> produits) {
        List<ProduitDTO> dtos = produitMapper.toDTOList(produits);
        
        // Process DTOs
        dtos.forEach(dto -> {
            // Business logic here
            System.out.println("Processing product: " + dto.getNom());
        });
        
        // Convert back to entities if needed
        List<Produit> updatedProduits = produitMapper.toEntityList(dtos);
    }

    /**
     * Example 10: Error handling with mappers
     */
    public ProduitDTO mapProduitWithErrorHandling(Produit produit) {
        try {
            return produitMapper.toDTO(produit);
        } catch (Exception e) {
            // Handle mapping errors
            System.err.println("Error mapping produit: " + e.getMessage());
            return null;
        }
    }
} 