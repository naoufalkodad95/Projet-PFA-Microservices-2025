package com.futsal.teamsmatchesservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "defis")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Defi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipe_initiatrice_id", nullable = false)
    private Equipe equipeInitiatrice;

    @ManyToOne
    @JoinColumn(name = "equipe_adverse_id", nullable = false)
    private Equipe equipeAdverse;

    @Column(name = "date_defi", nullable = false)
    private LocalDate dateDefi;

    @Column(name = "heure_debut", nullable = false)
    private LocalTime heureDebut;

    @Column(name = "heure_fin", nullable = false)
    private LocalTime heureFin;

    @Column(nullable = false)
    private String terrain;

    @Column(length = 500)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutEnum statut = StatutEnum.EN_ATTENTE; // EN_ATTENTE, ACCEPTE, REFUSE, ANNULE

    @Column(name = "match_id")
    private Long matchId; // Référence au match créé si le défi est accepté
}