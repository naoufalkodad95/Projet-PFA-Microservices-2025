package com.example.reservationservice.service;

import com.example.reservationservice.DTO.ReservationRequest;
import com.example.reservationservice.Model.Creneau;
import com.example.reservationservice.Model.Reservation;
import com.example.reservationservice.client.JoueurClient;
import com.example.reservationservice.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private JoueurClient joueurClient;

    @Autowired
    private CreneauService creneauService;
/*
    public Reservation creerReservation(ReservationRequest reservationRequest) {
        if (!joueurClient.estUnJoueur(reservationRequest.getIdUtilisateur())) {
            throw new RuntimeException("Seuls les joueurs peuvent réserver");
        }

        Creneau creneau = creneauService.findById(reservationRequest.getCreneauId())
                .orElseThrow(() -> new RuntimeException("Créneau non trouvé"));

        Reservation reservation = new Reservation();
        reservation.setIdUtilisateur(reservationRequest.getIdUtilisateur());
        reservation.setDate(LocalDate.now());  // Définir la date actuelle
        reservation.setStatut("EN_ATTENTE");
        reservation.setCreneau(creneau);

        return reservationRepository.save(reservation);
    }*/

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

//    public Reservation creerReservation(ReservationRequest reservationRequest) {
//
//        // PAS BESOIN DE joueurClient EST-UN-JOUEUR !
//
//        Creneau creneau = creneauService.findById(reservationRequest.getCreneauId())
//                .orElseThrow(() -> new RuntimeException("Créneau non trouvé"));
//
//        Reservation reservation = new Reservation();
//        reservation.setIdUtilisateur(reservationRequest.getIdUtilisateur());
//        reservation.setDate(LocalDate.now());
//        reservation.setStatut("EN_ATTENTE");
//        reservation.setCreneau(creneau);
//
//        return reservationRepository.save(reservation);
//    }

    public Reservation creerReservation(ReservationRequest reservationRequest) {

        Creneau creneau = creneauService.findById(reservationRequest.getCreneauId())
                .orElseThrow(() -> new RuntimeException("Créneau non trouvé"));

        // Vérifier la disponibilité du créneau
        if (!creneau.getDisponibilite() || !"DISPONIBLE".equalsIgnoreCase(creneau.getStatut())) {
            throw new RuntimeException("Ce créneau est déjà réservé !");
        }

        // Créer et sauvegarder la réservation
        Reservation reservation = new Reservation();
        reservation.setIdUtilisateur(reservationRequest.getIdUtilisateur());
        reservation.setDate(LocalDate.now());
        reservation.setStatut("EN_ATTENTE");
        reservation.setCreneau(creneau);

        // Marquer le créneau comme réservé
        creneau.setDisponibilite(false);
        creneau.setStatut("RÉSERVÉ");
        // Sauvegarder les changements sur le créneau
        creneauService.save(creneau);

        return reservationRepository.save(reservation);
    }







    // Mettre à jour une réservation existante







     public Reservation mettreAJourReservation(Long id, ReservationRequest reservationRequest) {
        // Vérifier que l'utilisateur est bien celui qui a créé la réservation
        if (reservationRequest.getIdUtilisateur() != getUtilisateurByReservationId(id)) {
            throw new RuntimeException("Vous ne pouvez pas modifier cette réservation.");
        }

        // Récupérer la réservation existante
        Optional<Reservation> existingReservation = reservationRepository.findById(id);
        if (existingReservation.isPresent()) {
            Reservation reservation = existingReservation.get();

            // Mettre à jour le créneau si un nouveau créneau est fourni
            if (reservationRequest.getCreneauId() != null) {
                Creneau newCreneau = creneauService.findById(reservationRequest.getCreneauId())
                        .orElseThrow(() -> new RuntimeException("Créneau non trouvé"));
                reservation.setCreneau(newCreneau);
            }


            // Mettre à jour le statut si nécessaire
            reservation.setStatut("EN_ATTENTE"); // Vous pouvez définir le statut comme vous le souhaitez

            // Sauvegarder les changements
            return reservationRepository.save(reservation);
        } else {
            throw new RuntimeException("Réservation non trouvée");
        }
    }

    // Méthode fictive pour obtenir l'ID de l'utilisateur qui a créé la réservation
    private int getUtilisateurByReservationId(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
        return reservation.getIdUtilisateur();
    }

    // Obtenir une réservation par ID
    public Reservation obtenirReservation(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
    }

    // Obtenir l'historique des réservations d'un utilisateur
    public List<Reservation> obtenirHistoriqueReservations(int idUtilisateur) {
        return reservationRepository.findByIdUtilisateur(idUtilisateur);
    }

    // Annuler une réservation
    public void annulerReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    // Gérer la confirmation ou l'annulation d'une réservation sans supprimer
    public void gererReservation(Long id, String action) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        if ("CONFIRMER".equalsIgnoreCase(action)) {
            // Confirmation de la réservation
            reservation.setStatut("CONFIRMÉ");
        } else if ("ANNULER".equalsIgnoreCase(action)) {
            // Annulation de la réservation (même pas supprimée)
            reservation.setStatut("ANNULÉ");
        } else {
            throw new IllegalArgumentException("Action non reconnue");
        }

        // Sauvegarder la réservation avec le nouveau statut
        reservationRepository.save(reservation);
    }
}

