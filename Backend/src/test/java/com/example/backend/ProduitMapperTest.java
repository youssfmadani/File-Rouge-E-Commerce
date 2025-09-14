package com.example.backend;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.entity.Categorie;
import com.example.backend.entity.Produit;
import com.example.backend.mapper.ProduitMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ProduitMapperTest {

    private final ProduitMapper mapper = Mappers.getMapper(ProduitMapper.class);

    @Test
    void testEntityToDTO() {
        // Given
        Categorie categorie = new Categorie();
        categorie.setId(5);
        Produit produit = new Produit();
        produit.setIdProduit(1);
        produit.setNom("Test Produit");
        produit.setDescription("Description");
        produit.setPrix(99.99f);
        produit.setImage("test-image.jpg");
        produit.setCategorie(categorie);

        // When
        ProduitDTO dto = mapper.toDTO(produit);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals("Test Produit", dto.getNom());
        assertEquals("Description", dto.getDescription());
        assertEquals(99.99f, dto.getPrix());
        assertEquals("test-image.jpg", dto.getImage());
        assertEquals(5, dto.getCategorieId());
    }

    @Test
    void testDTOToEntity() {
        // Given
        ProduitDTO dto = new ProduitDTO();
        dto.setId(2);
        dto.setNom("Produit DTO");
        dto.setDescription("DTO Desc");
        dto.setPrix(10.5f);
        dto.setImage("dto-image.jpg");
        dto.setCategorieId(7);

        // When
        Produit produit = mapper.toEntity(dto);

        // Then
        assertNotNull(produit);
        assertEquals(2, produit.getIdProduit());
        assertEquals("Produit DTO", produit.getNom());
        assertEquals("DTO Desc", produit.getDescription());
        assertEquals(10.5f, produit.getPrix());
        assertEquals("dto-image.jpg", produit.getImage());
        // Categorie is ignored in mapping, should be null
        assertNull(produit.getCategorie());
    }

    @Test
    void testNullSafety() {
        assertNull(mapper.toDTO(null));
        assertNull(mapper.toEntity(null));
    }

    @Test
    void testEntityListToDTOList() {
        // Given
        Categorie categorie1 = new Categorie();
        categorie1.setId(1);
        Produit produit1 = new Produit();
        produit1.setIdProduit(1);
        produit1.setNom("Produit 1");
        produit1.setDescription("Description 1");
        produit1.setPrix(100.0f);
        produit1.setCategorie(categorie1);

        Categorie categorie2 = new Categorie();
        categorie2.setId(2);
        Produit produit2 = new Produit();
        produit2.setIdProduit(2);
        produit2.setNom("Produit 2");
        produit2.setDescription("Description 2");
        produit2.setPrix(200.0f);
        produit2.setCategorie(categorie2);

        List<Produit> produits = Arrays.asList(produit1, produit2);

        // When
        List<ProduitDTO> dtos = mapper.toDTOList(produits);

        // Then
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(1, dtos.get(0).getId());
        assertEquals("Produit 1", dtos.get(0).getNom());
        assertEquals(1, dtos.get(0).getCategorieId());
        assertEquals(2, dtos.get(1).getId());
        assertEquals("Produit 2", dtos.get(1).getNom());
        assertEquals(2, dtos.get(1).getCategorieId());
    }

    @Test
    void testDTOListToEntityList() {
        // Given
        ProduitDTO dto1 = new ProduitDTO();
        dto1.setId(1);
        dto1.setNom("Produit DTO 1");
        dto1.setDescription("DTO Desc 1");
        dto1.setPrix(100.0f);
        dto1.setCategorieId(1);

        ProduitDTO dto2 = new ProduitDTO();
        dto2.setId(2);
        dto2.setNom("Produit DTO 2");
        dto2.setDescription("DTO Desc 2");
        dto2.setPrix(200.0f);
        dto2.setCategorieId(2);

        List<ProduitDTO> dtos = Arrays.asList(dto1, dto2);

        // When
        List<Produit> produits = mapper.toEntityList(dtos);

        // Then
        assertNotNull(produits);
        assertEquals(2, produits.size());
        assertEquals(1, produits.get(0).getIdProduit());
        assertEquals("Produit DTO 1", produits.get(0).getNom());
        // Category should be null as it's ignored in mapping
        assertNull(produits.get(0).getCategorie());
        assertEquals(2, produits.get(1).getIdProduit());
        assertEquals("Produit DTO 2", produits.get(1).getNom());
        assertNull(produits.get(1).getCategorie());
    }

    @Test
    void testEntityToDTO_WithNullCategorie_ShouldSetNullCategorieId() {
        // Given
        Produit produit = new Produit();
        produit.setIdProduit(1);
        produit.setNom("Test Produit");
        produit.setDescription("Description");
        produit.setPrix(99.99f);
        produit.setCategorie(null); // No category

        // When
        ProduitDTO dto = mapper.toDTO(produit);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals("Test Produit", dto.getNom());
        assertEquals("Description", dto.getDescription());
        assertEquals(99.99f, dto.getPrix());
        assertNull(dto.getCategorieId()); // Should be null when category is null
    }

    @Test
    void testEntityToDTO_WithCategorieWithoutId_ShouldSetNullCategorieId() {
        // Given
        Categorie categorie = new Categorie();
        // No ID set
        Produit produit = new Produit();
        produit.setIdProduit(1);
        produit.setNom("Test Produit");
        produit.setDescription("Description");
        produit.setPrix(99.99f);
        produit.setCategorie(categorie);

        // When
        ProduitDTO dto = mapper.toDTO(produit);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals("Test Produit", dto.getNom());
        assertEquals("Description", dto.getDescription());
        assertEquals(99.99f, dto.getPrix());
        assertNull(dto.getCategorieId()); // Should be null when category has no ID
    }
}