package com.example.backend.repository;

import com.example.backend.entity.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, Integer> {
    List<Commande> findByAdherentId(Integer adherentId);
}