package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCommande;

    @NotNull
    private Date dateCommande;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Status statut;

    @ManyToOne
    @NotNull
    private Adherent adherent;

    @ManyToMany
    private List<Produit> produits;
    
    private Double montantTotal;
}
