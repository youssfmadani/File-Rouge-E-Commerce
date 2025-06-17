package com.example.backend.entity;

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
    private Adherent adherent;

    @ManyToOne
    private Produit produit;
}
