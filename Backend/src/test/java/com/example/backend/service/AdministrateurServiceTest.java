package com.example.backend.service;

import com.example.backend.entity.Administrateur;
import com.example.backend.repository.AdministrateurRepository;
import com.example.backend.service.impl.AdministrateurServiceImpl;
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

public class AdministrateurServiceTest {
    @Mock
    private AdministrateurRepository administrateurRepository;

    @InjectMocks
    private AdministrateurServiceImpl administrateurService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveAdministrateur() {
        // Given
        Administrateur administrateur = new Administrateur();
        administrateur.setId(1);
        administrateur.setNom("Admin");
        administrateur.setPrénom("Super");
        administrateur.setEmail("admin@example.com");

        // When
        when(administrateurRepository.save(administrateur)).thenReturn(administrateur);

        Administrateur result = administrateurService.saveAdministrateur(administrateur);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Admin", result.getNom());
        assertEquals("Super", result.getPrénom());
        assertEquals("admin@example.com", result.getEmail());

        verify(administrateurRepository).save(administrateur);
    }

    @Test
    void testUpdateAdministrateur_WithExistingAdministrateur_ShouldReturnUpdatedAdministrateur() {
        // Given
        Integer administrateurId = 1;
        Administrateur existingAdministrateur = new Administrateur();
        existingAdministrateur.setId(1);
        existingAdministrateur.setNom("Admin");
        existingAdministrateur.setPrénom("Super");
        existingAdministrateur.setEmail("admin@example.com");
        existingAdministrateur.setMotDePasse("oldPassword");

        Administrateur updatedAdministrateur = new Administrateur();
        updatedAdministrateur.setId(1);
        updatedAdministrateur.setNom("Chief");
        updatedAdministrateur.setPrénom("Master");
        updatedAdministrateur.setEmail("chief.admin@example.com");
        updatedAdministrateur.setMotDePasse("newPassword");

        // When
        when(administrateurRepository.findById(administrateurId)).thenReturn(Optional.of(existingAdministrateur));
        when(administrateurRepository.save(existingAdministrateur)).thenReturn(existingAdministrateur);

        Administrateur result = administrateurService.updateAdministrateur(administrateurId, updatedAdministrateur);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Chief", result.getNom());
        assertEquals("Master", result.getPrénom());
        assertEquals("chief.admin@example.com", result.getEmail());
        assertEquals("newPassword", result.getMotDePasse());

        verify(administrateurRepository).findById(administrateurId);
        verify(administrateurRepository).save(existingAdministrateur);
    }

    @Test
    void testUpdateAdministrateur_WithNonExistentAdministrateur_ShouldThrowException() {
        // Given
        Integer administrateurId = 999;
        Administrateur updatedAdministrateur = new Administrateur();

        // When
        when(administrateurRepository.findById(administrateurId)).thenReturn(Optional.empty());

        // Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            administrateurService.updateAdministrateur(administrateurId, updatedAdministrateur);
        });

        assertEquals("Administrateur not found with id: 999", exception.getMessage());

        verify(administrateurRepository).findById(administrateurId);
        verify(administrateurRepository, never()).save(any());
    }

    @Test
    void testDeleteAdministrateur() {
        // Given
        Integer administrateurId = 1;

        // When
        doNothing().when(administrateurRepository).deleteById(administrateurId);

        administrateurService.deleteAdministrateur(administrateurId);

        // Then
        verify(administrateurRepository).deleteById(administrateurId);
    }

    @Test
    void testGetAdministrateurById_WithExistingAdministrateur_ShouldReturnAdministrateur() {
        // Given
        Integer administrateurId = 1;
        Administrateur administrateur = new Administrateur();
        administrateur.setId(1);
        administrateur.setNom("Admin");
        administrateur.setPrénom("Super");
        administrateur.setEmail("admin@example.com");

        // When
        when(administrateurRepository.findById(administrateurId)).thenReturn(Optional.of(administrateur));

        Optional<Administrateur> result = administrateurService.getAdministrateurById(administrateurId);

        // Then
        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
        assertEquals("Admin", result.get().getNom());
        assertEquals("Super", result.get().getPrénom());
        assertEquals("admin@example.com", result.get().getEmail());

        verify(administrateurRepository).findById(administrateurId);
    }

    @Test
    void testGetAdministrateurById_WithNonExistentAdministrateur_ShouldReturnEmpty() {
        // Given
        Integer administrateurId = 999;

        // When
        when(administrateurRepository.findById(administrateurId)).thenReturn(Optional.empty());

        Optional<Administrateur> result = administrateurService.getAdministrateurById(administrateurId);

        // Then
        assertFalse(result.isPresent());

        verify(administrateurRepository).findById(administrateurId);
    }

    @Test
    void testGetAllAdministrateurs() {
        // Given
        Administrateur administrateur1 = new Administrateur();
        administrateur1.setId(1);
        administrateur1.setNom("Admin");
        administrateur1.setPrénom("Super");
        administrateur1.setEmail("admin@example.com");

        Administrateur administrateur2 = new Administrateur();
        administrateur2.setId(2);
        administrateur2.setNom("Chief");
        administrateur2.setPrénom("Master");
        administrateur2.setEmail("chief@example.com");

        List<Administrateur> administrateurs = Arrays.asList(administrateur1, administrateur2);

        // When
        when(administrateurRepository.findAll()).thenReturn(administrateurs);

        List<Administrateur> result = administrateurService.getAllAdministrateurs();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(administrateurs, result);

        verify(administrateurRepository).findAll();
    }
}