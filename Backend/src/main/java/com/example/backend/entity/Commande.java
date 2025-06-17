package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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

    private Date dateCommande;

    @Enumerated(EnumType.STRING)
    private Status statut;

    @ManyToOne
    private Adherent adherent;

    @ManyToMany
    private List<Produit> produits;
}
