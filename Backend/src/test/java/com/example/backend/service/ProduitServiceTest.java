package com.example.backend.service;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.entity.Produit;
import com.example.backend.repository.ProduitRepository;
import com.example.backend.service.impl.ProduitServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProduitServiceTest {
    @Mock
    private ProduitRepository produitRepository;

    @InjectMocks
    private ProduitServiceImpl produitService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveProduit() {
        // TODO: implement
    }
} 