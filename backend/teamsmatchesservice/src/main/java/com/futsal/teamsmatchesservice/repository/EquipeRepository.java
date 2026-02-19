package com.futsal.teamsmatchesservice.repository;

import com.futsal.teamsmatchesservice.model.Equipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipeRepository extends JpaRepository<Equipe, Long> {

    // Recherche d'équipes par nom (ignorant la casse)
    List<Equipe> findByNomContainingIgnoreCase(String nom);

    // Trouver toutes les équipes triées par points (pour classement)
    @Query("SELECT e FROM Equipe e ORDER BY e.points DESC")
    List<Equipe> findAllOrderByPointsDesc();

    // Vérifier si une équipe avec ce nom existe déjà
    boolean existsByNomIgnoreCase(String nom);

    // Requête pour obtenir les équipes avec le plus de buts marqués
    @Query("SELECT e FROM Equipe e ORDER BY e.nbrButPlus DESC")
    List<Equipe> findTopScoringTeams();

    // Requête pour obtenir les équipes avec la meilleure différence de buts
    @Query("SELECT e FROM Equipe e ORDER BY (e.nbrButPlus - e.nbrButMoins) DESC")
    List<Equipe> findTopGoalDifferenceTeams();
}