package com.example.backend.service.impl;

import com.example.backend.entity.Categorie;
import com.example.backend.repository.CategorieRepository;
import com.example.backend.service.CategorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategorieServiceImpl implements CategorieService {

    @Autowired
    private CategorieRepository categorieRepository;

    @Override
    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }

    @Override
    public Optional<Categorie> getCategorieById(Integer id) {
        return categorieRepository.findById(id);
    }

    @Override
    public Categorie saveCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    @Override
    public Categorie updateCategorie(Integer id, Categorie categorie) {
        categorie.setId(id);
        return categorieRepository.save(categorie);
    }

    @Override
    public void deleteCategorie(Integer id) {
        categorieRepository.deleteById(id);
    }
}