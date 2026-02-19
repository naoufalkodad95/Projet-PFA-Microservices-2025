package com.futsal.teamsmatchesservice.dto.external;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO représentant les données d'un joueur venant du microservice de gestion des utilisateurs
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoueurDto {

    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String email;
    private String telephone;
    private boolean estCapitaine;
    private String position;
    private Integer niveau;
    private Integer nbrButs;

    // Champs utilisés pour la communication entre services
    private Long equipeId;
    private Long demandeEquipeId;
    private String statutDemande;
}