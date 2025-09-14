package com.example.backend.controller;

import com.example.backend.entity.Commande;
import com.example.backend.entity.Status;
import com.example.backend.service.CommandeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommandeController.class)
public class CommandeControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommandeService commandeService;

    @Autowired
    private ObjectMapper objectMapper;

    private Commande commande1;
    private Commande commande2;

    @BeforeEach
    void setUp() {
        commande1 = new Commande();
        commande1.setIdCommande(1);
        commande1.setDateCommande(new Date());
        commande1.setStatut(Status.EN_COURS);

        commande2 = new Commande();
        commande2.setIdCommande(2);
        commande2.setDateCommande(new Date());
        commande2.setStatut(Status.VALIDÉE);
    }

    @Test
    void testCreateCommande_WithValidData_ShouldReturnCreatedCommande() throws Exception {
        // Given
        Commande inputCommande = new Commande();
        inputCommande.setDateCommande(new Date());
        inputCommande.setStatut(Status.EN_COURS);

        Commande savedCommande = new Commande();
        savedCommande.setIdCommande(3);
        savedCommande.setDateCommande(new Date());
        savedCommande.setStatut(Status.EN_COURS);

        // When
        when(commandeService.saveCommande(any(Commande.class))).thenReturn(savedCommande);

        // Then
        mockMvc.perform(post("/api/commandes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputCommande)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idCommande").value(3))
                .andExpect(jsonPath("$.statut").value("EN_COURS"));

        verify(commandeService).saveCommande(any(Commande.class));
    }

    @Test
    void testGetAllCommandes_WithMultipleCommandes_ShouldReturnAllCommandes() throws Exception {
        // Given
        Iterable<Commande> commandes = Arrays.asList(commande1, commande2);

        // When
        when(commandeService.getAllCommandes()).thenReturn(Arrays.asList(commande1, commande2));

        // Then
        mockMvc.perform(get("/api/commandes")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].idCommande").value(1))
                .andExpect(jsonPath("$[0].statut").value("EN_COURS"))
                .andExpect(jsonPath("$[1].idCommande").value(2))
                .andExpect(jsonPath("$[1].statut").value("VALIDÉE"));

        verify(commandeService).getAllCommandes();
    }

    @Test
    void testGetCommandeById_WithValidId_ShouldReturnCommande() throws Exception {
        // Given
        Integer commandeId = 1;

        // When
        when(commandeService.getCommandeById(commandeId)).thenReturn(Optional.of(commande1));

        // Then
        mockMvc.perform(get("/api/commandes/{id}", commandeId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idCommande").value(1))
                .andExpect(jsonPath("$.statut").value("EN_COURS"));

        verify(commandeService).getCommandeById(commandeId);
    }

    @Test
    void testGetCommandeById_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        // Given
        Integer commandeId = 999;

        // When
        when(commandeService.getCommandeById(commandeId)).thenReturn(Optional.empty());

        // Then
        mockMvc.perform(get("/api/commandes/{id}", commandeId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(commandeService).getCommandeById(commandeId);
    }

    @Test
    void testUpdateCommande_WithValidData_ShouldReturnUpdatedCommande() throws Exception {
        // Given
        Integer commandeId = 1;
        Commande updatedCommande = new Commande();
        updatedCommande.setIdCommande(1);
        updatedCommande.setDateCommande(new Date());
        updatedCommande.setStatut(Status.VALIDÉE);

        // When
        when(commandeService.updateCommande(eq(commandeId), any(Commande.class))).thenReturn(updatedCommande);

        // Then
        mockMvc.perform(put("/api/commandes/{id}", commandeId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedCommande)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idCommande").value(1))
                .andExpect(jsonPath("$.statut").value("VALIDÉE"));

        verify(commandeService).updateCommande(eq(commandeId), any(Commande.class));
    }

    @Test
    void testDeleteCommande_WithValidId_ShouldReturnNoContent() throws Exception {
        // Given
        Integer commandeId = 1;

        // When
        doNothing().when(commandeService).deleteCommande(commandeId);

        // Then
        mockMvc.perform(delete("/api/commandes/{id}", commandeId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(commandeService).deleteCommande(commandeId);
    }
}