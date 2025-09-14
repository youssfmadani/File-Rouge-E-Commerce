package com.example.backend.entity;

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
    
    private String image; // Added image field

    @ManyToOne
    private Categorie categorie;
}