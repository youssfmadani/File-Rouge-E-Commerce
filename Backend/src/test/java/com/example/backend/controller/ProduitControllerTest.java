package com.example.backend.controller;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.entity.Categorie;
import com.example.backend.repository.CategorieRepository;
import com.example.backend.repository.ProduitRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@TestPropertySource(locations = "classpath:application.properties")
class ProduitControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private CategorieRepository categorieRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        produitRepository.deleteAll();
        categorieRepository.deleteAll();
    }

    @Test
    void createProduit() throws Exception {
        Categorie categorie = new Categorie();
        categorie.setNom("Test Category");
        categorie = categorieRepository.save(categorie);

        ProduitDTO dto = new ProduitDTO();
        dto.setNom("Test Product");
        dto.setDescription("Test Description");
        dto.setPrix(99.99f);
        dto.setCategorieId(categorie.getId());
        String json = objectMapper.writeValueAsString(dto);

        mockMvc.perform(post("/api/produits")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nom").value("Test Product"));
    }

    @Test
    void getAllProduits() throws Exception {
        mockMvc.perform(get("/api/produits"))
                .andExpect(status().isOk());
    }

    @Test
    void getProduitById() throws Exception {
        mockMvc.perform(get("/api/produits/{id}", 999))
                .andExpect(status().isNotFound());
    }
}