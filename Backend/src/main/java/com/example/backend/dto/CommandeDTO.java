package com.example.backend.dto;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public class CommandeDTO {
    private Integer id;
    
    @NotNull(message = "Date commande is required")
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone="UTC")
    private Date dateCommande;
    
    @NotEmpty(message = "Status is required")
    private String statut;
    
    @NotNull(message = "Adherent ID is required")
    @Positive(message = "Adherent ID must be positive")
    private Integer adherentId;
    
    // Changed from @NotEmpty to allow empty lists
    private List<Integer> produitIds;
    
    private Double montantTotal;
    
    // Getters et setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Date getDateCommande() { return dateCommande; }
    public void setDateCommande(Date dateCommande) { this.dateCommande = dateCommande; }
    
    @JsonSetter("dateCommande")
    public void setDateCommandeFromString(String dateString) {
        if (dateString != null && !dateString.isEmpty()) {
            try {
                // Try ISO format first
                SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                isoFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
                this.dateCommande = isoFormat.parse(dateString);
            } catch (ParseException e) {
                try {
                    // Try alternative format without milliseconds
                    SimpleDateFormat altFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
                    altFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
                    this.dateCommande = altFormat.parse(dateString);
                } catch (ParseException e2) {
                    // If all else fails, try without the 'Z'
                    try {
                        SimpleDateFormat simpleFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                        simpleFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
                        this.dateCommande = simpleFormat.parse(dateString);
                    } catch (ParseException e3) {
                        System.err.println("Failed to parse date: " + dateString);
                        e3.printStackTrace();
                    }
                }
            }
        }
    }
    
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public Integer getAdherentId() { return adherentId; }
    public void setAdherentId(Integer adherentId) { this.adherentId = adherentId; }
    public List<Integer> getProduitIds() { return produitIds; }
    public void setProduitIds(List<Integer> produitIds) { this.produitIds = produitIds; }
    
    public Double getMontantTotal() { return montantTotal; }
    public void setMontantTotal(Double montantTotal) { this.montantTotal = montantTotal; }
    
    // Custom toString to avoid potential circular references
    @Override
    public String toString() {
        return "CommandeDTO{" +
                "id=" + id +
                ", dateCommande=" + dateCommande +
                ", statut='" + statut + '\'' +
                ", adherentId=" + adherentId +
                ", produitIds=" + produitIds +
                ", montantTotal=" + montantTotal +
                '}';
    }
}