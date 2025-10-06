package com.example.backend.controller;

import com.example.backend.entity.Categorie;
import com.example.backend.repository.CategorieRepository;
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
class CategorieControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private CategorieRepository categorieRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        categorieRepository.deleteAll();
    }

    @Test
    void createCategorie() throws Exception {
        Categorie categorie = new Categorie();
        categorie.setNom("Test Category");
        String json = objectMapper.writeValueAsString(categorie);

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nom").value("Test Category"));
    }

    @Test
    void getAllCategories() throws Exception {
        Categorie categorie = new Categorie();
        categorie.setNom("Test Category");
        categorieRepository.save(categorie);

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void getCategorieById() throws Exception {
        Categorie categorie = new Categorie();
        categorie.setNom("Test Category");
        categorie = categorieRepository.save(categorie);

        mockMvc.perform(get("/api/categories/{id}", categorie.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(categorie.getId()))
                .andExpect(jsonPath("$.nom").value("Test Category"));
    }

    @Test
    void updateCategorie() throws Exception {
        Categorie categorie = new Categorie();
        categorie.setNom("Original Category");
        categorie = categorieRepository.save(categorie);

        Categorie updated = new Categorie();
        updated.setNom("Updated Category");
        String json = objectMapper.writeValueAsString(updated);

        mockMvc.perform(put("/api/categories/{id}", categorie.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Updated Category"));
    }

    @Test
    void deleteCategorie() throws Exception {
        Categorie categorie = new Categorie();
        categorie.setNom("Test Category");
        categorie = categorieRepository.save(categorie);

        mockMvc.perform(delete("/api/categories/{id}", categorie.getId()))
                .andExpect(status().isNoContent());
    }
}