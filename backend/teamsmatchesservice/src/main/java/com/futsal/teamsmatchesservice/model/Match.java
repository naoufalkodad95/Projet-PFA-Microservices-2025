//package com.futsal.teamsmatchesservice.model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "matches")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Match {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @JoinColumn(name = "equipe_domicile_id", nullable = false)
//    private Equipe equipeDomicile;
//
//    @ManyToOne
//    @JoinColumn(name = "equipe_exterieur_id", nullable = false)
//    private Equipe equipeExterieur;
//
//    @Column(name = "date_match", nullable = false)
//    private LocalDateTime dateMatch;
//
//    @Column(name = "terrain", nullable = false)
//    private String terrain;
//
//    @Column(name = "score_domicile")
//    private Integer scoreDomicile;
//
//    @Column(name = "score_exterieur")
//    private Integer scoreExterieur;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private StatutEnum statut = StatutEnum.PLANIFIE; // PLANIFIE, JOUE, ANNULE
//
//    @Column(name = "is_tournoi")
//    private Boolean isTournoi = false;
//
//    @Column(name = "tournoi_id")
//    private Long tournoiId;
//
//    // Ajout pour tracer si le match vient d'un défi
//    @Column(name = "defi_id")
//    private Long defiId;
//}

package com.futsal.teamsmatchesservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipe_domicile_id", nullable = false)
    private Equipe equipeDomicile;

    @ManyToOne
    @JoinColumn(name = "equipe_exterieur_id", nullable = false)
    private Equipe equipeExterieur;

    @Column(name = "date_match", nullable = false)
    private LocalDateTime dateMatch;

    @Column(name = "terrain", nullable = false)
    private String terrain;

    @Column(name = "score_domicile")
    private Integer scoreDomicile;

    @Column(name = "score_exterieur")
    private Integer scoreExterieur;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutEnum statut = StatutEnum.PLANIFIE; // PLANIFIE, JOUE, ANNULE

    @Column(name = "is_tournoi")
    private Boolean isTournoi = false;

    @Column(name = "tournoi_id")
    private Long tournoiId;

    // Référence au défi associé
    @Column(name = "defi_id")
    private Long defiId;

    // Collection des IDs des buteurs du match avec le nombre de buts
    @ElementCollection
    @CollectionTable(name = "match_buteurs", joinColumns = @JoinColumn(name = "match_id"))
    private Set<ButeurMatch> buteurs = new HashSet<>();

    // Classe embarquée pour stocker les informations des buteurs
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ButeurMatch {

        @Column(name = "joueur_id", nullable = false)
        private Long joueurId;

        @Column(name = "nombre_buts", nullable = false)
        private Integer nombreButs;

        @Column(name = "equipe_id", nullable = false)
        private Long equipeId;
    }
}