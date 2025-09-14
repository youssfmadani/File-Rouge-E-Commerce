package com.example.backend.dto;

public class ProduitDTO {
    private Integer id;
    private String nom;
    private String description;
    private float prix;
    private String image; // Added image field
    private Integer categorieId;
    // Getters et setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public float getPrix() { return prix; }
    public void setPrix(float prix) { this.prix = prix; }
    public String getImage() { return image; } // Added getter
    public void setImage(String image) { this.image = image; } // Added setter
    public Integer getCategorieId() { return categorieId; }
    public void setCategorieId(Integer categorieId) { this.categorieId = categorieId; }
}