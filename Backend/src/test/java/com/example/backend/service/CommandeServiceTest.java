package com.example.backend.service;

import com.example.backend.entity.Commande;
import com.example.backend.entity.Status;
import com.example.backend.repository.CommandeRepository;
import com.example.backend.service.impl.CommandeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CommandeServiceTest {
    @Mock
    private CommandeRepository commandeRepository;

    @InjectMocks
    private CommandeServiceImpl commandeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveCommande() {
        // Given
        Commande commande = new Commande();
        commande.setIdCommande(1);
        commande.setDateCommande(new Date());
        commande.setStatut(Status.EN_COURS);

        // When
        when(commandeRepository.save(commande)).thenReturn(commande);

        Commande result = commandeService.saveCommande(commande);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getIdCommande());
        assertEquals(Status.EN_COURS, result.getStatut());

        verify(commandeRepository).save(commande);
    }

    @Test
    void testUpdateCommande_WithExistingCommande_ShouldReturnUpdatedCommande() {
        // Given
        Integer commandeId = 1;
        Commande existingCommande = new Commande();
        existingCommande.setIdCommande(1);
        existingCommande.setDateCommande(new Date());
        existingCommande.setStatut(Status.EN_COURS);

        Commande updatedCommande = new Commande();
        updatedCommande.setIdCommande(1);
        updatedCommande.setDateCommande(new Date());
        updatedCommande.setStatut(Status.VALIDÉE);

        // When
        when(commandeRepository.findById(commandeId)).thenReturn(Optional.of(existingCommande));
        when(commandeRepository.save(existingCommande)).thenReturn(existingCommande);

        Commande result = commandeService.updateCommande(commandeId, updatedCommande);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getIdCommande());
        assertEquals(Status.VALIDÉE, result.getStatut());

        verify(commandeRepository).findById(commandeId);
        verify(commandeRepository).save(existingCommande);
    }

    @Test
    void testUpdateCommande_WithNonExistentCommande_ShouldThrowException() {
        // Given
        Integer commandeId = 999;
        Commande updatedCommande = new Commande();

        // When
        when(commandeRepository.findById(commandeId)).thenReturn(Optional.empty());

        // Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            commandeService.updateCommande(commandeId, updatedCommande);
        });

        assertEquals("Commande not found with id: 999", exception.getMessage());

        verify(commandeRepository).findById(commandeId);
        verify(commandeRepository, never()).save(any());
    }

    @Test
    void testDeleteCommande() {
        // Given
        Integer commandeId = 1;

        // When
        doNothing().when(commandeRepository).deleteById(commandeId);

        commandeService.deleteCommande(commandeId);

        // Then
        verify(commandeRepository).deleteById(commandeId);
    }

    @Test
    void testGetCommandeById_WithExistingCommande_ShouldReturnCommande() {
        // Given
        Integer commandeId = 1;
        Commande commande = new Commande();
        commande.setIdCommande(1);
        commande.setDateCommande(new Date());
        commande.setStatut(Status.EN_COURS);

        // When
        when(commandeRepository.findById(commandeId)).thenReturn(Optional.of(commande));

        Optional<Commande> result = commandeService.getCommandeById(commandeId);

        // Then
        assertTrue(result.isPresent());
        assertEquals(1, result.get().getIdCommande());
        assertEquals(Status.EN_COURS, result.get().getStatut());

        verify(commandeRepository).findById(commandeId);
    }

    @Test
    void testGetCommandeById_WithNonExistentCommande_ShouldReturnEmpty() {
        // Given
        Integer commandeId = 999;

        // When
        when(commandeRepository.findById(commandeId)).thenReturn(Optional.empty());

        Optional<Commande> result = commandeService.getCommandeById(commandeId);

        // Then
        assertFalse(result.isPresent());

        verify(commandeRepository).findById(commandeId);
    }

    @Test
    void testGetAllCommandes() {
        // Given
        Commande commande1 = new Commande();
        commande1.setIdCommande(1);
        commande1.setDateCommande(new Date());
        commande1.setStatut(Status.EN_COURS);

        Commande commande2 = new Commande();
        commande2.setIdCommande(2);
        commande2.setDateCommande(new Date());
        commande2.setStatut(Status.VALIDÉE);

        List<Commande> commandes = Arrays.asList(commande1, commande2);

        // When
        when(commandeRepository.findAll()).thenReturn(commandes);

        List<Commande> result = commandeService.getAllCommandes();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(commandes, result);

        verify(commandeRepository).findAll();
    }
}