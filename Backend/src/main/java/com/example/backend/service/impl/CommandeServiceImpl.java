package com.example.backend.service.impl;

import com.example.backend.entity.Commande;
import com.example.backend.repository.CommandeRepository;
import com.example.backend.service.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommandeServiceImpl implements CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    @Override
    public Commande saveCommande(Commande commande) {
        return commandeRepository.save(commande);
    }

    @Override
    public Commande updateCommande(Integer id, Commande commande) {
        Optional<Commande> existingCommandeOpt = commandeRepository.findById(id);
        if (existingCommandeOpt.isPresent()) {
            Commande existingCommande = existingCommandeOpt.get();
            existingCommande.setDateCommande(commande.getDateCommande());
            existingCommande.setStatut(commande.getStatut());
            existingCommande.setAdherent(commande.getAdherent());
            existingCommande.setProduits(commande.getProduits());
            return commandeRepository.save(existingCommande);
        } else {
            throw new RuntimeException("Commande not found with id: " + id);
        }
    }

    @Override
    public void deleteCommande(Integer id) {
        commandeRepository.deleteById(id);
    }

    @Override
    public Optional<Commande> getCommandeById(Integer id) {
        return commandeRepository.findById(id);
    }

    @Override
    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }
} 