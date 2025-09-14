package com.example.backend;

import com.example.backend.dto.CommandeDTO;
import com.example.backend.entity.Adherent;
import com.example.backend.entity.Commande;
import com.example.backend.entity.Panier;
import com.example.backend.entity.Produit;
import com.example.backend.entity.Status;
import com.example.backend.entity.Utilisateur;
import com.example.backend.mapper.CommandeMapper;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class CommandeMapperTest {
    private final CommandeMapper mapper = Mappers.getMapper(CommandeMapper.class);

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

        Commande commande = new Commande();
        commande.setIdCommande(1);
        commande.setDateCommande(new Date());
        commande.setStatut(Status.EN_COURS);
        commande.setAdherent(adherent);
        commande.setProduits(Arrays.asList(produit1, produit2));
        commande.setMontantTotal(150.0);

        // When
        CommandeDTO dto = mapper.toDTO(commande);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals(commande.getDateCommande(), dto.getDateCommande());
        assertEquals("EN_COURS", dto.getStatut());
        assertEquals(1, dto.getAdherentId());
        assertNotNull(dto.getProduitIds());
        assertEquals(2, dto.getProduitIds().size());
        assertTrue(dto.getProduitIds().contains(101));
        assertTrue(dto.getProduitIds().contains(102));
        assertEquals(150.0, dto.getMontantTotal());
    }

    @Test
    void testDTOToEntity() {
        // Given
        CommandeDTO dto = new CommandeDTO();
        dto.setId(1);
        dto.setDateCommande(new Date());
        dto.setStatut("EN_COURS");
        dto.setAdherentId(1);
        dto.setProduitIds(Arrays.asList(101, 102));
        dto.setMontantTotal(150.0);

        // When
        Commande commande = mapper.toEntity(dto);

        // Then
        assertNotNull(commande);
        assertEquals(1, commande.getIdCommande());
        assertEquals(dto.getDateCommande(), commande.getDateCommande());
        assertEquals(Status.EN_COURS, commande.getStatut());
        assertEquals(150.0, commande.getMontantTotal());
        // Adherent and produits are ignored in mapping
        assertNull(commande.getAdherent());
        assertNull(commande.getProduits());
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

        Commande commande1 = new Commande();
        commande1.setIdCommande(1);
        commande1.setDateCommande(new Date());
        commande1.setStatut(Status.EN_COURS);
        commande1.setAdherent(adherent1);
        commande1.setProduits(Arrays.asList(produit1));
        commande1.setMontantTotal(100.0);

        Commande commande2 = new Commande();
        commande2.setIdCommande(2);
        commande2.setDateCommande(new Date());
        commande2.setStatut(Status.VALIDÉE);
        commande2.setAdherent(adherent2);
        commande2.setProduits(Arrays.asList(produit2));
        commande2.setMontantTotal(200.0);

        List<Commande> commandes = Arrays.asList(commande1, commande2);

        // When
        List<CommandeDTO> dtos = mapper.toDTOList(commandes);

        // Then
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(1, dtos.get(0).getId());
        assertEquals("EN_COURS", dtos.get(0).getStatut());
        assertEquals(1, dtos.get(0).getAdherentId());
        assertEquals(1, dtos.get(0).getProduitIds().size());
        assertTrue(dtos.get(0).getProduitIds().contains(101));
        assertEquals(100.0, dtos.get(0).getMontantTotal());

        assertEquals(2, dtos.get(1).getId());
        assertEquals("VALIDÉE", dtos.get(1).getStatut());
        assertEquals(2, dtos.get(1).getAdherentId());
        assertEquals(1, dtos.get(1).getProduitIds().size());
        assertTrue(dtos.get(1).getProduitIds().contains(102));
        assertEquals(200.0, dtos.get(1).getMontantTotal());
    }

    @Test
    void testDTOListToEntityList() {
        // Given
        CommandeDTO dto1 = new CommandeDTO();
        dto1.setId(1);
        dto1.setDateCommande(new Date());
        dto1.setStatut("EN_COURS");
        dto1.setAdherentId(1);
        dto1.setProduitIds(Arrays.asList(101));
        dto1.setMontantTotal(100.0);

        CommandeDTO dto2 = new CommandeDTO();
        dto2.setId(2);
        dto2.setDateCommande(new Date());
        dto2.setStatut("VALIDÉE");
        dto2.setAdherentId(2);
        dto2.setProduitIds(Arrays.asList(102));
        dto2.setMontantTotal(200.0);

        List<CommandeDTO> dtos = Arrays.asList(dto1, dto2);

        // When
        List<Commande> commandes = mapper.toEntityList(dtos);

        // Then
        assertNotNull(commandes);
        assertEquals(2, commandes.size());
        assertEquals(1, commandes.get(0).getIdCommande());
        assertEquals(Status.EN_COURS, commandes.get(0).getStatut());
        assertEquals(100.0, commandes.get(0).getMontantTotal());
        // Adherent and produits are ignored in mapping
        assertNull(commandes.get(0).getAdherent());
        assertNull(commandes.get(0).getProduits());

        assertEquals(2, commandes.get(1).getIdCommande());
        assertEquals(Status.VALIDÉE, commandes.get(1).getStatut());
        assertEquals(200.0, commandes.get(1).getMontantTotal());
        // Adherent and produits are ignored in mapping
        assertNull(commandes.get(1).getAdherent());
        assertNull(commandes.get(1).getProduits());
    }

    @Test
    void testEntityToDTO_WithNullProduits_ShouldHandleGracefully() {
        // Given
        Adherent adherent = new Adherent();
        adherent.setId(1);

        Commande commande = new Commande();
        commande.setIdCommande(1);
        commande.setDateCommande(new Date());
        commande.setStatut(Status.EN_COURS);
        commande.setAdherent(adherent);
        commande.setProduits(null); // Null produits
        commande.setMontantTotal(150.0);

        // When
        CommandeDTO dto = mapper.toDTO(commande);

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

        Commande commande = new Commande();
        commande.setIdCommande(1);
        commande.setDateCommande(new Date());
        commande.setStatut(Status.EN_COURS);
        commande.setAdherent(adherent);
        commande.setProduits(Arrays.asList()); // Empty list
        commande.setMontantTotal(150.0);

        // When
        CommandeDTO dto = mapper.toDTO(commande);

        // Then
        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertNotNull(dto.getProduitIds());
        assertTrue(dto.getProduitIds().isEmpty()); // Should be empty list
    }
}