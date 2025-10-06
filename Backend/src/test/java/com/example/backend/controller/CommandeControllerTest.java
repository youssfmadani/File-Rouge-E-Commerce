package com.example.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@AutoConfigureWebMvc
@TestPropertySource(locations = "classpath:application.properties")
class CommandeControllerTest {

    @Autowired
    private CommandeController commandeController;

    @Test
    void contextLoads() {
        assertNotNull(commandeController);
    }
}