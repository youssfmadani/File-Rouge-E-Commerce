package com.example.backend.service;

import com.example.backend.entity.Adherent;
import com.example.backend.repository.AdherentRepository;
import com.example.backend.service.impl.AdherentServiceImpl;
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

public class AdherentServiceTest {
    @Mock
    private AdherentRepository adherentRepository;

    @InjectMocks
    private AdherentServiceImpl adherentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveAdherent() {
        // Given
        Adherent adherent = new Adherent();
        adherent.setId(1);
        adherent.setNom("Doe");
        adherent.setPrénom("John");
        adherent.setEmail("john.doe@example.com");

        // When
        when(adherentRepository.save(adherent)).thenReturn(adherent);

        Adherent result = adherentService.saveAdherent(adherent);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Doe", result.getNom());
        assertEquals("John", result.getPrénom());
        assertEquals("john.doe@example.com", result.getEmail());

        verify(adherentRepository).save(adherent);
    }

    @Test
    void testUpdateAdherent_WithExistingAdherent_ShouldReturnUpdatedAdherent() {
        // Given
        Integer adherentId = 1;
        Adherent existingAdherent = new Adherent();
        existingAdherent.setId(1);
        existingAdherent.setNom("Doe");
        existingAdherent.setPrénom("John");
        existingAdherent.setEmail("john.doe@example.com");
        existingAdherent.setMotDePasse("oldPassword");

        Adherent updatedAdherent = new Adherent();
        updatedAdherent.setId(1);
        updatedAdherent.setNom("Smith");
        updatedAdherent.setPrénom("Jane");
        updatedAdherent.setEmail("jane.smith@example.com");
        updatedAdherent.setMotDePasse("newPassword");

        // When
        when(adherentRepository.findById(adherentId)).thenReturn(Optional.of(existingAdherent));
        when(adherentRepository.save(existingAdherent)).thenReturn(existingAdherent);

        Adherent result = adherentService.updateAdherent(adherentId, updatedAdherent);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Smith", result.getNom());
        assertEquals("Jane", result.getPrénom());
        assertEquals("jane.smith@example.com", result.getEmail());
        assertEquals("newPassword", result.getMotDePasse());

        verify(adherentRepository).findById(adherentId);
        verify(adherentRepository).save(existingAdherent);
    }

    @Test
    void testUpdateAdherent_WithNonExistentAdherent_ShouldThrowException() {
        // Given
        Integer adherentId = 999;
        Adherent updatedAdherent = new Adherent();

        // When
        when(adherentRepository.findById(adherentId)).thenReturn(Optional.empty());

        // Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            adherentService.updateAdherent(adherentId, updatedAdherent);
        });

        assertEquals("Adherent not found with id: 999", exception.getMessage());

        verify(adherentRepository).findById(adherentId);
        verify(adherentRepository, never()).save(any());
    }

    @Test
    void testDeleteAdherent() {
        // Given
        Integer adherentId = 1;

        // When
        doNothing().when(adherentRepository).deleteById(adherentId);

        adherentService.deleteAdherent(adherentId);

        // Then
        verify(adherentRepository).deleteById(adherentId);
    }

    @Test
    void testGetAdherentById_WithExistingAdherent_ShouldReturnAdherent() {
        // Given
        Integer adherentId = 1;
        Adherent adherent = new Adherent();
        adherent.setId(1);
        adherent.setNom("Doe");
        adherent.setPrénom("John");
        adherent.setEmail("john.doe@example.com");

        // When
        when(adherentRepository.findById(adherentId)).thenReturn(Optional.of(adherent));

        Optional<Adherent> result = adherentService.getAdherentById(adherentId);

        // Then
        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
        assertEquals("Doe", result.get().getNom());
        assertEquals("John", result.get().getPrénom());
        assertEquals("john.doe@example.com", result.get().getEmail());

        verify(adherentRepository).findById(adherentId);
    }

    @Test
    void testGetAdherentById_WithNonExistentAdherent_ShouldReturnEmpty() {
        // Given
        Integer adherentId = 999;

        // When
        when(adherentRepository.findById(adherentId)).thenReturn(Optional.empty());

        Optional<Adherent> result = adherentService.getAdherentById(adherentId);

        // Then
        assertFalse(result.isPresent());

        verify(adherentRepository).findById(adherentId);
    }

    @Test
    void testGetAdherentByEmail_WithExistingAdherent_ShouldReturnAdherent() {
        // Given
        String email = "john.doe@example.com";
        Adherent adherent = new Adherent();
        adherent.setId(1);
        adherent.setNom("Doe");
        adherent.setPrénom("John");
        adherent.setEmail(email);

        // When
        when(adherentRepository.findByEmail(email)).thenReturn(Optional.of(adherent));

        Optional<Adherent> result = adherentService.getAdherentByEmail(email);

        // Then
        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
        assertEquals("Doe", result.get().getNom());
        assertEquals("John", result.get().getPrénom());
        assertEquals(email, result.get().getEmail());

        verify(adherentRepository).findByEmail(email);
    }

    @Test
    void testGetAdherentByEmail_WithNonExistentAdherent_ShouldReturnEmpty() {
        // Given
        String email = "nonexistent@example.com";

        // When
        when(adherentRepository.findByEmail(email)).thenReturn(Optional.empty());

        Optional<Adherent> result = adherentService.getAdherentByEmail(email);

        // Then
        assertFalse(result.isPresent());

        verify(adherentRepository).findByEmail(email);
    }

    @Test
    void testGetAllAdherents() {
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

        List<Adherent> adherents = Arrays.asList(adherent1, adherent2);

        // When
        when(adherentRepository.findAll()).thenReturn(adherents);

        List<Adherent> result = adherentService.getAllAdherents();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(adherents, result);

        verify(adherentRepository).findAll();
    }
}