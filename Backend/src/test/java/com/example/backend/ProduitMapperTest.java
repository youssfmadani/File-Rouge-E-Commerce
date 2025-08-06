package com.example.backend;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.entity.Categorie;
import com.example.backend.entity.Produit;
import com.example.backend.mapper.ProduitMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.*;

public class ProduitMapperTest {

    private final ProduitMapper mapper = Mappers.getMapper(ProduitMapper.class);

    @Test
    void testEntityToDTO() {
        Categorie categorie = new Categorie();
        categorie.setId(5);
        Produit produit = new Produit();
        produit.setIdProduit(1);
        produit.setNom("Test Produit");
        produit.setDescription("Description");
        produit.setPrix(99.99f);
        produit.setCategorie(categorie);

        ProduitDTO dto = mapper.toDTO(produit);
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals("Test Produit", dto.getNom());
        assertEquals("Description", dto.getDescription());
        assertEquals(99.99f, dto.getPrix());
        assertEquals(5, dto.getCategorieId());
    }

    @Test
    void testDTOToEntity() {
        ProduitDTO dto = new ProduitDTO();
        dto.setId(2);
        dto.setNom("Produit DTO");
        dto.setDescription("DTO Desc");
        dto.setPrix(10.5f);
        dto.setCategorieId(7);

        Produit produit = mapper.toEntity(dto);
        assertNotNull(produit);
        assertEquals(2, produit.getIdProduit());
        assertEquals("Produit DTO", produit.getNom());
        assertEquals("DTO Desc", produit.getDescription());
        assertEquals(10.5f, produit.getPrix());
        // Categorie is ignored in mapping, should be null
        assertNull(produit.getCategorie());
    }

    @Test
    void testNullSafety() {
        assertNull(mapper.toDTO(null));
        assertNull(mapper.toEntity(null));
    }
} 