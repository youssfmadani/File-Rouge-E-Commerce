package com.example.backend.service;

import com.example.backend.dto.ProduitDTO;
import com.example.backend.entity.Categorie;
import com.example.backend.entity.Produit;
import com.example.backend.repository.CategorieRepository;
import com.example.backend.repository.ProduitRepository;
import com.example.backend.service.impl.ProduitServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application.properties")
class ProduitServiceTest {

    @Autowired
    private ProduitServiceImpl produitService;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private CategorieRepository categorieRepository;

    @BeforeEach
    void setUp() {
        produitRepository.deleteAll();
        categorieRepository.deleteAll();
    }

    @Test
    void saveProduit() {
        Categorie categorie = new Categorie();
        categorie.setNom("Test Category");
        categorie = categorieRepository.save(categorie);

        ProduitDTO dto = new ProduitDTO();
        dto.setNom("Test Product");
        dto.setDescription("Test Description");
        dto.setPrix(99.99f);
        dto.setCategorieId(categorie.getId());

        ProduitDTO result = produitService.saveProduit(dto);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("Test Product", result.getNom());
    }

    @Test
    void getAllProduits() {
        assertEquals(0, produitService.getAllProduits().size());
    }

    @Test
    void getProduitById() {
        try {
            produitService.getProduitById(999);
            fail("Should throw exception");
        } catch (Exception e) {
           
        }
    }
}