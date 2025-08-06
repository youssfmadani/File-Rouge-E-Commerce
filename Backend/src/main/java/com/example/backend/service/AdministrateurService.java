package com.example.backend.service;

import com.example.backend.entity.Administrateur;
import java.util.List;
import java.util.Optional;

public interface AdministrateurService {
    Administrateur saveAdministrateur(Administrateur administrateur);
    Administrateur updateAdministrateur(Integer id, Administrateur administrateur);
    void deleteAdministrateur(Integer id);
    Optional<Administrateur> getAdministrateurById(Integer id);
    List<Administrateur> getAllAdministrateurs();
} 