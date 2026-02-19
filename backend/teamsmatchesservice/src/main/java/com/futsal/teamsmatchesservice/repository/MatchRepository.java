package com.futsal.teamsmatchesservice.repository;

import com.futsal.teamsmatchesservice.model.Match;
import com.futsal.teamsmatchesservice.model.StatutEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    // Trouver les matchs à venir pour une équipe
    @Query("SELECT m FROM Match m WHERE (m.equipeDomicile.id = :equipeId OR m.equipeExterieur.id = :equipeId) " +
            "AND m.dateMatch > :now AND m.statut = :statut ORDER BY m.dateMatch ASC")
    List<Match> findUpcomingMatchesByEquipe(@Param("equipeId") Long equipeId,
                                            @Param("now") LocalDateTime now,
                                            @Param("statut") StatutEnum statut);

    // Trouver les matchs passés pour une équipe
    @Query("SELECT m FROM Match m WHERE (m.equipeDomicile.id = :equipeId OR m.equipeExterieur.id = :equipeId) " +
            "AND m.dateMatch < :now ORDER BY m.dateMatch DESC")
    List<Match> findPastMatchesByEquipe(@Param("equipeId") Long equipeId, @Param("now") LocalDateTime now);

    // Trouver les matchs en attente de résultat
    List<Match> findByStatut(StatutEnum statut);

    // Trouver les matchs planifiés pour une période donnée
    List<Match> findByDateMatchBetweenAndStatut(LocalDateTime dateDebut, LocalDateTime dateFin, StatutEnum statut);

    // Trouver les matchs d'un tournoi
    List<Match> findByIsTournoiTrueAndTournoiId(Long tournoiId);

    // Vérifier si un terrain est occupé à une date/heure donnée
    @Query("SELECT COUNT(m) > 0 FROM Match m WHERE m.terrain = :terrain " +
            "AND m.dateMatch BETWEEN :debut AND :fin AND m.statut = :statut")
    boolean isTerrainOccupied(@Param("terrain") String terrain,
                              @Param("debut") LocalDateTime debut,
                              @Param("fin") LocalDateTime fin,
                              @Param("statut") StatutEnum statut);
}