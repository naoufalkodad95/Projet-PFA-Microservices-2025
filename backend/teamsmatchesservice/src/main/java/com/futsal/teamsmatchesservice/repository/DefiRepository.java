package com.futsal.teamsmatchesservice.repository;

import com.futsal.teamsmatchesservice.model.Defi;
import com.futsal.teamsmatchesservice.model.StatutEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DefiRepository extends JpaRepository<Defi, Long> {

    // Trouver les défis envoyés par une équipe
    List<Defi> findByEquipeInitiatriceIdOrderByDateDefiDesc(Long equipeId);

    // Trouver les défis reçus par une équipe
    List<Defi> findByEquipeAdverseIdOrderByDateDefiDesc(Long equipeId);

    // Trouver les défis par statut
    List<Defi> findByStatut(StatutEnum statut);

    // Trouver les défis envoyés par une équipe avec un statut spécifique
    List<Defi> findByEquipeInitiatriceIdAndStatut(Long equipeId, StatutEnum statut);

    // Trouver les défis reçus par une équipe avec un statut spécifique
    List<Defi> findByEquipeAdverseIdAndStatut(Long equipeId, StatutEnum statut);

    // Vérifier si un défi existe déjà entre deux équipes à une date donnée
    @Query("SELECT COUNT(d) > 0 FROM Defi d WHERE " +
            "((d.equipeInitiatrice.id = :equipe1Id AND d.equipeAdverse.id = :equipe2Id) OR " +
            "(d.equipeInitiatrice.id = :equipe2Id AND d.equipeAdverse.id = :equipe1Id)) " +
            "AND d.dateDefi = :date AND d.statut IN (:statuts)")
    boolean existsDefiForEquipesOnDate(@Param("equipe1Id") Long equipe1Id,
                                       @Param("equipe2Id") Long equipe2Id,
                                       @Param("date") LocalDate date,
                                       @Param("statuts") List<StatutEnum> statuts);
}