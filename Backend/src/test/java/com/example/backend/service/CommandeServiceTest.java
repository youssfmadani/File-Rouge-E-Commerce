package com.example.backend.service;

import com.example.backend.dto.CommandeDTO;
import com.example.backend.entity.Commande;
import com.example.backend.repository.CommandeRepository;
import com.example.backend.service.impl.CommandeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

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
        // TODO: implement
    }
} 