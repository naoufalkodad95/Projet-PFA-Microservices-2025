package com.futsal.teamsmatchesservice.util;

/**
 * Classe de constantes pour l'application
 */
public class Constants {

    // Base de l'API
    public static final String API_BASE_PATH = "/api/v1";

    // Endpoints des différentes ressources
    public static final String EQUIPES_ENDPOINT = API_BASE_PATH + "/equipes";
    public static final String JOUEURS_ENDPOINT = API_BASE_PATH + "/joueurs";
    public static final String MATCHS_ENDPOINT = API_BASE_PATH + "/matchs";
    public static final String DEFIS_ENDPOINT = API_BASE_PATH + "/defis";

    // Messages d'erreur communs
    public static final String ERROR_RESOURCE_NOT_FOUND = "Ressource non trouvée";
    public static final String ERROR_UNAUTHORIZED = "Opération non autorisée";
    public static final String ERROR_BAD_REQUEST = "Requête invalide";

    // Rôles et autorisations
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_CAPITAINE = "CAPITAINE";
    public static final String ROLE_JOUEUR = "JOUEUR";
    public static final String ROLE_VISITEUR = "VISITEUR";

    // Autres constantes
    public static final int DUREE_MATCH_MINUTES = 90;
    public static final int MAX_JOUEURS_EQUIPE = 10;
}