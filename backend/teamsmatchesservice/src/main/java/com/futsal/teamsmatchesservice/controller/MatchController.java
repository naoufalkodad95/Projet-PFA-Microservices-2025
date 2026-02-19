package com.futsal.teamsmatchesservice.controller;

import com.futsal.teamsmatchesservice.dto.request.MatchRequestDto;
import com.futsal.teamsmatchesservice.dto.request.ResultatMatchDto;
import com.futsal.teamsmatchesservice.dto.response.MatchResponseDto;
import com.futsal.teamsmatchesservice.service.MatchService;
import com.futsal.teamsmatchesservice.util.Constants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(Constants.MATCHS_ENDPOINT)
@RequiredArgsConstructor
@Tag(name = "Matchs", description = "API de gestion des matchs")
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    @Operation(
            summary = "Récupérer tous les matchs",
            description = "Récupère la liste de tous les matchs enregistrés",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des matchs récupérée avec succès"),
                    @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
            }
    )
    public ResponseEntity<List<MatchResponseDto>> getAllMatchs() {
        return ResponseEntity.ok(matchService.getAllMatchs());
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Récupérer un match par son ID",
            description = "Récupère les détails d'un match spécifique",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Match trouvé"),
                    @ApiResponse(responseCode = "404", description = "Match non trouvé")
            }
    )
    public ResponseEntity<MatchResponseDto> getMatchById(
            @Parameter(description = "ID du match à récupérer") @PathVariable Long id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Créer un nouveau match",
            description = "Crée un nouveau match avec les informations fournies",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Match créé avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée")
            }
    )
    public ResponseEntity<MatchResponseDto> createMatch(
            @Parameter(description = "Informations du match à créer") @Valid @RequestBody MatchRequestDto matchDto) {
        return new ResponseEntity<>(matchService.createMatch(matchDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un match",
            description = "Met à jour les informations d'un match existant",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Match mis à jour avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Match non trouvé")
            }
    )
    public ResponseEntity<MatchResponseDto> updateMatch(
            @Parameter(description = "ID du match à mettre à jour") @PathVariable Long id,
            @Parameter(description = "Nouvelles informations du match") @Valid @RequestBody MatchRequestDto matchDto) {
        return ResponseEntity.ok(matchService.updateMatch(id, matchDto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Supprimer un match",
            description = "Supprime un match existant",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Match supprimé avec succès"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Match non trouvé")
            }
    )
    public ResponseEntity<Void> deleteMatch(
            @Parameter(description = "ID du match à supprimer") @PathVariable Long id) {
        matchService.deleteMatch(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/equipe/{equipeId}")
    @Operation(
            summary = "Récupérer les matchs d'une équipe",
            description = "Récupère la liste de tous les matchs d'une équipe spécifique",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des matchs récupérée avec succès"),
                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
            }
    )
    public ResponseEntity<List<MatchResponseDto>> getMatchsEquipe(
            @Parameter(description = "ID de l'équipe") @PathVariable Long equipeId) {
        return ResponseEntity.ok(matchService.getMatchsEquipe(equipeId));
    }

    @GetMapping("/en-attente")
    @Operation(
            summary = "Récupérer les matchs en attente de résultat",
            description = "Récupère la liste de tous les matchs qui n'ont pas encore de résultat",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des matchs récupérée avec succès")
            }
    )
    public ResponseEntity<List<MatchResponseDto>> getMatchsEnAttente() {
        return ResponseEntity.ok(matchService.getMatchsEnAttente());
    }

    @PutMapping("/{id}/resultat")
    @Operation(
            summary = "Saisir le résultat d'un match",
            description = "Enregistre le résultat d'un match",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Résultat enregistré avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Match non trouvé")
            }
    )
    public ResponseEntity<MatchResponseDto> saisirResultat(
            @Parameter(description = "ID du match") @PathVariable Long id,
            @Parameter(description = "Résultat du match") @Valid @RequestBody ResultatMatchDto resultatDto) {
        return ResponseEntity.ok(matchService.saisirResultat(id, resultatDto));
    }

    @GetMapping("/periode")
    @Operation(
            summary = "Récupérer les matchs d'une période",
            description = "Récupère la liste de tous les matchs planifiés dans une période donnée",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des matchs récupérée avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide")
            }
    )
    public ResponseEntity<List<MatchResponseDto>> getMatchsPeriode(
            @Parameter(description = "Date de début de la période")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @Parameter(description = "Date de fin de la période")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(matchService.getMatchsPeriode(debut, fin));
    }

    @GetMapping("/terrain-disponible")
    @Operation(
            summary = "Vérifier la disponibilité d'un terrain",
            description = "Vérifie si un terrain est disponible à une date et heure données",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Vérification effectuée avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide")
            }
    )
    public ResponseEntity<Boolean> isTerrainDisponible(
            @Parameter(description = "Nom du terrain") @RequestParam String terrain,
            @Parameter(description = "Date et heure de début")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @Parameter(description = "Date et heure de fin")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        return ResponseEntity.ok(matchService.isTerrainDisponible(terrain, dateDebut, dateFin));
    }
}