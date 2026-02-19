//// JoueurService.java
//package com.futsal.teamsmatchesservice.service;
//
//import com.futsal.teamsmatchesservice.dto.request.JoueurRequestDto;
//import com.futsal.teamsmatchesservice.dto.response.JoueurResponseDto;
//
//import java.util.List;
//
//public interface JoueurService {
//
//    // Opérations CRUD
//    List<JoueurResponseDto> getAllJoueurs();
//
//    JoueurResponseDto getJoueurById(Long id);
//
//    JoueurResponseDto createJoueur(JoueurRequestDto joueurDto);
//
//    JoueurResponseDto updateJoueur(Long id, JoueurRequestDto joueurDto);
//
//    void deleteJoueur(Long id);
//
//    // Opérations liées à l'équipe
//    JoueurResponseDto demanderRejoindreEquipe(Long joueurId, Long equipeId);
//
//    void annulerDemandeRejoindreEquipe(Long joueurId);
//
//    // Recherche de joueurs
//    List<JoueurResponseDto> searchJoueurs(String position, Integer niveauMin);
//
//    List<JoueurResponseDto> getJoueursSansEquipe();
//
//    // Opérations spécifiques
//    JoueurResponseDto nommerCapitaine(Long joueurId);
//
//    JoueurResponseDto updateStatistiquesJoueur(Long joueurId, int butsMarques);
//
//    List<JoueurResponseDto> getTopButeurs(int limit);
//}
//
