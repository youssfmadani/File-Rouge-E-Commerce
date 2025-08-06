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
    private final AdministrateurMapper administrateurMapper;
    private final ProfessionelMapper professionelMapper;
    private final CommandeMapper commandeMapper;
    private final PanierMapper panierMapper;
    private final CategorieMapper categorieMapper;
    private final UtilisateurMapper utilisateurMapper;

    public MapperConfig(ProduitMapper produitMapper,
                       AdherentMapper adherentMapper,
                       AdministrateurMapper administrateurMapper,
                       ProfessionelMapper professionelMapper,
                       CommandeMapper commandeMapper,
                       PanierMapper panierMapper,
                       CategorieMapper categorieMapper,
                       UtilisateurMapper utilisateurMapper) {
        this.produitMapper = produitMapper;
        this.adherentMapper = adherentMapper;
        this.administrateurMapper = administrateurMapper;
        this.professionelMapper = professionelMapper;
        this.commandeMapper = commandeMapper;
        this.panierMapper = panierMapper;
        this.categorieMapper = categorieMapper;
        this.utilisateurMapper = utilisateurMapper;
    }

    public ProduitMapper getProduitMapper() {
        return produitMapper;
    }

    public AdherentMapper getAdherentMapper() {
        return adherentMapper;
    }

    public AdministrateurMapper getAdministrateurMapper() {
        return administrateurMapper;
    }

    public ProfessionelMapper getProfessionelMapper() {
        return professionelMapper;
    }

    public CommandeMapper getCommandeMapper() {
        return commandeMapper;
    }

    public PanierMapper getPanierMapper() {
        return panierMapper;
    }

    public CategorieMapper getCategorieMapper() {
        return categorieMapper;
    }

    public UtilisateurMapper getUtilisateurMapper() {
        return utilisateurMapper;
    }
} 