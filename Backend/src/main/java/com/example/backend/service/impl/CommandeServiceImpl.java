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
        try {
            boolean exists = commandeRepository.existsById(id);
            if (!exists) {
                throw new RuntimeException("Commande not found with id: " + id);
            }
            
            commande.setIdCommande(id);
            
            return commandeRepository.save(commande);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update commande with ID: " + id + ". The order may be corrupted.");
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

    @Override
    public List<Commande> getCommandesByAdherentId(Integer adherentId) {
        return commandeRepository.findByAdherentId(adherentId);
    }
}