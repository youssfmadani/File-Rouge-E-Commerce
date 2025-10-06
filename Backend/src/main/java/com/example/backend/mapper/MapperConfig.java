package com.example.backend.mapper;

import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for all mappers in the application.
 * This class serves as a central point for accessing all mapper instances.
 */
@Configuration
public class MapperConfig {

    private final ProduitMapper produitMapper;
    private final AdherentMapper adherentMapper;
    private final CommandeMapper commandeMapper;
    private final CategorieMapper categorieMapper;
    private final UtilisateurMapper utilisateurMapper;

    public MapperConfig(ProduitMapper produitMapper,
                       AdherentMapper adherentMapper,
                       CommandeMapper commandeMapper,
                       CategorieMapper categorieMapper,
                       UtilisateurMapper utilisateurMapper) {
        this.produitMapper = produitMapper;
        this.adherentMapper = adherentMapper;
        this.commandeMapper = commandeMapper;
        this.categorieMapper = categorieMapper;
        this.utilisateurMapper = utilisateurMapper;
    }

    public ProduitMapper getProduitMapper() {
        return produitMapper;
    }

    public AdherentMapper getAdherentMapper() {
        return adherentMapper;
    }

    public CommandeMapper getCommandeMapper() {
        return commandeMapper;
    }

    public CategorieMapper getCategorieMapper() {
        return categorieMapper;
    }

    public UtilisateurMapper getUtilisateurMapper() {
        return utilisateurMapper;
    }
}