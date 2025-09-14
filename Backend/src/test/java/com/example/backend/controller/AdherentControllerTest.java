package com.example.backend.controller;

import com.example.backend.entity.Adherent;
import com.example.backend.service.AdherentService;
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

@WebMvcTest(AdherentController.class)
public class AdherentControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdherentService adherentService;

    @Autowired
    private ObjectMapper objectMapper;

    private Adherent adherent1;
    private Adherent adherent2;

    @BeforeEach
    void setUp() {
        adherent1 = new Adherent();
        adherent1.setId(1);
        adherent1.setNom("Doe");
        adherent1.setPrénom("John");
        adherent1.setEmail("john.doe@example.com");

        adherent2 = new Adherent();
        adherent2.setId(2);
        adherent2.setNom("Smith");
        adherent2.setPrénom("Jane");
        adherent2.setEmail("jane.smith@example.com");
    }

    @Test
    void testCreateAdherent_WithValidData_ShouldReturnCreatedAdherent() throws Exception {
        // Given
        Adherent inputAdherent = new Adherent();
        inputAdherent.setNom("New");
        inputAdherent.setPrénom("User");
        inputAdherent.setEmail("new.user@example.com");

        Adherent savedAdherent = new Adherent();
        savedAdherent.setId(3);
        savedAdherent.setNom("New");
        savedAdherent.setPrénom("User");
        savedAdherent.setEmail("new.user@example.com");

        // When
        when(adherentService.saveAdherent(any(Adherent.class))).thenReturn(savedAdherent);

        // Then
        mockMvc.perform(post("/api/adherents")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputAdherent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.nom").value("New"))
                .andExpect(jsonPath("$.prénom").value("User"))
                .andExpect(jsonPath("$.email").value("new.user@example.com"));

        verify(adherentService).saveAdherent(any(Adherent.class));
    }

    @Test
    void testGetAllAdherents_WithMultipleAdherents_ShouldReturnAllAdherents() throws Exception {
        // Given
        Iterable<Adherent> adherents = Arrays.asList(adherent1, adherent2);

        // When
        when(adherentService.getAllAdherents()).thenReturn(Arrays.asList(adherent1, adherent2));

        // Then
        mockMvc.perform(get("/api/adherents")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nom").value("Doe"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].nom").value("Smith"));

        verify(adherentService).getAllAdherents();
    }

    @Test
    void testGetAdherentById_WithValidId_ShouldReturnAdherent() throws Exception {
        // Given
        Integer adherentId = 1;

        // When
        when(adherentService.getAdherentById(adherentId)).thenReturn(Optional.of(adherent1));

        // Then
        mockMvc.perform(get("/api/adherents/{id}", adherentId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nom").value("Doe"))
                .andExpect(jsonPath("$.prénom").value("John"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));

        verify(adherentService).getAdherentById(adherentId);
    }

    @Test
    void testGetAdherentById_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        // Given
        Integer adherentId = 999;

        // When
        when(adherentService.getAdherentById(adherentId)).thenReturn(Optional.empty());

        // Then
        mockMvc.perform(get("/api/adherents/{id}", adherentId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(adherentService).getAdherentById(adherentId);
    }

    @Test
    void testGetAdherentByEmail_WithValidEmail_ShouldReturnAdherent() throws Exception {
        // Given
        String email = "john.doe@example.com";

        // When
        when(adherentService.getAdherentByEmail(email)).thenReturn(Optional.of(adherent1));

        // Then
        mockMvc.perform(get("/api/adherents/email/{email}", email)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nom").value("Doe"))
                .andExpect(jsonPath("$.prénom").value("John"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));

        verify(adherentService).getAdherentByEmail(email);
    }

    @Test
    void testGetAdherentByEmail_WithNonExistentEmail_ShouldReturnNotFound() throws Exception {
        // Given
        String email = "nonexistent@example.com";

        // When
        when(adherentService.getAdherentByEmail(email)).thenReturn(Optional.empty());

        // Then
        mockMvc.perform(get("/api/adherents/email/{email}", email)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(adherentService).getAdherentByEmail(email);
    }

    @Test
    void testUpdateAdherent_WithValidData_ShouldReturnUpdatedAdherent() throws Exception {
        // Given
        Integer adherentId = 1;
        Adherent updatedAdherent = new Adherent();
        updatedAdherent.setId(1);
        updatedAdherent.setNom("Updated");
        updatedAdherent.setPrénom("User");
        updatedAdherent.setEmail("updated.user@example.com");

        // When
        when(adherentService.updateAdherent(eq(adherentId), any(Adherent.class))).thenReturn(updatedAdherent);

        // Then
        mockMvc.perform(put("/api/adherents/{id}", adherentId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedAdherent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nom").value("Updated"))
                .andExpect(jsonPath("$.prénom").value("User"))
                .andExpect(jsonPath("$.email").value("updated.user@example.com"));

        verify(adherentService).updateAdherent(eq(adherentId), any(Adherent.class));
    }

    @Test
    void testDeleteAdherent_WithValidId_ShouldReturnNoContent() throws Exception {
        // Given
        Integer adherentId = 1;

        // When
        doNothing().when(adherentService).deleteAdherent(adherentId);

        // Then
        mockMvc.perform(delete("/api/adherents/{id}", adherentId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(adherentService).deleteAdherent(adherentId);
    }

    @Test
    void testMakeAdmin_WithValidIdAndNonAdminEmail_ShouldReturnUpdatedAdherent() throws Exception {
        // Given
        Integer adherentId = 1;
        Adherent adherent = new Adherent();
        adherent.setId(1);
        adherent.setNom("Doe");
        adherent.setPrénom("John");
        adherent.setEmail("john.doe@example.com");

        Adherent adminAdherent = new Adherent();
        adminAdherent.setId(1);
        adminAdherent.setNom("Doe");
        adminAdherent.setPrénom("John");
        adminAdherent.setEmail("admin.john.doe@example.com");

        // When
        when(adherentService.getAdherentById(adherentId)).thenReturn(Optional.of(adherent));
        when(adherentService.updateAdherent(eq(adherentId), any(Adherent.class))).thenReturn(adminAdherent);

        // Then
        mockMvc.perform(post("/api/adherents/{id}/make-admin", adherentId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nom").value("Doe"))
                .andExpect(jsonPath("$.prénom").value("John"))
                .andExpect(jsonPath("$.email").value("admin.john.doe@example.com"));

        verify(adherentService).getAdherentById(adherentId);
        verify(adherentService).updateAdherent(eq(adherentId), any(Adherent.class));
    }

    @Test
    void testMakeAdmin_WithValidIdAndAlreadyAdminEmail_ShouldReturnSameAdherent() throws Exception {
        // Given
        Integer adherentId = 1;
        Adherent adminAdherent = new Adherent();
        adminAdherent.setId(1);
        adminAdherent.setNom("Doe");
        adminAdherent.setPrénom("John");
        adminAdherent.setEmail("admin.john.doe@example.com"); // Already has "admin"

        // When
        when(adherentService.getAdherentById(adherentId)).thenReturn(Optional.of(adminAdherent));

        // Then
        mockMvc.perform(post("/api/adherents/{id}/make-admin", adherentId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nom").value("Doe"))
                .andExpect(jsonPath("$.prénom").value("John"))
                .andExpect(jsonPath("$.email").value("admin.john.doe@example.com"));

        verify(adherentService).getAdherentById(adherentId);
        verify(adherentService, never()).updateAdherent(any(), any());
    }

    @Test
    void testMakeAdmin_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        // Given
        Integer adherentId = 999;

        // When
        when(adherentService.getAdherentById(adherentId)).thenReturn(Optional.empty());

        // Then
        mockMvc.perform(post("/api/adherents/{id}/make-admin", adherentId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(adherentService).getAdherentById(adherentId);
        verify(adherentService, never()).updateAdherent(any(), any());
    }
}