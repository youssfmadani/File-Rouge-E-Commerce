package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAvis;

    private int note;
    private String commentaire;
    private Date date;

    @ManyToOne
    @JsonIgnore
    private Adherent adherent;

    @ManyToOne
    @JsonIgnore
    private Produit produit;
    
    // Custom toString to avoid circular references
    @Override
    public String toString() {
        return "Avis{" +
                "idAvis=" + idAvis +
                ", note=" + note +
                ", commentaire='" + commentaire + '\'' +
                ", date=" + date +
                ", adherentId=" + (adherent != null ? adherent.getId() : null) +
                ", produitId=" + (produit != null ? produit.getIdProduit() : null) +
                '}';
    }
}