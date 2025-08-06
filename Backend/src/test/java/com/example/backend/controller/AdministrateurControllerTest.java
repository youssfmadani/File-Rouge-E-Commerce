package com.example.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AdministrateurController.class)
public class AdministrateurControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetAllAdministrateurs() throws Exception {
        // TODO: implement
    }
} 