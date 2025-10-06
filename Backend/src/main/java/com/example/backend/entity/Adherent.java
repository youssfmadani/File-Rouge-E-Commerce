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

    @OneToMany(mappedBy = "adherent")
    @JsonIgnore
    private List<Commande> commandes;
    
    @Override
    public String toString() {
        return "Adherent{" +
                "id=" + getId() +
                ", nom='" + getNom() + '\'' +
                ", prénom='" + getPrénom() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", commandesCount=" + (commandes != null ? commandes.size() : 0) +
                '}';
    }
}