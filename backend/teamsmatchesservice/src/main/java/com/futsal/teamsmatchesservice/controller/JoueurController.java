//package com.futsal.teamsmatchesservice.controller;
//
//import com.futsal.teamsmatchesservice.dto.request.JoueurRequestDto;
//import com.futsal.teamsmatchesservice.dto.response.JoueurResponseDto;
//import com.futsal.teamsmatchesservice.service.JoueurService;
//import com.futsal.teamsmatchesservice.util.Constants;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.Parameter;
//import io.swagger.v3.oas.annotations.responses.ApiResponse;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping(Constants.JOUEURS_ENDPOINT)
//@RequiredArgsConstructor
//@Tag(name = "Joueurs", description = "API de gestion des joueurs")
//public class JoueurController {
//
//    private final JoueurService joueurService;
//
//    @GetMapping
//    @Operation(
//            summary = "Récupérer tous les joueurs",
//            description = "Récupère la liste de tous les joueurs enregistrés",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Liste des joueurs récupérée avec succès"),
//                    @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
//            }
//    )
//    public ResponseEntity<List<JoueurResponseDto>> getAllJoueurs() {
//        return ResponseEntity.ok(joueurService.getAllJoueurs());
//    }
//
//    @GetMapping("/{id}")
//    @Operation(
//            summary = "Récupérer un joueur par son ID",
//            description = "Récupère les détails d'un joueur spécifique",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Joueur trouvé"),
//                    @ApiResponse(responseCode = "404", description = "Joueur non trouvé")
//            }
//    )
//    public ResponseEntity<JoueurResponseDto> getJoueurById(
//            @Parameter(description = "ID du joueur à récupérer") @PathVariable Long id) {
//        return ResponseEntity.ok(joueurService.getJoueurById(id));
//    }
//
//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    @Operation(
//            summary = "Créer un nouveau joueur",
//            description = "Crée un nouveau joueur avec les informations fournies",
//            responses = {
//                    @ApiResponse(responseCode = "201", description = "Joueur créé avec succès"),
//                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée")
//            }
//    )
//    public ResponseEntity<JoueurResponseDto> createJoueur(
//            @Parameter(description = "Informations du joueur à créer") @Valid @RequestBody JoueurRequestDto joueurDto) {
//        return new ResponseEntity<>(joueurService.createJoueur(joueurDto), HttpStatus.CREATED);
//    }
//
//    @PutMapping("/{id}")
//    @Operation(
//            summary = "Mettre à jour un joueur",
//            description = "Met à jour les informations d'un joueur existant",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Joueur mis à jour avec succès"),
//                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Joueur non trouvé")
//            }
//    )
//    public ResponseEntity<JoueurResponseDto> updateJoueur(
//            @Parameter(description = "ID du joueur à mettre à jour") @PathVariable Long id,
//            @Parameter(description = "Nouvelles informations du joueur") @Valid @RequestBody JoueurRequestDto joueurDto) {
//        return ResponseEntity.ok(joueurService.updateJoueur(id, joueurDto));
//    }
//
//    @DeleteMapping("/{id}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    @Operation(
//            summary = "Supprimer un joueur",
//            description = "Supprime un joueur existant",
//            responses = {
//                    @ApiResponse(responseCode = "204", description = "Joueur supprimé avec succès"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Joueur non trouvé")
//            }
//    )
//    public ResponseEntity<Void> deleteJoueur(
//            @Parameter(description = "ID du joueur à supprimer") @PathVariable Long id) {
//        joueurService.deleteJoueur(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    @PostMapping("/{id}/equipes/{equipeId}/demande")
//    @Operation(
//            summary = "Demander à rejoindre une équipe",
//            description = "Crée une demande pour rejoindre une équipe spécifique",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Demande créée avec succès"),
//                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Joueur ou équipe non trouvé")
//            }
//    )
//    public ResponseEntity<JoueurResponseDto> demanderRejoindreEquipe(
//            @Parameter(description = "ID du joueur") @PathVariable Long id,
//            @Parameter(description = "ID de l'équipe") @PathVariable Long equipeId) {
//        return ResponseEntity.ok(joueurService.demanderRejoindreEquipe(id, equipeId));
//    }
//
//    @DeleteMapping("/{id}/demande")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    @Operation(
//            summary = "Annuler une demande pour rejoindre une équipe",
//            description = "Annule une demande en cours pour rejoindre une équipe",
//            responses = {
//                    @ApiResponse(responseCode = "204", description = "Demande annulée avec succès"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Joueur non trouvé")
//            }
//    )
//    public ResponseEntity<Void> annulerDemandeRejoindreEquipe(
//            @Parameter(description = "ID du joueur") @PathVariable Long id) {
//        joueurService.annulerDemandeRejoindreEquipe(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    @GetMapping("/search")
//    @Operation(
//            summary = "Rechercher des joueurs",
//            description = "Recherche des joueurs selon des critères spécifiques (position, niveau)",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Recherche effectuée avec succès")
//            }
//    )
//    public ResponseEntity<List<JoueurResponseDto>> searchJoueurs(
//            @Parameter(description = "Position du joueur") @RequestParam(required = false) String position,
//            @Parameter(description = "Niveau minimum du joueur") @RequestParam(required = false) Integer niveauMin) {
//        return ResponseEntity.ok(joueurService.searchJoueurs(position, niveauMin));
//    }
//
//    @GetMapping("/sans-equipe")
//    @Operation(
//            summary = "Récupérer les joueurs sans équipe",
//            description = "Récupère la liste de tous les joueurs qui ne font partie d'aucune équipe",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
//            }
//    )
//    public ResponseEntity<List<JoueurResponseDto>> getJoueursSansEquipe() {
//        return ResponseEntity.ok(joueurService.getJoueursSansEquipe());
//    }
//
//    @PutMapping("/{id}/capitaine")
//    @Operation(
//            summary = "Nommer un joueur capitaine",
//            description = "Nomme un joueur capitaine de son équipe",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Joueur nommé capitaine avec succès"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Joueur non trouvé")
//            }
//    )
//    public ResponseEntity<JoueurResponseDto> nommerCapitaine(
//            @Parameter(description = "ID du joueur") @PathVariable Long id) {
//        return ResponseEntity.ok(joueurService.nommerCapitaine(id));
//    }
//
//    @PutMapping("/{id}/stats")
//    @Operation(
//            summary = "Mettre à jour les statistiques d'un joueur",
//            description = "Met à jour les statistiques d'un joueur (buts marqués)",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Statistiques mises à jour avec succès"),
//                    @ApiResponse(responseCode = "404", description = "Joueur non trouvé")
//            }
//    )
//    public ResponseEntity<JoueurResponseDto> updateStatistiquesJoueur(
//            @Parameter(description = "ID du joueur") @PathVariable Long id,
//            @Parameter(description = "Nombre de buts marqués") @RequestParam int butsMarques) {
//        return ResponseEntity.ok(joueurService.updateStatistiquesJoueur(id, butsMarques));
//    }
//
//    @GetMapping("/top-buteurs")
//    @Operation(
//            summary = "Récupérer les meilleurs buteurs",
//            description = "Récupère la liste des meilleurs buteurs",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
//            }
//    )
//    public ResponseEntity<List<JoueurResponseDto>> getTopButeurs(
//            @Parameter(description = "Nombre de joueurs à récupérer") @RequestParam(defaultValue = "10") int limit) {
//        return ResponseEntity.ok(joueurService.getTopButeurs(limit));
//    }
//}