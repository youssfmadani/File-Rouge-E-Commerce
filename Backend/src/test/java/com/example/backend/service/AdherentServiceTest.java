package com.example.backend.service;

import com.example.backend.dto.AdherentDTO;
import com.example.backend.entity.Adherent;
import com.example.backend.repository.AdherentRepository;
import com.example.backend.service.impl.AdherentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

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
        // TODO: implement
    }
} 