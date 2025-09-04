package com.example.backend.service.impl;

import com.example.backend.entity.Adherent;
import com.example.backend.repository.AdherentRepository;
import com.example.backend.service.AdherentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdherentServiceImpl implements AdherentService {

    @Autowired
    private AdherentRepository adherentRepository;

    @Override
    public Adherent saveAdherent(Adherent adherent) {
        return adherentRepository.save(adherent);
    }

    @Override
    public Adherent updateAdherent(Integer id, Adherent adherent) {
        Optional<Adherent> existingAdherentOpt = adherentRepository.findById(id);
        if (existingAdherentOpt.isPresent()) {
            Adherent existingAdherent = existingAdherentOpt.get();
            existingAdherent.setNom(adherent.getNom());
            existingAdherent.setPrénom(adherent.getPrénom());
            existingAdherent.setEmail(adherent.getEmail());
            existingAdherent.setMotDePasse(adherent.getMotDePasse());
            // Ajoute ici les autres champs à mettre à jour si besoin
            return adherentRepository.save(existingAdherent);
        } else {
            throw new RuntimeException("Adherent not found with id: " + id);
        }
    }

    @Override
    public void deleteAdherent(Integer id) {
        adherentRepository.deleteById(id);
    }

    @Override
    public Optional<Adherent> getAdherentById(Integer id) {
        return adherentRepository.findById(id);
    }

    @Override
    public Optional<Adherent> getAdherentByEmail(String email) {
        return adherentRepository.findByEmail(email);
    }

    @Override
    public List<Adherent> getAllAdherents() {
        return adherentRepository.findAll();
    }
} 