package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Adherent extends Utilisateur {

    @OneToOne(mappedBy = "adherent", cascade = CascadeType.ALL)
    private Panier panier;

    @OneToMany(mappedBy = "adherent")
    @JsonIgnore
    private List<Commande> commandes;

    @OneToMany(mappedBy = "adherent")
    @JsonIgnore
    private List<Avis> avis;
    
    // Custom toString to avoid circular references
    @Override
    public String toString() {
        return "Adherent{" +
                "id=" + getId() +
                ", nom='" + getNom() + '\'' +
                ", prénom='" + getPrénom() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", panier=" + (panier != null ? panier.getIdPanier() : null) +
                ", commandesCount=" + (commandes != null ? commandes.size() : 0) +
                ", avisCount=" + (avis != null ? avis.size() : 0) +
                '}';
    }
}