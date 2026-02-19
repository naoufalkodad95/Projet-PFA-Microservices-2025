package com.example.reservationservice.repository;

import com.example.reservationservice.Model.Terrain;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TerrainRepository extends JpaRepository<Terrain, Long> {
}
