package com.example.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AdherentController.class)
public class AdherentControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetAllAdherents() throws Exception {
        // TODO: implement
    }
} 