package com.example.backend.service;

import com.example.backend.entity.Categorie;
import com.example.backend.entity.Produit;
import com.example.backend.repository.CategorieRepository;
import com.example.backend.repository.ProduitRepository;
import com.example.backend.service.impl.CategorieServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application.properties")
class CategorieServiceTest {

    @Autowired
    private CategorieServiceImpl categorieService;

    @Autowired
    private CategorieRepository categorieRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @BeforeEach
    void setUp() {
        produitRepository.deleteAll();
        categorieRepository.deleteAll();
    }

    @Test
    void saveCategorie() {
        Categorie categorie = new Categorie();
        categorie.setNom("Test Category");

        Categorie result = categorieService.saveCategorie(categorie);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("Test Category", result.getNom());
    }

    @Test
    void getAllCategories() {
        Categorie categorie = new Categorie();
        categorie.setNom("Test Category");
        categorieRepository.save(categorie);

        assertEquals(1, categorieService.getAllCategories().size());
    }

    @Test
    void getCategorieById() {
        Categorie categorie = new Categorie();
        categorie.setNom("Test Category");
        categorie = categorieRepository.save(categorie);

        assertTrue(categorieService.getCategorieById(categorie.getId()).isPresent());
        assertEquals("Test Category", categorieService.getCategorieById(categorie.getId()).get().getNom());
    }

    @Test
    void updateCategorie() {
        Categorie categorie = new Categorie();
        categorie.setNom("Original Category");
        categorie = categorieRepository.save(categorie);

        Categorie updated = new Categorie();
        updated.setNom("Updated Category");

        Categorie result = categorieService.updateCategorie(categorie.getId(), updated);

        assertEquals("Updated Category", result.getNom());
    }

    @Test
    void deleteCategorie() {
        Categorie categorie = new Categorie();
        categorie.setNom("Test Category");
        categorie = categorieRepository.save(categorie);

        categorieService.deleteCategorie(categorie.getId());

        assertTrue(categorieService.getCategorieById(categorie.getId()).isEmpty());
    }
}