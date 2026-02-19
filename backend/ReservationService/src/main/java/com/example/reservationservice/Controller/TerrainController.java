package com.example.reservationservice.Controller;

import com.example.reservationservice.Model.Terrain;
import com.example.reservationservice.repository.TerrainRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/terrains") // Ce chemin doit correspondre à ce que tu testes dans Postman
public class TerrainController {

    private final TerrainRepository repo;

    public TerrainController(TerrainRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Terrain> getAllTerrains() {
        return repo.findAll();
    }

    @PostMapping
    public Terrain createTerrain(@RequestBody Terrain terrain) {
        return repo.save(terrain);
    }

    @PutMapping("/{id}")
    public Terrain updateTerrain(@PathVariable Long id, @RequestBody Terrain terrain) {
        Terrain existing = repo.findById(id).orElseThrow();
        existing.setNom(terrain.getNom());
        existing.setCapacite(terrain.getCapacite());
        existing.setEtat(terrain.getEtat());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteTerrain(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
