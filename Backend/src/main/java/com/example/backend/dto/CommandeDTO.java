package com.example.backend.dto;

import java.util.Date;
import java.util.List;

public class CommandeDTO {
    private Integer id;
    private Date dateCommande;
    private String statut;
    private Integer adherentId;
    private List<Integer> produitIds;
    // Getters et setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Date getDateCommande() { return dateCommande; }
    public void setDateCommande(Date dateCommande) { this.dateCommande = dateCommande; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public Integer getAdherentId() { return adherentId; }
    public void setAdherentId(Integer adherentId) { this.adherentId = adherentId; }
    public List<Integer> getProduitIds() { return produitIds; }
    public void setProduitIds(List<Integer> produitIds) { this.produitIds = produitIds; }
} 