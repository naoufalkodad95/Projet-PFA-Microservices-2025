//package com.futsal.teamsmatchesservice.model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//
//@Entity
//@Table(name = "joueurs")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Joueur {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String nom;
//
//    @Column(nullable = false)
//    private String prenom;
//
//    @Column(name = "date_naissance")
//    private LocalDate dateNaissance;
//
//    @Column(nullable = false, unique = true)
//    private String email;
//
//    @Column(name = "telephone")
//    private String telephone;
//
//    @Column
//    private boolean estCapitaine = false;
//
//    @Column(name = "nbr_buts")
//    private Integer nbrButs = 0;
//
//    @Column
//    private String position; // Attaquant, Défenseur, Milieu, Gardien
//
//    @Column
//    private Integer niveau = 1; // 1-10 par exemple
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "equipe_id")
//    private Equipe equipe;
//
//    // Attributs pour gérer les demandes de rejoindre une équipe
//    @Column(name = "demande_equipe_id")
//    private Long demandeEquipeId;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "statut_demande")
//    private StatutEnum statutDemande = StatutEnum.AUCUNE; // AUCUNE, EN_ATTENTE, ACCEPTEE, REFUSEE
//}