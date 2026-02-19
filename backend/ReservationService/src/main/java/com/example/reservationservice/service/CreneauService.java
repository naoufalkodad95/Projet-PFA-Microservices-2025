package com.example.reservationservice.service;

import com.example.reservationservice.Model.Creneau;
import com.example.reservationservice.Model.Terrain;
import com.example.reservationservice.repository.CreneauRepository;
import com.example.reservationservice.repository.TerrainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CreneauService {

    private final CreneauRepository repo;
    private final TerrainRepository terrainRepository;

    public CreneauService(CreneauRepository repo, TerrainRepository terrainRepository) {
        this.repo = repo;
        this.terrainRepository = terrainRepository;
    }


    public Optional<Creneau> findById(Long id) {
        return repo.findById(id);  // Retourne un Optional
    }
    public List<Creneau> findAll() {
        return repo.findAll();
    }

    public Creneau save(Creneau creneau) {
        return repo.save(creneau);
    }

    // Générer des créneaux de 1 heure pour un terrain spécifique
    public List<Creneau> generateCreneaux(Long terrainId) {
        // Récupérer le terrain par son ID
        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain non trouvé"));

        List<Creneau> creneaux = new ArrayList<>();
        LocalDate startDate = LocalDate.now(); // Aujourd'hui
        int days = 7; // Nombre de jours à générer

        for (int i = 0; i < days; i++) {
            LocalDate currentDate = startDate.plusDays(i);
            LocalTime startHour = LocalTime.of(8, 0);
            LocalTime endHour = LocalTime.of(18, 0);

            while (startHour.isBefore(endHour)) {
                Creneau creneau = new Creneau();
                creneau.setDate(currentDate);
                creneau.setDateHeureDebut(LocalDateTime.of(currentDate, startHour));
                creneau.setDateHeureFin(LocalDateTime.of(currentDate, startHour.plusHours(1)));
                creneau.setDisponibilite(true);
                creneau.setStatut("DISPONIBLE");
                creneau.setTerrain(terrain); // Associer le terrain au créneau

                creneaux.add(creneau);
                startHour = startHour.plusHours(1); // Passer à l'heure suivante
            }
        }

        return repo.saveAll(creneaux); // Sauvegarde tous les créneaux
    }


}
