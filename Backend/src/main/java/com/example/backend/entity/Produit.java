package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProduit;

    @NotEmpty
    private String nom;
    
    @NotEmpty
    private String description;
    
    @NotNull
    @PositiveOrZero
    private float prix;
    
    @PositiveOrZero
    private Integer stock = 0;
    
    private String image;

    @ManyToOne
    @JsonIgnore
    private Categorie categorie;
    
   
    @Override
    public String toString() {
        return "Produit{" +
                "idProduit=" + idProduit +
                ", nom='" + nom + '\'' +
                ", description='" + description + '\'' +
                ", prix=" + prix +
                ", stock=" + stock +
                ", image='" + image + '\'' +
                ", categorieId=" + (categorie != null ? categorie.getId() : null) +
                '}';
    }
}