//package com.futsal.teamsmatchesservice.controller;
//
//import com.futsal.teamsmatchesservice.dto.request.EquipeRequestDto;
//import com.futsal.teamsmatchesservice.dto.response.EquipeResponseDto;
//import com.futsal.teamsmatchesservice.dto.response.JoueurResponseDto;
//import com.futsal.teamsmatchesservice.service.EquipeService;
//import com.futsal.teamsmatchesservice.util.Constants;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.Parameter;
//import io.swagger.v3.oas.annotations.media.Content;
//import io.swagger.v3.oas.annotations.media.Schema;
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
//@RequestMapping(Constants.EQUIPES_ENDPOINT)
//@RequiredArgsConstructor
//@Tag(name = "Équipes", description = "API de gestion des équipes")
//public class EquipeController {
//
//    private final EquipeService equipeService;
//
//    @GetMapping
//    @Operation(
//            summary = "Récupérer toutes les équipes",
//            description = "Récupère la liste de toutes les équipes enregistrées",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Liste des équipes récupérée avec succès"),
//                    @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
//            }
//    )
//    public ResponseEntity<List<EquipeResponseDto>> getAllEquipes() {
//        return ResponseEntity.ok(equipeService.getAllEquipes());
//    }
//
//    @GetMapping("/{id}")
//    @Operation(
//            summary = "Récupérer une équipe par son ID",
//            description = "Récupère les détails d'une équipe spécifique",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Équipe trouvée"),
//                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
//            }
//    )
//    public ResponseEntity<EquipeResponseDto> getEquipeById(
//            @Parameter(description = "ID de l'équipe à récupérer") @PathVariable Long id) {
//        return ResponseEntity.ok(equipeService.getEquipeById(id));
//    }
//
//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    @Operation(
//            summary = "Créer une nouvelle équipe",
//            description = "Crée une nouvelle équipe avec les informations fournies",
//            responses = {
//                    @ApiResponse(responseCode = "201", description = "Équipe créée avec succès"),
//                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée")
//            }
//    )
//    public ResponseEntity<EquipeResponseDto> createEquipe(
//            @Parameter(description = "Informations de l'équipe à créer") @Valid @RequestBody EquipeRequestDto equipeDto) {
//        return new ResponseEntity<>(equipeService.createEquipe(equipeDto), HttpStatus.CREATED);
//    }
//
//    @PutMapping("/{id}")
//    @Operation(
//            summary = "Mettre à jour une équipe",
//            description = "Met à jour les informations d'une équipe existante",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Équipe mise à jour avec succès"),
//                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
//            }
//    )
//    public ResponseEntity<EquipeResponseDto> updateEquipe(
//            @Parameter(description = "ID de l'équipe à mettre à jour") @PathVariable Long id,
//            @Parameter(description = "Nouvelles informations de l'équipe") @Valid @RequestBody EquipeRequestDto equipeDto) {
//        return ResponseEntity.ok(equipeService.updateEquipe(id, equipeDto));
//    }
//
//    @DeleteMapping("/{id}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    @Operation(
//            summary = "Supprimer une équipe",
//            description = "Supprime une équipe existante",
//            responses = {
//                    @ApiResponse(responseCode = "204", description = "Équipe supprimée avec succès"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
//            }
//    )
//    public ResponseEntity<Void> deleteEquipe(
//            @Parameter(description = "ID de l'équipe à supprimer") @PathVariable Long id) {
//        equipeService.deleteEquipe(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    @GetMapping("/{id}/joueurs")
//    @Operation(
//            summary = "Récupérer les joueurs d'une équipe",
//            description = "Récupère la liste de tous les joueurs d'une équipe spécifique",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Liste des joueurs récupérée avec succès"),
//                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
//            }
//    )
//    public ResponseEntity<List<JoueurResponseDto>> getJoueursByEquipe(
//            @Parameter(description = "ID de l'équipe") @PathVariable Long id) {
//        return ResponseEntity.ok(equipeService.getJoueursByEquipe(id));
//    }
//
//    @PostMapping("/{id}/joueurs/{joueurId}")
//    @ResponseStatus(HttpStatus.CREATED)
//    @Operation(
//            summary = "Ajouter un joueur à une équipe",
//            description = "Ajoute un joueur existant à une équipe",
//            responses = {
//                    @ApiResponse(responseCode = "201", description = "Joueur ajouté avec succès"),
//                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Équipe ou joueur non trouvé")
//            }
//    )
//    public ResponseEntity<JoueurResponseDto> addJoueurToEquipe(
//            @Parameter(description = "ID de l'équipe") @PathVariable Long id,
//            @Parameter(description = "ID du joueur à ajouter") @PathVariable Long joueurId) {
//        return new ResponseEntity<>(equipeService.addJoueurToEquipe(id, joueurId), HttpStatus.CREATED);
//    }
//
//    @DeleteMapping("/{id}/joueurs/{joueurId}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    @Operation(
//            summary = "Retirer un joueur d'une équipe",
//            description = "Retire un joueur d'une équipe",
//            responses = {
//                    @ApiResponse(responseCode = "204", description = "Joueur retiré avec succès"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Équipe ou joueur non trouvé")
//            }
//    )
//    public ResponseEntity<Void> removeJoueurFromEquipe(
//            @Parameter(description = "ID de l'équipe") @PathVariable Long id,
//            @Parameter(description = "ID du joueur à retirer") @PathVariable Long joueurId) {
//        equipeService.removeJoueurFromEquipe(id, joueurId);
//        return ResponseEntity.noContent().build();
//    }
//
//    @GetMapping("/search")
//    @Operation(
//            summary = "Rechercher des équipes par nom",
//            description = "Recherche des équipes dont le nom contient la chaîne de caractères spécifiée",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Recherche effectuée avec succès")
//            }
//    )
//    public ResponseEntity<List<EquipeResponseDto>> searchEquipesByName(
//            @Parameter(description = "Nom à rechercher") @RequestParam String nom) {
//        return ResponseEntity.ok(equipeService.searchEquipesByName(nom));
//    }
//
//    @GetMapping("/classement")
//    @Operation(
//            summary = "Récupérer le classement des équipes",
//            description = "Récupère la liste des équipes classées par nombre de points",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Classement récupéré avec succès")
//            }
//    )
//    public ResponseEntity<List<EquipeResponseDto>> getEquipesByClassement() {
//        return ResponseEntity.ok(equipeService.getEquipesByClassement());
//    }
//
//    @GetMapping("/{id}/demandes")
//    @Operation(
//            summary = "Récupérer les demandes de joueurs",
//            description = "Récupère la liste des joueurs qui ont demandé à rejoindre l'équipe",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Liste des demandes récupérée avec succès"),
//                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
//            }
//    )
//    public ResponseEntity<List<JoueurResponseDto>> getDemandesJoueurs(
//            @Parameter(description = "ID de l'équipe") @PathVariable Long id) {
//        return ResponseEntity.ok(equipeService.getDemandesJoueurs(id));
//    }
//
//    @PostMapping("/{id}/demandes/{joueurId}/accepter")
//    @Operation(
//            summary = "Accepter une demande de joueur",
//            description = "Accepte la demande d'un joueur pour rejoindre l'équipe",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Demande acceptée avec succès"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Équipe ou joueur non trouvé")
//            }
//    )
//    public ResponseEntity<Void> accepterDemandeJoueur(
//            @Parameter(description = "ID de l'équipe") @PathVariable Long id,
//            @Parameter(description = "ID du joueur") @PathVariable Long joueurId) {
//        equipeService.accepterDemandeJoueur(id, joueurId);
//        return ResponseEntity.ok().build();
//    }
//
//    @PostMapping("/{id}/demandes/{joueurId}/refuser")
//    @Operation(
//            summary = "Refuser une demande de joueur",
//            description = "Refuse la demande d'un joueur pour rejoindre l'équipe",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Demande refusée avec succès"),
//                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
//                    @ApiResponse(responseCode = "404", description = "Équipe ou joueur non trouvé")
//            }
//    )
//    public ResponseEntity<Void> refuserDemandeJoueur(
//            @Parameter(description = "ID de l'équipe") @PathVariable Long id,
//            @Parameter(description = "ID du joueur") @PathVariable Long joueurId) {
//        equipeService.refuserDemandeJoueur(id, joueurId);
//        return ResponseEntity.ok().build();
//    }
//}


