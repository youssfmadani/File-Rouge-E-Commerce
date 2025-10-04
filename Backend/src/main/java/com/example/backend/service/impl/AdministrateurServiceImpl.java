package com.example.backend.service.impl;

import com.example.backend.entity.Administrateur;
import com.example.backend.repository.AdministrateurRepository;
import com.example.backend.service.AdministrateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdministrateurServiceImpl implements AdministrateurService {

    @Autowired
    private AdministrateurRepository administrateurRepository;

    @Override
    public Administrateur saveAdministrateur(Administrateur administrateur) {
        return administrateurRepository.save(administrateur);
    }

    @Override
    public Administrateur updateAdministrateur(Integer id, Administrateur administrateur) {
        Optional<Administrateur> existingAdministrateurOpt = administrateurRepository.findById(id);
        if (existingAdministrateurOpt.isPresent()) {
            Administrateur existingAdministrateur = existingAdministrateurOpt.get();
            existingAdministrateur.setNom(administrateur.getNom());
            existingAdministrateur.setPrénom(administrateur.getPrénom());
            existingAdministrateur.setEmail(administrateur.getEmail());
            existingAdministrateur.setMotDePasse(administrateur.getMotDePasse());
            return administrateurRepository.save(existingAdministrateur);
        } else {
            throw new RuntimeException("Administrateur not found with id: " + id);
        }
    }

    @Override
    public void deleteAdministrateur(Integer id) {
        administrateurRepository.deleteById(id);
    }

    @Override
    public Optional<Administrateur> getAdministrateurById(Integer id) {
        return administrateurRepository.findById(id);
    }

    @Override
    public List<Administrateur> getAllAdministrateurs() {
        return administrateurRepository.findAll();
    }
} 