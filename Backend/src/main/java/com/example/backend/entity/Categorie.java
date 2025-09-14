package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotEmpty
    private String nom;

    @OneToMany(mappedBy = "categorie")
    private List<Produit> produits;
}
