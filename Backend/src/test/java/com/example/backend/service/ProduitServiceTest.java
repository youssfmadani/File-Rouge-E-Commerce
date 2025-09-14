package com.example.backend.service;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.entity.Categorie;
import com.example.backend.entity.Produit;
import com.example.backend.exception.NotFoundException;
import com.example.backend.mapper.ProduitMapper;
import com.example.backend.repository.CategorieRepository;
import com.example.backend.repository.ProduitRepository;
import com.example.backend.service.impl.ProduitServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProduitServiceTest {
    @Mock
    private ProduitRepository produitRepository;

    @Mock
    private CategorieRepository categorieRepository;

    @Mock
    private ProduitMapper produitMapper;

    @InjectMocks
    private ProduitServiceImpl produitService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveProduit_WithValidData_ShouldReturnSavedProduit() {
        // Given
        ProduitDTO produitDTO = new ProduitDTO();
        produitDTO.setNom("Test Produit");
        produitDTO.setDescription("Test Description");
        produitDTO.setPrix(99.99f);
        produitDTO.setCategorieId(1);

        Produit produit = new Produit();
        produit.setNom("Test Produit");
        produit.setDescription("Test Description");
        produit.setPrix(99.99f);

        Categorie categorie = new Categorie();
        categorie.setId(1);

        Produit savedProduit = new Produit();
        savedProduit.setIdProduit(1);
        savedProduit.setNom("Test Produit");
        savedProduit.setDescription("Test Description");
        savedProduit.setPrix(99.99f);
        savedProduit.setCategorie(categorie);

        ProduitDTO savedProduitDTO = new ProduitDTO();
        savedProduitDTO.setId(1);
        savedProduitDTO.setNom("Test Produit");
        savedProduitDTO.setDescription("Test Description");
        savedProduitDTO.setPrix(99.99f);
        savedProduitDTO.setCategorieId(1);

        // When
        when(produitMapper.toEntity(produitDTO)).thenReturn(produit);
        when(categorieRepository.findById(1)).thenReturn(Optional.of(categorie));
        when(produitRepository.save(produit)).thenReturn(savedProduit);
        when(produitMapper.toDTO(savedProduit)).thenReturn(savedProduitDTO);

        ProduitDTO result = produitService.saveProduit(produitDTO);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Test Produit", result.getNom());
        assertEquals("Test Description", result.getDescription());
        assertEquals(99.99f, result.getPrix());
        assertEquals(1, result.getCategorieId());

        verify(produitMapper).toEntity(produitDTO);
        verify(categorieRepository).findById(1);
        verify(produitRepository).save(produit);
        verify(produitMapper).toDTO(savedProduit);
    }

    @Test
    void testSaveProduit_WithNonExistentCategorie_ShouldThrowNotFoundException() {
        // Given
        ProduitDTO produitDTO = new ProduitDTO();
        produitDTO.setCategorieId(999); // Non-existent category ID

        // When & Then
        when(categorieRepository.findById(999)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            produitService.saveProduit(produitDTO);
        });

        assertEquals("Categorie not found with id: 999", exception.getMessage());
        verify(categorieRepository).findById(999);
        verify(produitRepository, never()).save(any());
    }

    @Test
    void testUpdateProduit_WithValidData_ShouldReturnUpdatedProduit() {
        // Given
        Integer produitId = 1;
        ProduitDTO produitDTO = new ProduitDTO();
        produitDTO.setNom("Updated Produit");
        produitDTO.setDescription("Updated Description");
        produitDTO.setPrix(199.99f);
        produitDTO.setImage("updated-image.jpg");
        produitDTO.setCategorieId(2);

        Produit existingProduit = new Produit();
        existingProduit.setIdProduit(1);
        existingProduit.setNom("Old Produit");
        existingProduit.setDescription("Old Description");
        existingProduit.setPrix(99.99f);
        existingProduit.setImage("old-image.jpg");

        Categorie newCategorie = new Categorie();
        newCategorie.setId(2);

        Produit updatedProduit = new Produit();
        updatedProduit.setIdProduit(1);
        updatedProduit.setNom("Updated Produit");
        updatedProduit.setDescription("Updated Description");
        updatedProduit.setPrix(199.99f);
        updatedProduit.setImage("updated-image.jpg");
        updatedProduit.setCategorie(newCategorie);

        ProduitDTO updatedProduitDTO = new ProduitDTO();
        updatedProduitDTO.setId(1);
        updatedProduitDTO.setNom("Updated Produit");
        updatedProduitDTO.setDescription("Updated Description");
        updatedProduitDTO.setPrix(199.99f);
        updatedProduitDTO.setImage("updated-image.jpg");
        updatedProduitDTO.setCategorieId(2);

        // When
        when(produitRepository.findById(produitId)).thenReturn(Optional.of(existingProduit));
        when(categorieRepository.findById(2)).thenReturn(Optional.of(newCategorie));
        when(produitRepository.save(existingProduit)).thenReturn(updatedProduit);
        when(produitMapper.toDTO(updatedProduit)).thenReturn(updatedProduitDTO);

        ProduitDTO result = produitService.updateProduit(produitId, produitDTO);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Updated Produit", result.getNom());
        assertEquals("Updated Description", result.getDescription());
        assertEquals(199.99f, result.getPrix());
        assertEquals("updated-image.jpg", result.getImage());
        assertEquals(2, result.getCategorieId());

        verify(produitRepository).findById(produitId);
        verify(categorieRepository).findById(2);
        verify(produitRepository).save(existingProduit);
        verify(produitMapper).toDTO(updatedProduit);
    }

    @Test
    void testUpdateProduit_WithNonExistentProduit_ShouldThrowNotFoundException() {
        // Given
        Integer produitId = 999;
        ProduitDTO produitDTO = new ProduitDTO();

        // When & Then
        when(produitRepository.findById(produitId)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            produitService.updateProduit(produitId, produitDTO);
        });

        assertEquals("Produit not found with id: 999", exception.getMessage());
        verify(produitRepository).findById(produitId);
        verify(produitRepository, never()).save(any());
    }

    @Test
    void testDeleteProduit_WithValidId_ShouldDeleteSuccessfully() {
        // Given
        Integer produitId = 1;

        // When
        when(produitRepository.existsById(produitId)).thenReturn(true);
        doNothing().when(produitRepository).deleteById(produitId);

        produitService.deleteProduit(produitId);

        // Then
        verify(produitRepository).existsById(produitId);
        verify(produitRepository).deleteById(produitId);
    }

    @Test
    void testDeleteProduit_WithNonExistentId_ShouldThrowNotFoundException() {
        // Given
        Integer produitId = 999;

        // When & Then
        when(produitRepository.existsById(produitId)).thenReturn(false);

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            produitService.deleteProduit(produitId);
        });

        assertEquals("Produit not found with id: 999", exception.getMessage());
        verify(produitRepository).existsById(produitId);
        verify(produitRepository, never()).deleteById(any());
    }

    @Test
    void testGetProduitById_WithValidId_ShouldReturnProduit() {
        // Given
        Integer produitId = 1;

        Produit produit = new Produit();
        produit.setIdProduit(1);
        produit.setNom("Test Produit");
        produit.setDescription("Test Description");
        produit.setPrix(99.99f);

        ProduitDTO produitDTO = new ProduitDTO();
        produitDTO.setId(1);
        produitDTO.setNom("Test Produit");
        produitDTO.setDescription("Test Description");
        produitDTO.setPrix(99.99f);

        // When
        when(produitRepository.findById(produitId)).thenReturn(Optional.of(produit));
        when(produitMapper.toDTO(produit)).thenReturn(produitDTO);

        ProduitDTO result = produitService.getProduitById(produitId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Test Produit", result.getNom());
        assertEquals("Test Description", result.getDescription());
        assertEquals(99.99f, result.getPrix());

        verify(produitRepository).findById(produitId);
        verify(produitMapper).toDTO(produit);
    }

    @Test
    void testGetProduitById_WithNonExistentId_ShouldThrowNotFoundException() {
        // Given
        Integer produitId = 999;

        // When & Then
        when(produitRepository.findById(produitId)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            produitService.getProduitById(produitId);
        });

        assertEquals("Produit not found with id: 999", exception.getMessage());
        verify(produitRepository).findById(produitId);
        verify(produitMapper, never()).toDTO(any());
    }

    @Test
    void testGetAllProduits_WithMultipleProducts_ShouldReturnAllProducts() {
        // Given
        Produit produit1 = new Produit();
        produit1.setIdProduit(1);
        produit1.setNom("Produit 1");

        Produit produit2 = new Produit();
        produit2.setIdProduit(2);
        produit2.setNom("Produit 2");

        ProduitDTO produitDTO1 = new ProduitDTO();
        produitDTO1.setId(1);
        produitDTO1.setNom("Produit 1");

        ProduitDTO produitDTO2 = new ProduitDTO();
        produitDTO2.setId(2);
        produitDTO2.setNom("Produit 2");

        List<Produit> produits = Arrays.asList(produit1, produit2);
        List<ProduitDTO> produitDTOs = Arrays.asList(produitDTO1, produitDTO2);

        // When
        when(produitRepository.findAll()).thenReturn(produits);
        when(produitMapper.toDTO(produit1)).thenReturn(produitDTO1);
        when(produitMapper.toDTO(produit2)).thenReturn(produitDTO2);

        List<ProduitDTO> result = produitService.getAllProduits();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(produitDTOs, result);

        verify(produitRepository).findAll();
        verify(produitMapper, times(2)).toDTO(any(Produit.class));
    }
}