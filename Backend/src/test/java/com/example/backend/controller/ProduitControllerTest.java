package com.example.backend.controller;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.exception.NotFoundException;
import com.example.backend.service.ProduitService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProduitController.class)
public class ProduitControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProduitService produitService;

    @Autowired
    private ObjectMapper objectMapper;

    private ProduitDTO produitDTO1;
    private ProduitDTO produitDTO2;

    @BeforeEach
    void setUp() {
        produitDTO1 = new ProduitDTO();
        produitDTO1.setId(1);
        produitDTO1.setNom("Produit 1");
        produitDTO1.setDescription("Description 1");
        produitDTO1.setPrix(100.0f);

        produitDTO2 = new ProduitDTO();
        produitDTO2.setId(2);
        produitDTO2.setNom("Produit 2");
        produitDTO2.setDescription("Description 2");
        produitDTO2.setPrix(200.0f);
    }

    @Test
    void testCreateProduit_WithValidData_ShouldReturnCreatedProduit() throws Exception {
        // Given
        ProduitDTO inputDTO = new ProduitDTO();
        inputDTO.setNom("New Produit");
        inputDTO.setDescription("New Description");
        inputDTO.setPrix(150.0f);

        ProduitDTO savedDTO = new ProduitDTO();
        savedDTO.setId(3);
        savedDTO.setNom("New Produit");
        savedDTO.setDescription("New Description");
        savedDTO.setPrix(150.0f);

        // When
        when(produitService.saveProduit(any(ProduitDTO.class))).thenReturn(savedDTO);

        // Then
        mockMvc.perform(post("/api/produits")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.nom").value("New Produit"))
                .andExpect(jsonPath("$.description").value("New Description"))
                .andExpect(jsonPath("$.prix").value(150.0));

        verify(produitService).saveProduit(any(ProduitDTO.class));
    }

    @Test
    void testGetAllProduits_WithMultipleProducts_ShouldReturnAllProducts() throws Exception {
        // Given
        List<ProduitDTO> produits = Arrays.asList(produitDTO1, produitDTO2);

        // When
        when(produitService.getAllProduits()).thenReturn(produits);

        // Then
        mockMvc.perform(get("/api/produits")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nom").value("Produit 1"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].nom").value("Produit 2"));

        verify(produitService).getAllProduits();
    }

    @Test
    void testGetProduitById_WithValidId_ShouldReturnProduct() throws Exception {
        // Given
        Integer produitId = 1;

        // When
        when(produitService.getProduitById(produitId)).thenReturn(produitDTO1);

        // Then
        mockMvc.perform(get("/api/produits/{id}", produitId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nom").value("Produit 1"))
                .andExpect(jsonPath("$.description").value("Description 1"))
                .andExpect(jsonPath("$.prix").value(100.0));

        verify(produitService).getProduitById(produitId);
    }

    @Test
    void testGetProduitById_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        // Given
        Integer produitId = 999;

        // When
        when(produitService.getProduitById(produitId)).thenThrow(new NotFoundException("Produit not found with id: " + produitId));

        // Then
        mockMvc.perform(get("/api/produits/{id}", produitId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(produitService).getProduitById(produitId);
    }

    @Test
    void testUpdateProduit_WithValidData_ShouldReturnUpdatedProduct() throws Exception {
        // Given
        Integer produitId = 1;
        ProduitDTO updatedDTO = new ProduitDTO();
        updatedDTO.setId(1);
        updatedDTO.setNom("Updated Produit");
        updatedDTO.setDescription("Updated Description");
        updatedDTO.setPrix(300.0f);

        // When
        when(produitService.updateProduit(eq(produitId), any(ProduitDTO.class))).thenReturn(updatedDTO);

        // Then
        mockMvc.perform(put("/api/produits/{id}", produitId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nom").value("Updated Produit"))
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.prix").value(300.0));

        verify(produitService).updateProduit(eq(produitId), any(ProduitDTO.class));
    }

    @Test
    void testUpdateProduit_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        // Given
        Integer produitId = 999;
        ProduitDTO updatedDTO = new ProduitDTO();
        updatedDTO.setId(999);
        updatedDTO.setNom("Updated Produit");
        updatedDTO.setDescription("Updated Description");
        updatedDTO.setPrix(300.0f);

        // When
        when(produitService.updateProduit(eq(produitId), any(ProduitDTO.class)))
                .thenThrow(new NotFoundException("Produit not found with id: " + produitId));

        // Then
        mockMvc.perform(put("/api/produits/{id}", produitId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDTO)))
                .andExpect(status().isNotFound());

        verify(produitService).updateProduit(eq(produitId), any(ProduitDTO.class));
    }

    @Test
    void testDeleteProduit_WithValidId_ShouldReturnNoContent() throws Exception {
        // Given
        Integer produitId = 1;

        // When
        doNothing().when(produitService).deleteProduit(produitId);

        // Then
        mockMvc.perform(delete("/api/produits/{id}", produitId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(produitService).deleteProduit(produitId);
    }

    @Test
    void testDeleteProduit_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        // Given
        Integer produitId = 999;

        // When
        doThrow(new NotFoundException("Produit not found with id: " + produitId))
                .when(produitService).deleteProduit(produitId);

        // Then
        mockMvc.perform(delete("/api/produits/{id}", produitId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(produitService).deleteProduit(produitId);
    }
}