package com.futsal.teamsmatchesservice.controller;

import com.futsal.teamsmatchesservice.dto.external.JoueurDto;
import com.futsal.teamsmatchesservice.dto.request.EquipeRequestDto;
import com.futsal.teamsmatchesservice.dto.response.EquipeResponseDto;
import com.futsal.teamsmatchesservice.service.EquipeService;
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
@RequestMapping(Constants.EQUIPES_ENDPOINT)
@RequiredArgsConstructor
@Tag(name = "Équipes", description = "API de gestion des équipes")
public class EquipeController {

    private final EquipeService equipeService;

    @GetMapping
    @Operation(
            summary = "Récupérer toutes les équipes",
            description = "Récupère la liste de toutes les équipes enregistrées",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des équipes récupérée avec succès"),
                    @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
            }
    )
    public ResponseEntity<List<EquipeResponseDto>> getAllEquipes() {
        return ResponseEntity.ok(equipeService.getAllEquipes());
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Récupérer une équipe par son ID",
            description = "Récupère les détails d'une équipe spécifique",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Équipe trouvée"),
                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
            }
    )
    public ResponseEntity<EquipeResponseDto> getEquipeById(
            @Parameter(description = "ID de l'équipe à récupérer") @PathVariable Long id) {
        return ResponseEntity.ok(equipeService.getEquipeById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Créer une nouvelle équipe",
            description = "Crée une nouvelle équipe avec les informations fournies",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Équipe créée avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée")
            }
    )
    public ResponseEntity<EquipeResponseDto> createEquipe(
            @Parameter(description = "Informations de l'équipe à créer") @Valid @RequestBody EquipeRequestDto equipeDto) {
        return new ResponseEntity<>(equipeService.createEquipe(equipeDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une équipe",
            description = "Met à jour les informations d'une équipe existante",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Équipe mise à jour avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
            }
    )
    public ResponseEntity<EquipeResponseDto> updateEquipe(
            @Parameter(description = "ID de l'équipe à mettre à jour") @PathVariable Long id,
            @Parameter(description = "Nouvelles informations de l'équipe") @Valid @RequestBody EquipeRequestDto equipeDto) {
        return ResponseEntity.ok(equipeService.updateEquipe(id, equipeDto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Supprimer une équipe",
            description = "Supprime une équipe existante",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Équipe supprimée avec succès"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
            }
    )
    public ResponseEntity<Void> deleteEquipe(
            @Parameter(description = "ID de l'équipe à supprimer") @PathVariable Long id) {
        equipeService.deleteEquipe(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/joueurs")
    @Operation(
            summary = "Récupérer les joueurs d'une équipe",
            description = "Récupère la liste de tous les joueurs d'une équipe spécifique",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des joueurs récupérée avec succès"),
                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
            }
    )
    public ResponseEntity<List<JoueurDto>> getJoueursByEquipe(
            @Parameter(description = "ID de l'équipe") @PathVariable Long id) {
        return ResponseEntity.ok(equipeService.getJoueursByEquipe(id));
    }

    @PostMapping("/{id}/joueurs/{joueurId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Ajouter un joueur à une équipe",
            description = "Ajoute un joueur existant à une équipe",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Joueur ajouté avec succès"),
                    @ApiResponse(responseCode = "400", description = "Requête invalide"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Équipe ou joueur non trouvé")
            }
    )
    public ResponseEntity<Void> addJoueurToEquipe(
            @Parameter(description = "ID de l'équipe") @PathVariable Long id,
            @Parameter(description = "ID du joueur à ajouter") @PathVariable Long joueurId) {
        equipeService.addJoueurToEquipe(id, joueurId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}/joueurs/{joueurId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
            summary = "Retirer un joueur d'une équipe",
            description = "Retire un joueur d'une équipe",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Joueur retiré avec succès"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Équipe ou joueur non trouvé")
            }
    )
    public ResponseEntity<Void> removeJoueurFromEquipe(
            @Parameter(description = "ID de l'équipe") @PathVariable Long id,
            @Parameter(description = "ID du joueur à retirer") @PathVariable Long joueurId) {
        equipeService.removeJoueurFromEquipe(id, joueurId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/capitaine/{joueurId}")
    @Operation(
            summary = "Nommer un joueur capitaine",
            description = "Nomme un joueur capitaine de l'équipe",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Capitaine nommé avec succès"),
                    @ApiResponse(responseCode = "403", description = "Opération non autorisée"),
                    @ApiResponse(responseCode = "404", description = "Équipe ou joueur non trouvé")
            }
    )
    public ResponseEntity<Void> nommerCapitaine(
            @Parameter(description = "ID de l'équipe") @PathVariable Long id,
            @Parameter(description = "ID du joueur à nommer capitaine") @PathVariable Long joueurId) {
        equipeService.nommerCapitaine(id, joueurId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    @Operation(
            summary = "Rechercher des équipes par nom",
            description = "Recherche des équipes dont le nom contient la chaîne de caractères spécifiée",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recherche effectuée avec succès")
            }
    )
    public ResponseEntity<List<EquipeResponseDto>> searchEquipesByName(
            @Parameter(description = "Nom à rechercher") @RequestParam String nom) {
        return ResponseEntity.ok(equipeService.searchEquipesByName(nom));
    }

    @GetMapping("/classement")
    @Operation(
            summary = "Récupérer le classement des équipes",
            description = "Récupère la liste des équipes classées par nombre de points",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Classement récupéré avec succès")
            }
    )
    public ResponseEntity<List<EquipeResponseDto>> getEquipesByClassement() {
        return ResponseEntity.ok(equipeService.getEquipesByClassement());
    }

    @GetMapping("/{id}/demandes")
    @Operation(
            summary = "Récupérer les demandes de joueurs",
            description = "Récupère la liste des joueurs qui ont demandé à rejoindre l'équipe",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste des demandes récupérée avec succès"),
                    @ApiResponse(responseCode = "404", description = "Équipe non trouvée")
            }
    )
    public ResponseEntity<List<JoueurDto>> getDemandesJoueurs(
            @Parameter(description = "ID de l'équipe") @PathVariable Long id) {
        return ResponseEntity.ok(equipeService.getDemandesJoueurs(id));
    }
}