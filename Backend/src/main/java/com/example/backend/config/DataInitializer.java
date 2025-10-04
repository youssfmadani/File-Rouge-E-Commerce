package com.example.backend.config;

import com.example.backend.entity.Categorie;
import com.example.backend.entity.Produit;
import com.example.backend.repository.CategorieRepository;
import com.example.backend.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategorieRepository categorieRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categorieRepository.count() == 0) {
            Categorie electronics = new Categorie();
            electronics.setNom("Electronics");
            categorieRepository.save(electronics);

            Categorie clothing = new Categorie();
            clothing.setNom("Clothing");
            categorieRepository.save(clothing);

            Categorie home = new Categorie();
            home.setNom("Home & Kitchen");
            categorieRepository.save(home);

            Categorie books = new Categorie();
            books.setNom("Books");
            categorieRepository.save(books);

            Produit laptop = new Produit();
            laptop.setNom("Gaming Laptop");
            laptop.setDescription("High-performance gaming laptop with RTX 4080 graphics");
            laptop.setPrix(1299.99f);
            laptop.setImage("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop");
            laptop.setCategorie(electronics);
            produitRepository.save(laptop);

            Produit phone = new Produit();
            phone.setNom("Smartphone X");
            phone.setDescription("Latest smartphone with 108MP camera and 5G connectivity");
            phone.setPrix(899.99f);
            phone.setImage("https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?w=400&h=400&fit=crop");
            phone.setCategorie(electronics);
            produitRepository.save(phone);

            Produit shirt = new Produit();
            shirt.setNom("Premium Cotton T-Shirt");
            shirt.setDescription("Comfortable cotton t-shirt for everyday wear");
            shirt.setPrix(29.99f);
            shirt.setImage("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop");
            shirt.setCategorie(clothing);
            produitRepository.save(shirt);

            Produit coffeeMaker = new Produit();
            coffeeMaker.setNom("Coffee Maker Pro");
            coffeeMaker.setDescription("Automatic coffee maker with programmable settings");
            coffeeMaker.setPrix(149.99f);
            coffeeMaker.setImage("https://images.unsplash.com/photo-1571509020228-5f1f3c8eccd0?w=400&h=400&fit=crop");
            coffeeMaker.setCategorie(home);
            produitRepository.save(coffeeMaker);

            Produit book = new Produit();
            book.setNom("Programming Guide");
            book.setDescription("Complete guide to modern web development");
            book.setPrix(39.99f);
            book.setImage("https://images.unsplash.com/photo-1532016723172-17c35d84dc5e?w=400&h=400&fit=crop");
            book.setCategorie(books);
            produitRepository.save(book);
        }
    }
}