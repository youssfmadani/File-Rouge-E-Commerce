package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Panier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPanier;

    private Date dateCréation;

    @Enumerated(EnumType.STRING)
    private Status statut;

    @OneToOne
    private Adherent adherent;

    @ManyToMany
    private List<Produit> produits;
}
