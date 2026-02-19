package com.futsal.teamsmatchesservice.controller;

import com.futsal.teamsmatchesservice.dto.request.DefiRequestDto;
import com.futsal.teamsmatchesservice.dto.response.DefiResponseDto;
import com.futsal.teamsmatchesservice.model.StatutEnum;
import com.futsal.teamsmatchesservice.service.DefiService;
import com.futsal.teamsmatchesservice.util.Constants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Constants.DEFIS_ENDPOINT)
@RequiredArgsConstructor
@Tag(name = "Défis", description = "API de gestion des défis entre équipes")
public class DefiController {

    private final DefiService defiService;

    @GetMapping
    @Operation(
            summary = "Récupérer tous les défis",
            description = "Récupère la liste de tous les défis enregistrés",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des défis récupérée avec succès"),
                    @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
            }
    )
    public ResponseEntity<List<DefiResponseDto>> getAllDefis() {
        return ResponseEntity.ok(defiService.getAllDefis());
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Récupérer un défi par son ID",
            description = "Récupère les détails d'un défi spécifique",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Défi trouvé"),
                    @ApiResponse(responseCode = "404", description = "Défi non trouvé")
            }
    )
    public ResponseEntity<DefiResponseDto> getDefiById(
            @Parameter(description = "ID du défi à récupérer") @PathVariable Long id) {
        return ResponseEntity.ok(defiService.getDefiById(id));
    }

    @PostMapping("/equipes/{equipeInitiatriceId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Créer un nouveau défi",
            description = "Crée un nouveau défi avec les informations fournies",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Défi créé avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
            }
    )
    public ResponseEntity<DefiResponseDto> createDefi(
            @Parameter(description = "ID de l'équipe initiatrice") @PathVariable Long equipeInitiatriceId,
            @Parameter(description = "Informations du défi à créer") @Valid @RequestBody DefiRequestDto defiDto) {
        return new ResponseEntity<>(defiService.createDefi(equipeInitiatriceId, defiDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un défi",
            description = "Met à jour les informations d'un défi existant",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Défi mis à jour avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Défi non trouvé")
            }
    )
    public ResponseEntity<DefiResponseDto> updateDefi(
            @Parameter(description = "ID du défi à mettre à jour") @PathVariable Long id,
            @Parameter(description = "Nouvelles informations du défi") @Valid @RequestBody DefiRequestDto defiDto) {
        return ResponseEntity.ok(defiService.updateDefi(id, defiDto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Supprimer un défi",
            description = "Supprime un défi existant",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Défi supprimé avec succès"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Défi non trouvé")
            }
    )
    public ResponseEntity<Void> deleteDefi(
            @Parameter(description = "ID du défi à supprimer") @PathVariable Long id) {
        defiService.deleteDefi(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/equipes/{equipeId}/envoyes")
    @Operation(
            summary = "Récupérer les défis envoyés par une équipe",
            description = "Récupère la liste de tous les défis envoyés par une équipe spécifique",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des défis récupérée avec succès"),
                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
            }
    )
    public ResponseEntity<List<DefiResponseDto>> getDefisEnvoyesByEquipe(
            @Parameter(description = "ID de l'équipe") @PathVariable Long equipeId) {
        return ResponseEntity.ok(defiService.getDefisEnvoyesByEquipe(equipeId));
    }

    @GetMapping("/equipes/{equipeId}/recus")
    @Operation(
            summary = "Récupérer les défis reçus par une équipe",
            description = "Récupère la liste de tous les défis reçus par une équipe spécifique",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des défis récupérée avec succès"),
                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
            }
    )
    public ResponseEntity<List<DefiResponseDto>> getDefisRecusByEquipe(
            @Parameter(description = "ID de l'équipe") @PathVariable Long equipeId) {
        return ResponseEntity.ok(defiService.getDefisRecusByEquipe(equipeId));
    }

    @PutMapping("/{id}/accepter")
    @Operation(
            summary = "Accepter un défi",
            description = "Accepte un défi et crée un match associé",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Défi accepté avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Défi non trouvé")
            }
    )
    public ResponseEntity<DefiResponseDto> accepterDefi(
            @Parameter(description = "ID du défi") @PathVariable Long id) {
        return ResponseEntity.ok(defiService.accepterDefi(id));
    }

    @PutMapping("/{id}/refuser")
    @Operation(
            summary = "Refuser un défi",
            description = "Refuse un défi",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Défi refusé avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Défi non trouvé")
            }
    )
    public ResponseEntity<DefiResponseDto> refuserDefi(
            @Parameter(description = "ID du défi") @PathVariable Long id) {
        return ResponseEntity.ok(defiService.refuserDefi(id));
    }

    @PutMapping("/{id}/annuler")
    @Operation(
            summary = "Annuler un défi",
            description = "Annule un défi en attente",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Défi annulé avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Défi non trouvé")
            }
    )
    public ResponseEntity<DefiResponseDto> annulerDefi(
            @Parameter(description = "ID du défi") @PathVariable Long id) {
        return ResponseEntity.ok(defiService.annulerDefi(id));
    }

    @GetMapping("/statut/{statut}")
    @Operation(
            summary = "Récupérer les défis par statut",
            description = "Récupère la liste de tous les défis avec un statut spécifique",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des défis récupérée avec succès"),
                    @ApiResponse(responseCode = "400", description = "Statut invalide")
            }
    )
    public ResponseEntity<List<DefiResponseDto>> getDefisByStatut(
            @Parameter(description = "Statut des défis") @PathVariable StatutEnum statut) {
        return ResponseEntity.ok(defiService.getDefisByStatut(statut));
    }
}