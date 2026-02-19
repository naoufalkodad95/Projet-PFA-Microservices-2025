//// EquipeService.java
//package com.futsal.teamsmatchesservice.service;
//
//import com.futsal.teamsmatchesservice.dto.request.EquipeRequestDto;
//import com.futsal.teamsmatchesservice.dto.response.EquipeResponseDto;
//import com.futsal.teamsmatchesservice.dto.response.JoueurResponseDto;
//
//import java.util.List;
//
//public interface EquipeService {
//
//    // Opérations CRUD
//    List<EquipeResponseDto> getAllEquipes();
//
//    EquipeResponseDto getEquipeById(Long id);
//
//    EquipeResponseDto createEquipe(EquipeRequestDto equipeDto);
//
//    EquipeResponseDto updateEquipe(Long id, EquipeRequestDto equipeDto);
//
//    void deleteEquipe(Long id);
//
//    // Opérations liées aux joueurs
//    List<JoueurResponseDto> getJoueursByEquipe(Long equipeId);
//
//    JoueurResponseDto addJoueurToEquipe(Long equipeId, Long joueurId);
//
//    void removeJoueurFromEquipe(Long equipeId, Long joueurId);
//
//    // Opérations métier
//    List<EquipeResponseDto> searchEquipesByName(String nom);
//
//    List<EquipeResponseDto> getEquipesByClassement();
//
//    List<JoueurResponseDto> getDemandesJoueurs(Long equipeId);
//
//    void accepterDemandeJoueur(Long equipeId, Long joueurId);
//
//    void refuserDemandeJoueur(Long equipeId, Long joueurId);
//
//    void updateEquipeStats(Long equipeId, int butsMarques, int butsEncaisses, String resultat);
//}
//


package com.futsal.teamsmatchesservice.service;

import com.futsal.teamsmatchesservice.dto.external.JoueurDto;
import com.futsal.teamsmatchesservice.dto.request.EquipeRequestDto;
import com.futsal.teamsmatchesservice.dto.response.EquipeResponseDto;

import java.util.List;

/**
 * Service de gestion des équipes
 */
public interface EquipeService {

    /**
     * Récupère toutes les équipes
     * @return Liste des équipes
     */
    List<EquipeResponseDto> getAllEquipes();

    /**
     * Récupère une équipe par son ID
     * @param id ID de l'équipe
     * @return Détails de l'équipe
     */
    EquipeResponseDto getEquipeById(Long id);

    /**
     * Crée une nouvelle équipe
     * @param equipeDto Données de l'équipe à créer
     * @return Équipe créée
     */
    EquipeResponseDto createEquipe(EquipeRequestDto equipeDto);

    /**
     * Met à jour une équipe existante
     * @param id ID de l'équipe à mettre à jour
     * @param equipeDto Nouvelles données de l'équipe
     * @return Équipe mise à jour
     */
    EquipeResponseDto updateEquipe(Long id, EquipeRequestDto equipeDto);

    /**
     * Supprime une équipe
     * @param id ID de l'équipe à supprimer
     */
    void deleteEquipe(Long id);

    /**
     * Récupère les joueurs d'une équipe
     * @param equipeId ID de l'équipe
     * @return Liste des joueurs de l'équipe
     */
    List<JoueurDto> getJoueursByEquipe(Long equipeId);

    /**
     * Ajoute un joueur à une équipe
     * @param equipeId ID de l'équipe
     * @param joueurId ID du joueur à ajouter
     */
    void addJoueurToEquipe(Long equipeId, Long joueurId);

    /**
     * Retire un joueur d'une équipe
     * @param equipeId ID de l'équipe
     * @param joueurId ID du joueur à retirer
     */
    void removeJoueurFromEquipe(Long equipeId, Long joueurId);

    /**
     * Nomme un joueur capitaine de l'équipe
     * @param equipeId ID de l'équipe
     * @param joueurId ID du joueur à nommer capitaine
     */
    void nommerCapitaine(Long equipeId, Long joueurId);

    /**
     * Recherche des équipes par nom
     * @param nom Nom à rechercher
     * @return Liste des équipes correspondantes
     */
    List<EquipeResponseDto> searchEquipesByName(String nom);

    /**
     * Récupère les équipes classées par points
     * @return Liste des équipes classées
     */
    List<EquipeResponseDto> getEquipesByClassement();

    /**
     * Récupère les demandes de joueurs pour rejoindre une équipe
     * @param equipeId ID de l'équipe
     * @return Liste des demandes
     */
    List<JoueurDto> getDemandesJoueurs(Long equipeId);

    /**
     * Met à jour les statistiques d'une équipe après un match
     * @param equipeId ID de l'équipe
     * @param butsMarques Nombre de buts marqués
     * @param butsEncaisses Nombre de buts encaissés
     * @param resultat Résultat du match (victoire, défaite, egalite)
     */
    void updateEquipeStats(Long equipeId, int butsMarques, int butsEncaisses, String resultat);
}