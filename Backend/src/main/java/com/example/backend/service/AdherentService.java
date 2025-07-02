package com.example.backend.service;

import com.example.backend.entity.Adherent;
import java.util.List;
import java.util.Optional;

public interface AdherentService {
    Adherent saveAdherent(Adherent adherent);
    Adherent updateAdherent(Integer id, Adherent adherent);
    void deleteAdherent(Integer id);
    Optional<Adherent> getAdherentById(Integer id);
    List<Adherent> getAllAdherents();
} 