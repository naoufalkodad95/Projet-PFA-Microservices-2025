package com.example.reservationservice.repository;

import com.example.reservationservice.Model.Creneau;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;


public interface CreneauRepository extends JpaRepository<Creneau, Long> {
    List<Creneau> findByTerrainIdAndDate(Long terrainId, LocalDate date);
    List<Creneau> findByDate(LocalDate date);
    List<Creneau> findAll();

}
