package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Adherent extends Utilisateur {

    @OneToOne(mappedBy = "adherent", cascade = CascadeType.ALL)
    private Panier panier;

    @OneToMany(mappedBy = "adherent")
    private List<Commande> commandes;

    @OneToMany(mappedBy = "adherent")
    private List<Avis> avis;
}
