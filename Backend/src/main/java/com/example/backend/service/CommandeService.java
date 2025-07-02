package com.example.backend.service;

import com.example.backend.entity.Commande;
import java.util.List;
import java.util.Optional;

public interface CommandeService {
    Commande saveCommande(Commande commande);
    Commande updateCommande(Integer id, Commande commande);
    void deleteCommande(Integer id);
    Optional<Commande> getCommandeById(Integer id);
    List<Commande> getAllCommandes();
} 