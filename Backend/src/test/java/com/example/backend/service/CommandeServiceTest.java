package com.example.backend.service;

import com.example.backend.service.impl.CommandeServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application.properties")
class CommandeServiceTest {

    @Autowired
    private CommandeServiceImpl commandeService;

    @Test
    void contextLoads() {
        assertNotNull(commandeService);
    }
}