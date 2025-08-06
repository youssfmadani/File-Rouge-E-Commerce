package com.example.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CommandeController.class)
public class CommandeControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetAllCommandes() throws Exception {
        // TODO: implement
    }
} 