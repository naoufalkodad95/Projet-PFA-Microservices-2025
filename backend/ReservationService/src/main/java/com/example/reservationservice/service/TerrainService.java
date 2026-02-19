package com.example.reservationservice.service;

import com.example.reservationservice.Model.Terrain;
import com.example.reservationservice.repository.TerrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TerrainService {
    private final TerrainRepository repo;
    public TerrainService(TerrainRepository repo) {
        this.repo = repo;
    }


    public Terrain findAll() {
        return (Terrain) repo.findAll();
    }
}