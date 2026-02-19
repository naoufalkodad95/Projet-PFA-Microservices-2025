package com.example.reservationservice.Controller;

import com.example.reservationservice.Model.Creneau;
import com.example.reservationservice.repository.CreneauRepository;
import com.example.reservationservice.service.CreneauService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/api/creneaux")
public class CreneauController {

    private final CreneauService service;
    private final CreneauRepository repository;

    public CreneauController(CreneauService service, CreneauRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Creneau>> getAll() {
        try {
            List<Creneau> creneaux = service.findAll();
            if (creneaux.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(creneaux, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/cre")
    public ResponseEntity<List<Creneau>> getAllCreneauxParDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<Creneau> creneaux = repository.findByDate(date);  // Récupérer tous les créneaux pour la date donnée
        return ResponseEntity.ok(creneaux);
    }

     @GetMapping("/creneaux")
     public ResponseEntity<List<Creneau>> getCreneauxParTerrainEtDate(
             @RequestParam Long terrainId,
             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

         List<Creneau> creneaux = repository.findByTerrainIdAndDate(terrainId, date);
         return ResponseEntity.ok(creneaux);
     }

    // Route pour générer les créneaux pour un terrain spécifique
    @PostMapping("/generate/{terrainId}")
    public List<Creneau> generateCreneaux(@PathVariable Long terrainId) {
        return service.generateCreneaux(terrainId); // Appelle la méthode du service pour générer et sauvegarder les créneaux
    }

@postMapping("/test"){
    public List 
}





}
