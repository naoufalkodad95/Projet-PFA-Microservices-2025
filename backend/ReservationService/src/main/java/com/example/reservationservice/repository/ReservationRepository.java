package com.example.reservationservice.repository;

import com.example.reservationservice.Model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Rechercher les réservations par l'idUtilisateur
    List<Reservation> findByIdUtilisateur(int idUtilisateur);

}
