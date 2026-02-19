package com.futsal.teamsmatchesservice.model;

public enum StatutEnum {
    // Statuts généraux
    ACTIF,
    INACTIF,

    // Statuts pour défi
    EN_ATTENTE,
    ACCEPTE,
    REFUSE,
    ANNULE,

    // Statuts pour match
    PLANIFIE,
    JOUE,

    // Statuts pour demandes équipe
    AUCUNE,

    // Statuts pour défi et joueur
    NOUVEAU
}