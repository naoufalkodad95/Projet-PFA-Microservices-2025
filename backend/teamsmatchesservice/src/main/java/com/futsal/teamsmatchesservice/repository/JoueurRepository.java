//package com.futsal.teamsmatchesservice.repository;
//
//import com.futsal.teamsmatchesservice.model.Joueur;
//import com.futsal.teamsmatchesservice.model.StatutEnum;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface JoueurRepository extends JpaRepository<Joueur, Long> {
//
//    List<Joueur> findAllByEquipeIdAndEstCapitaineTrue(Long equipeId);
//
//
//    // Trouver tous les joueurs d'une équipe
//    List<Joueur> findByEquipeId(Long equipeId);
//
//    // Trouver le capitaine d'une équipe
//    Optional<Joueur> findByEquipeIdAndEstCapitaineTrue(Long equipeId);
//
//    // Trouver les joueurs par position et niveau
//    List<Joueur> findByPositionAndNiveauGreaterThanEqual(String position, Integer niveau);
//
//    // Trouver les meilleurs buteurs
//    @Query("SELECT j FROM Joueur j ORDER BY j.nbrButs DESC")
//    List<Joueur> findTopScorers();
//
//    // Recherche de joueurs sans équipe
//    List<Joueur> findByEquipeIsNull();
//
//    // Trouver les joueurs qui ont demandé à rejoindre une équipe spécifique
//    List<Joueur> findByDemandeEquipeIdAndStatutDemande(Long equipeId, StatutEnum statutDemande);
//
//    // Vérifier si un joueur existe avec cet email
//    boolean existsByEmail(String email);
//}