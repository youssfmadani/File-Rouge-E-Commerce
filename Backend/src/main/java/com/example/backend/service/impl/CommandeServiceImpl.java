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
        try {
            // Check if the commande exists before trying to delete
            Optional<Commande> commandeOpt = commandeRepository.findById(id);
            if (!commandeOpt.isPresent()) {
                System.out.println("Attempted to delete non-existent commande with ID: " + id);
                throw new RuntimeException("Commande not found with id: " + id);
            }
            
            System.out.println("Deleting commande with ID: " + id);
            System.out.println("Commande details: " + commandeOpt.get());
            
            commandeRepository.deleteById(id);
            System.out.println("Successfully deleted commande with ID: " + id);
        } catch (Exception e) {
            System.err.println("Error deleting commande with ID: " + id + ", Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete commande with ID: " + id, e);
        }
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