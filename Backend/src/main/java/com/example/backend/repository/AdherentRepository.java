package com.example.backend.repository;

import com.example.backend.entity.Adherent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdherentRepository extends JpaRepository<Adherent, Integer> {
    Optional<Adherent> findByEmail(String email);
} 