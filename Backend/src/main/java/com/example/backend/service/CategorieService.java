package com.example.backend.service;

import com.example.backend.entity.Categorie;
import java.util.List;
import java.util.Optional;

public interface CategorieService {
    List<Categorie> getAllCategories();
    Optional<Categorie> getCategorieById(Integer id);
    Categorie saveCategorie(Categorie categorie);
    Categorie updateCategorie(Integer id, Categorie categorie);
    void deleteCategorie(Integer id);
}