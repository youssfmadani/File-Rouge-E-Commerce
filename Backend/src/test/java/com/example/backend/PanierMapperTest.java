package com.example.backend;

import com.example.backend.dto.PanierDTO;
import com.example.backend.entity.Adherent;
import com.example.backend.entity.Panier;
import com.example.backend.entity.Produit;
import com.example.backend.entity.Status;
import com.example.backend.mapper.PanierMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class PanierMapperTest {
    private final PanierMapper mapper = Mappers.getMapper(PanierMapper.class);

    @Test
    void testEntityToDTO() {
        // Given
        Adherent adherent = new Adherent();
        adherent.setId(1);
        adherent.setNom("Doe");
        adherent.setPrénom("John");
        adherent.setEmail("john.doe@example.com");

        Produit produit1 = new Produit();
        produit1.setIdProduit(101);
        produit1.setNom("Produit 1");

        Produit produit2 = new Produit();
        produit2.setIdProduit(102);
        produit2.setNom("Produit 2");

        Panier panier = new Panier();
        panier.setIdPanier(1);
        panier.setDateCréation(new Date());
        panier.setStatut(Status.EN_COURS);
        panier.setAdherent(adherent);
        panier.setProduits(Arrays.asList(produit1, produit2));

        // When
        PanierDTO dto = mapper.toDTO(panier);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals(panier.getDateCréation(), dto.getDateCreation());
        assertEquals("EN_COURS", dto.getStatut());
        assertEquals(1, dto.getAdherentId());
        assertNotNull(dto.getProduitIds());
        assertEquals(2, dto.getProduitIds().size());
        assertTrue(dto.getProduitIds().contains(101));
        assertTrue(dto.getProduitIds().contains(102));
    }

    @Test
    void testDTOToEntity() {
        // Given
        PanierDTO dto = new PanierDTO();
        dto.setId(1);
        dto.setDateCreation(new Date());
        dto.setStatut("EN_COURS");
        dto.setAdherentId(1);
        dto.setProduitIds(Arrays.asList(101, 102));

        // When
        Panier panier = mapper.toEntity(dto);

        // Then
        assertNotNull(panier);
        assertEquals(1, panier.getIdPanier());
        assertEquals(dto.getDateCreation(), panier.getDateCréation());
        assertEquals(Status.EN_COURS, panier.getStatut());
        // Adherent and produits are ignored in mapping
        assertNull(panier.getAdherent());
        assertNull(panier.getProduits());
    }

    @Test
    void testNullSafety() {
        assertNull(mapper.toDTO(null));
        assertNull(mapper.toEntity(null));
    }

    @Test
    void testEntityListToDTOList() {
        // Given
        Adherent adherent1 = new Adherent();
        adherent1.setId(1);
        adherent1.setNom("Doe");
        adherent1.setPrénom("John");
        adherent1.setEmail("john.doe@example.com");

        Adherent adherent2 = new Adherent();
        adherent2.setId(2);
        adherent2.setNom("Smith");
        adherent2.setPrénom("Jane");
        adherent2.setEmail("jane.smith@example.com");

        Produit produit1 = new Produit();
        produit1.setIdProduit(101);
        produit1.setNom("Produit 1");

        Produit produit2 = new Produit();
        produit2.setIdProduit(102);
        produit2.setNom("Produit 2");

        Panier panier1 = new Panier();
        panier1.setIdPanier(1);
        panier1.setDateCréation(new Date());
        panier1.setStatut(Status.EN_COURS);
        panier1.setAdherent(adherent1);
        panier1.setProduits(Arrays.asList(produit1));

        Panier panier2 = new Panier();
        panier2.setIdPanier(2);
        panier2.setDateCréation(new Date());
        panier2.setStatut(Status.VALIDÉE);
        panier2.setAdherent(adherent2);
        panier2.setProduits(Arrays.asList(produit2));

        List<Panier> paniers = Arrays.asList(panier1, panier2);

        // When
        List<PanierDTO> dtos = mapper.toDTOList(paniers);

        // Then
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(1, dtos.get(0).getId());
        assertEquals("EN_COURS", dtos.get(0).getStatut());
        assertEquals(1, dtos.get(0).getAdherentId());
        assertEquals(1, dtos.get(0).getProduitIds().size());
        assertTrue(dtos.get(0).getProduitIds().contains(101));

        assertEquals(2, dtos.get(1).getId());
        assertEquals("VALIDÉE", dtos.get(1).getStatut());
        assertEquals(2, dtos.get(1).getAdherentId());
        assertEquals(1, dtos.get(1).getProduitIds().size());
        assertTrue(dtos.get(1).getProduitIds().contains(102));
    }

    @Test
    void testDTOListToEntityList() {
        // Given
        PanierDTO dto1 = new PanierDTO();
        dto1.setId(1);
        dto1.setDateCreation(new Date());
        dto1.setStatut("EN_COURS");
        dto1.setAdherentId(1);
        dto1.setProduitIds(Arrays.asList(101));

        PanierDTO dto2 = new PanierDTO();
        dto2.setId(2);
        dto2.setDateCreation(new Date());
        dto2.setStatut("VALIDÉE");
        dto2.setAdherentId(2);
        dto2.setProduitIds(Arrays.asList(102));

        List<PanierDTO> dtos = Arrays.asList(dto1, dto2);

        // When
        List<Panier> paniers = mapper.toEntityList(dtos);

        // Then
        assertNotNull(paniers);
        assertEquals(2, paniers.size());
        assertEquals(1, paniers.get(0).getIdPanier());
        assertEquals(Status.EN_COURS, paniers.get(0).getStatut());
        // Adherent and produits are ignored in mapping
        assertNull(paniers.get(0).getAdherent());
        assertNull(paniers.get(0).getProduits());

        assertEquals(2, paniers.get(1).getIdPanier());
        assertEquals(Status.VALIDÉE, paniers.get(1).getStatut());
        // Adherent and produits are ignored in mapping
        assertNull(paniers.get(1).getAdherent());
        assertNull(paniers.get(1).getProduits());
    }

    @Test
    void testEntityToDTO_WithNullProduits_ShouldHandleGracefully() {
        // Given
        Adherent adherent = new Adherent();
        adherent.setId(1);

        Panier panier = new Panier();
        panier.setIdPanier(1);
        panier.setDateCréation(new Date());
        panier.setStatut(Status.EN_COURS);
        panier.setAdherent(adherent);
        panier.setProduits(null); // Null produits

        // When
        PanierDTO dto = mapper.toDTO(panier);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertNull(dto.getProduitIds()); // Should be null when produits is null
    }

    @Test
    void testEntityToDTO_WithEmptyProduits_ShouldReturnEmptyList() {
        // Given
        Adherent adherent = new Adherent();
        adherent.setId(1);

        Panier panier = new Panier();
        panier.setIdPanier(1);
        panier.setDateCréation(new Date());
        panier.setStatut(Status.EN_COURS);
        panier.setAdherent(adherent);
        panier.setProduits(Arrays.asList()); // Empty list

        // When
        PanierDTO dto = mapper.toDTO(panier);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertNotNull(dto.getProduitIds());
        assertTrue(dto.getProduitIds().isEmpty()); // Should be empty list
    }
}