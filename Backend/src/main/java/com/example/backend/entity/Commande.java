package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @NotNull
    private Adherent adherent;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "commande_produit",
        joinColumns = @JoinColumn(name = "commande_id"),
        inverseJoinColumns = @JoinColumn(name = "produit_id")
    )
    @JsonIgnore
    private List<Produit> produits;
    
    private Double montantTotal;
    
    // Custom toString to avoid circular references
    @Override
    public String toString() {
        return "Commande{" +
                "idCommande=" + idCommande +
                ", dateCommande=" + dateCommande +
                ", statut=" + statut +
                ", adherentId=" + (adherent != null ? adherent.getId() : null) +
                ", produitsCount=" + (produits != null ? produits.size() : 0) +
                ", montantTotal=" + montantTotal +
                '}';
    }
}