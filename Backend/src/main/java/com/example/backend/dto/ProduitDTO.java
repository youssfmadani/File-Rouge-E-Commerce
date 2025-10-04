package com.example.backend.dto;

public class ProduitDTO {
    private Integer id;
    private String nom;
    private String description;
    private float prix;
    private Integer stock = 0;
    private String image;
    private Integer categorieId;
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public float getPrix() { return prix; }
    public void setPrix(float prix) { this.prix = prix; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public Integer getCategorieId() { return categorieId; }
    public void setCategorieId(Integer categorieId) { this.categorieId = categorieId; }
}