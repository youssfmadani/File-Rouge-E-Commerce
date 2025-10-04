package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private Adherent adherent;

    @ManyToMany
    @JsonIgnore
    private List<Produit> produits;
    
    @Override
    public String toString() {
        return "Panier{" +
                "idPanier=" + idPanier +
                ", dateCréation=" + dateCréation +
                ", statut=" + statut +
                ", adherentId=" + (adherent != null ? adherent.getId() : null) +
                ", produitsCount=" + (produits != null ? produits.size() : 0) +
                '}';
    }
}