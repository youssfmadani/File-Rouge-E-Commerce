package com.example.backend.controller;

import com.example.backend.entity.Administrateur;
import com.example.backend.service.AdministrateurService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdministrateurController.class)
public class AdministrateurControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdministrateurService administrateurService;

    @Autowired
    private ObjectMapper objectMapper;

    private Administrateur administrateur1;
    private Administrateur administrateur2;

    @BeforeEach
    void setUp() {
        administrateur1 = new Administrateur();
        administrateur1.setId(1);
        administrateur1.setNom("Admin");
        administrateur1.setPrénom("Super");
        administrateur1.setEmail("admin@example.com");

        administrateur2 = new Administrateur();
        administrateur2.setId(2);
        administrateur2.setNom("Chief");
        administrateur2.setPrénom("Master");
        administrateur2.setEmail("chief@example.com");
    }

    @Test
    void testCreateAdministrateur_WithValidData_ShouldReturnCreatedAdministrateur() throws Exception {
        // Given
        Administrateur inputAdministrateur = new Administrateur();
        inputAdministrateur.setNom("New");
        inputAdministrateur.setPrénom("Admin");
        inputAdministrateur.setEmail("new.admin@example.com");

        Administrateur savedAdministrateur = new Administrateur();
        savedAdministrateur.setId(3);
        savedAdministrateur.setNom("New");
        savedAdministrateur.setPrénom("Admin");
        savedAdministrateur.setEmail("new.admin@example.com");

        // When
        when(administrateurService.saveAdministrateur(any(Administrateur.class))).thenReturn(savedAdministrateur);

        // Then
        mockMvc.perform(post("/api/administrateurs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputAdministrateur)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.nom").value("New"))
                .andExpect(jsonPath("$.prénom").value("Admin"))
                .andExpect(jsonPath("$.email").value("new.admin@example.com"));

        verify(administrateurService).saveAdministrateur(any(Administrateur.class));
    }

    @Test
    void testGetAllAdministrateurs_WithMultipleAdministrateurs_ShouldReturnAllAdministrateurs() throws Exception {
        // Given
        Iterable<Administrateur> administrateurs = Arrays.asList(administrateur1, administrateur2);

        // When
        when(administrateurService.getAllAdministrateurs()).thenReturn(Arrays.asList(administrateur1, administrateur2));

        // Then
        mockMvc.perform(get("/api/administrateurs")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nom").value("Admin"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].nom").value("Chief"));

        verify(administrateurService).getAllAdministrateurs();
    }

    @Test
    void testGetAdministrateurById_WithValidId_ShouldReturnAdministrateur() throws Exception {
        // Given
        Integer administrateurId = 1;

        // When
        when(administrateurService.getAdministrateurById(administrateurId)).thenReturn(Optional.of(administrateur1));

        // Then
        mockMvc.perform(get("/api/administrateurs/{id}", administrateurId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nom").value("Admin"))
                .andExpect(jsonPath("$.prénom").value("Super"))
                .andExpect(jsonPath("$.email").value("admin@example.com"));

        verify(administrateurService).getAdministrateurById(administrateurId);
    }

    @Test
    void testGetAdministrateurById_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        // Given
        Integer administrateurId = 999;

        // When
        when(administrateurService.getAdministrateurById(administrateurId)).thenReturn(Optional.empty());

        // Then
        mockMvc.perform(get("/api/administrateurs/{id}", administrateurId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(administrateurService).getAdministrateurById(administrateurId);
    }

    @Test
    void testUpdateAdministrateur_WithValidData_ShouldReturnUpdatedAdministrateur() throws Exception {
        // Given
        Integer administrateurId = 1;
        Administrateur updatedAdministrateur = new Administrateur();
        updatedAdministrateur.setId(1);
        updatedAdministrateur.setNom("Updated");
        updatedAdministrateur.setPrénom("Admin");
        updatedAdministrateur.setEmail("updated.admin@example.com");

        // When
        when(administrateurService.updateAdministrateur(eq(administrateurId), any(Administrateur.class))).thenReturn(updatedAdministrateur);

        // Then
        mockMvc.perform(put("/api/administrateurs/{id}", administrateurId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedAdministrateur)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nom").value("Updated"))
                .andExpect(jsonPath("$.prénom").value("Admin"))
                .andExpect(jsonPath("$.email").value("updated.admin@example.com"));

        verify(administrateurService).updateAdministrateur(eq(administrateurId), any(Administrateur.class));
    }

    @Test
    void testDeleteAdministrateur_WithValidId_ShouldReturnNoContent() throws Exception {
        // Given
        Integer administrateurId = 1;

        // When
        doNothing().when(administrateurService).deleteAdministrateur(administrateurId);

        // Then
        mockMvc.perform(delete("/api/administrateurs/{id}", administrateurId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(administrateurService).deleteAdministrateur(administrateurId);
    }
}