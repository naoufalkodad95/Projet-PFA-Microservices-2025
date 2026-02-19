package com.example.reservationservice.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;

public class ReservationRequest {

    private int idUtilisateur;
    private Long creneauId;  // L'ID du créneau
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String statut;


    // Getters et Setters
    public int getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(int idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }


    public Long getCreneauId() {
        return creneauId;
    }

    public void setCreneauId(Long creneauId) {
        this.creneauId = creneauId;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
}
