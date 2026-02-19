package com.example.reservationservice.Controller;

import com.example.reservationservice.DTO.ReservationRequest;
import com.example.reservationservice.Model.Creneau;
import com.example.reservationservice.Model.Reservation;
import com.example.reservationservice.service.CreneauService;
import com.example.reservationservice.service.ReservationService;
import com.example.reservationservice.client.JoueurClient;
import io.jsonwebtoken.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private CreneauService creneauService;

    @Autowired
    private JoueurClient joueurClient;

    /* @PostMapping
     public ResponseEntity<Reservation> creerReservation(@RequestBody ReservationRequest reservationRequest) {
         try {
             Reservation saved = reservationService.creerReservation(reservationRequest);
             return new ResponseEntity<>(saved, HttpStatus.CREATED);
         } catch (RuntimeException e) {
             return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
         }
     }*/
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }
    @PostMapping
    @PreAuthorize("hasRole('Joueur')")
    public ResponseEntity<Reservation> creerReservation(@RequestBody ReservationRequest reservationRequest,
                                                        @AuthenticationPrincipal Jwt jwt) {
        try {
            // optionnel : vérifier id utilisateur dans token et payload
            Reservation saved = reservationService.creerReservation(reservationRequest);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }
    // Mettre à jour une réservation existante
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> mettreAJourReservation(
            @PathVariable Long id,
            @RequestBody ReservationRequest reservationRequest) {
        try {
            // Appeler la méthode de service pour mettre à jour la réservation
            Reservation updatedReservation = reservationService.mettreAJourReservation(id, reservationRequest);
            return new ResponseEntity<>(updatedReservation, HttpStatus.OK);
        } catch (RuntimeException e) {
            // Retourner un message d'erreur si la réservation n'est pas trouvée ou si un problème survient
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    // Obtenir une réservation par ID
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> obtenirReservation(@PathVariable Long id) {
        try {
            Reservation reservation = reservationService.obtenirReservation(id);
            return new ResponseEntity<>(reservation, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Obtenir l'historique des réservations d'un utilisateur
    @GetMapping("/historique/{idUtilisateur}")
    public ResponseEntity<List<Reservation>> obtenirHistoriqueReservations(@PathVariable int idUtilisateur) {
        try {
            List<Reservation> historique = reservationService.obtenirHistoriqueReservations(idUtilisateur);
            return new ResponseEntity<>(historique, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    // Confirmer ou annuler une réservation (Admin)
    @PutMapping("/{id}/{action}")
    public ResponseEntity<String> gererReservation(@PathVariable Long id, @PathVariable String action) {
        try {
            reservationService.gererReservation(id, action);
            return new ResponseEntity<>("Réservation " + action + " avec succès", HttpStatus.OK);  // 200 OK
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Réservation non trouvée", HttpStatus.NOT_FOUND);  // 404 Not Found

        }

    }}
