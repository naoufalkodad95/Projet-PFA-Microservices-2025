//// EquipeServiceImpl.java
//package com.futsal.teamsmatchesservice.service.impl;
//
//import com.futsal.teamsmatchesservice.dto.request.EquipeRequestDto;
//import com.futsal.teamsmatchesservice.dto.response.EquipeResponseDto;
//import com.futsal.teamsmatchesservice.dto.response.JoueurResponseDto;
//import com.futsal.teamsmatchesservice.exception.ResourceNotFoundException;
//import com.futsal.teamsmatchesservice.exception.UnauthorizedException;
//import com.futsal.teamsmatchesservice.model.Equipe;
//import com.futsal.teamsmatchesservice.model.Joueur;
//import com.futsal.teamsmatchesservice.model.StatutEnum;
//import com.futsal.teamsmatchesservice.repository.EquipeRepository;
//import com.futsal.teamsmatchesservice.repository.JoueurRepository;
//import com.futsal.teamsmatchesservice.service.EquipeService;
//import com.futsal.teamsmatchesservice.util.DtoMapper;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class EquipeServiceImpl implements EquipeService {
//
//    private final EquipeRepository equipeRepository;
//    private final JoueurRepository joueurRepository;
//    private final DtoMapper dtoMapper;
//
//    @Override
//    public List<EquipeResponseDto> getAllEquipes() {
//        return equipeRepository.findAll().stream()
//                .map(dtoMapper::toEquipeResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public EquipeResponseDto getEquipeById(Long id) {
//        Equipe equipe = findEquipeById(id);
//        return dtoMapper.toEquipeResponseDto(equipe);
//    }
//
//    @Override
//    @Transactional
//    public EquipeResponseDto createEquipe(EquipeRequestDto equipeDto) {
//        // Vérifier si une équipe avec ce nom existe déjà
//        if (equipeRepository.existsByNomIgnoreCase(equipeDto.getNom())) {
//            throw new IllegalArgumentException("Une équipe avec ce nom existe déjà");
//        }
//
//        Equipe equipe = new Equipe();
//        equipe.setNom(equipeDto.getNom());
//        equipe.setLogo(equipeDto.getLogo());
//
//        Equipe savedEquipe = equipeRepository.save(equipe);
//        return dtoMapper.toEquipeResponseDto(savedEquipe);
//    }
//
//    @Override
//    @Transactional
//    public EquipeResponseDto updateEquipe(Long id, EquipeRequestDto equipeDto) {
//        Equipe equipe = findEquipeById(id);
//
//        // Vérifier si une autre équipe utilise déjà ce nom
//        if (!equipe.getNom().equalsIgnoreCase(equipeDto.getNom()) &&
//                equipeRepository.existsByNomIgnoreCase(equipeDto.getNom())) {
//            throw new IllegalArgumentException("Une autre équipe utilise déjà ce nom");
//        }
//
//        equipe.setNom(equipeDto.getNom());
//        if (equipeDto.getLogo() != null) {
//            equipe.setLogo(equipeDto.getLogo());
//        }
//
//        Equipe updatedEquipe = equipeRepository.save(equipe);
//        return dtoMapper.toEquipeResponseDto(updatedEquipe);
//    }
//
//    @Override
//    @Transactional
//    public void deleteEquipe(Long id) {
//        Equipe equipe = findEquipeById(id);
//        equipeRepository.delete(equipe);
//    }
//
//    @Override
//    public List<JoueurResponseDto> getJoueursByEquipe(Long equipeId) {
//        List<Joueur> joueurs = joueurRepository.findByEquipeId(equipeId);
//        return joueurs.stream()
//                .map(dtoMapper::toJoueurResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public JoueurResponseDto addJoueurToEquipe(Long equipeId, Long joueurId) {
//        Equipe equipe = findEquipeById(equipeId);
//        Joueur joueur = joueurRepository.findById(joueurId)
//                .orElseThrow(() -> new ResourceNotFoundException("Joueur non trouvé avec l'ID: " + joueurId));
//
//        // Vérifier si le joueur n'est pas déjà dans une équipe
//        if (joueur.getEquipe() != null) {
//            throw new IllegalArgumentException("Le joueur fait déjà partie d'une équipe");
//        }
//
//        equipe.addJoueur(joueur);
//        equipeRepository.save(equipe);
//
//        return dtoMapper.toJoueurResponseDto(joueur);
//    }
//
//    @Override
//    @Transactional
//    public void removeJoueurFromEquipe(Long equipeId, Long joueurId) {
//        Equipe equipe = findEquipeById(equipeId);
//        Joueur joueur = joueurRepository.findById(joueurId)
//                .orElseThrow(() -> new ResourceNotFoundException("Joueur non trouvé avec l'ID: " + joueurId));
//
//        // Vérifier si le joueur appartient bien à cette équipe
//        if (joueur.getEquipe() == null || !joueur.getEquipe().getId().equals(equipeId)) {
//            throw new UnauthorizedException("Ce joueur n'appartient pas à cette équipe");
//        }
//
//        // Vérifier si c'est le capitaine (on ne peut pas retirer le capitaine)
//        if (joueur.isEstCapitaine()) {
//            throw new UnauthorizedException("Impossible de retirer le capitaine de l'équipe");
//        }
//
//        equipe.removeJoueur(joueur);
//        equipeRepository.save(equipe);
//    }
//
//    @Override
//    public List<EquipeResponseDto> searchEquipesByName(String nom) {
//        return equipeRepository.findByNomContainingIgnoreCase(nom).stream()
//                .map(dtoMapper::toEquipeResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<EquipeResponseDto> getEquipesByClassement() {
//        return equipeRepository.findAllOrderByPointsDesc().stream()
//                .map(dtoMapper::toEquipeResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<JoueurResponseDto> getDemandesJoueurs(Long equipeId) {
//        // Vérifier que l'équipe existe
//        findEquipeById(equipeId);
//
//        // Récupérer les joueurs qui ont fait une demande pour rejoindre cette équipe
//        List<Joueur> joueurs = joueurRepository.findByDemandeEquipeIdAndStatutDemande(equipeId, StatutEnum.EN_ATTENTE);
//
//        return joueurs.stream()
//                .map(dtoMapper::toJoueurResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public void accepterDemandeJoueur(Long equipeId, Long joueurId) {
//        Equipe equipe = findEquipeById(equipeId);
//        Joueur joueur = joueurRepository.findById(joueurId)
//                .orElseThrow(() -> new ResourceNotFoundException("Joueur non trouvé avec l'ID: " + joueurId));
//
//        // Vérifier que le joueur a bien fait une demande pour cette équipe
//        if (!equipeId.equals(joueur.getDemandeEquipeId()) || joueur.getStatutDemande() != StatutEnum.EN_ATTENTE) {
//            throw new UnauthorizedException("Aucune demande en attente de ce joueur pour cette équipe");
//        }
//
//        // Vérifier que le joueur n'est pas déjà dans une équipe
//        if (joueur.getEquipe() != null) {
//            throw new IllegalArgumentException("Le joueur fait déjà partie d'une équipe");
//        }
//
//        // Ajouter le joueur à l'équipe
//        equipe.addJoueur(joueur);
//
//        // Mettre à jour le statut de la demande
//        joueur.setStatutDemande(StatutEnum.ACCEPTE);
//        joueur.setDemandeEquipeId(null);
//
//        joueurRepository.save(joueur);
//    }
//
//    @Override
//    @Transactional
//    public void refuserDemandeJoueur(Long equipeId, Long joueurId) {
//        // Vérifier que l'équipe existe
//        findEquipeById(equipeId);
//
//        Joueur joueur = joueurRepository.findById(joueurId)
//                .orElseThrow(() -> new ResourceNotFoundException("Joueur non trouvé avec l'ID: " + joueurId));
//
//        // Vérifier que le joueur a bien fait une demande pour cette équipe
//        if (!equipeId.equals(joueur.getDemandeEquipeId()) || joueur.getStatutDemande() != StatutEnum.EN_ATTENTE) {
//            throw new UnauthorizedException("Aucune demande en attente de ce joueur pour cette équipe");
//        }
//
//        // Mettre à jour le statut de la demande
//        joueur.setStatutDemande(StatutEnum.REFUSE);
//        joueur.setDemandeEquipeId(null);
//
//        joueurRepository.save(joueur);
//    }
//
//    @Override
//    @Transactional
//    public void updateEquipeStats(Long equipeId, int butsMarques, int butsEncaisses, String resultat) {
//        Equipe equipe = findEquipeById(equipeId);
//
//        // Mettre à jour les statistiques de l'équipe
//        equipe.setNbrButPlus(equipe.getNbrButPlus() + butsMarques);
//        equipe.setNbrButMoins(equipe.getNbrButMoins() + butsEncaisses);
//
//        // Mettre à jour le résultat (victoire, défaite, égalité)
//        switch (resultat.toLowerCase()) {
//            case "victoire":
//                equipe.setVictoires(equipe.getVictoires() + 1);
//                equipe.setPoints(equipe.getPoints() + 3);
//                break;
//            case "defaite":
//                equipe.setDefaites(equipe.getDefaites() + 1);
//                break;
//            case "egalite":
//                equipe.setEgalites(equipe.getEgalites() + 1);
//                equipe.setPoints(equipe.getPoints() + 1);
//                break;
//            default:
//                throw new IllegalArgumentException("Résultat invalide. Valeurs acceptées: victoire, defaite, egalite");
//        }
//
//        equipeRepository.save(equipe);
//    }
//
//    // Méthode utilitaire pour trouver une équipe par ID
//    private Equipe findEquipeById(Long id) {
//        return equipeRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Équipe non trouvée avec l'ID: " + id));
//    }
//}


package com.futsal.teamsmatchesservice.service.impl;

import com.futsal.teamsmatchesservice.dto.external.JoueurDto;
import com.futsal.teamsmatchesservice.dto.request.EquipeRequestDto;
import com.futsal.teamsmatchesservice.dto.response.EquipeResponseDto;
import com.futsal.teamsmatchesservice.exception.ResourceNotFoundException;
import com.futsal.teamsmatchesservice.exception.UnauthorizedException;
import com.futsal.teamsmatchesservice.model.Equipe;
import com.futsal.teamsmatchesservice.repository.EquipeRepository;
import com.futsal.teamsmatchesservice.service.EquipeService;
import com.futsal.teamsmatchesservice.service.JoueurClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implémentation du service de gestion des équipes
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EquipeServiceImpl implements EquipeService {

    private final EquipeRepository equipeRepository;
    private final JoueurClientService joueurClientService;

    @Override
    public List<EquipeResponseDto> getAllEquipes() {
        log.debug("Récupération de toutes les équipes");
        List<Equipe> equipes = equipeRepository.findAll();
        return equipes.stream()
                .map(equipe -> toEquipeResponseDto(equipe, false))
                .collect(Collectors.toList());
    }

    @Override
    public EquipeResponseDto getEquipeById(Long id) {
        log.debug("Récupération de l'équipe avec ID: {}", id);
        Equipe equipe = findEquipeById(id);
        return toEquipeResponseDto(equipe, true);
    }

    @Override
    @Transactional
    public EquipeResponseDto createEquipe(EquipeRequestDto equipeDto) {
        log.debug("Création d'une nouvelle équipe: {}", equipeDto.getNom());

        // Vérifier si une équipe avec ce nom existe déjà
        if (equipeRepository.existsByNomIgnoreCase(equipeDto.getNom())) {
            log.warn("Une équipe avec le nom '{}' existe déjà", equipeDto.getNom());
            throw new IllegalArgumentException("Une équipe avec ce nom existe déjà");
        }

        Equipe equipe = new Equipe();
        equipe.setNom(equipeDto.getNom());
        equipe.setLogo(equipeDto.getLogo());

        Equipe savedEquipe = equipeRepository.save(equipe);
        log.info("Équipe créée avec succès: ID={}, Nom={}", savedEquipe.getId(), savedEquipe.getNom());

        return toEquipeResponseDto(savedEquipe, false);
    }

    @Override
    @Transactional
    public EquipeResponseDto updateEquipe(Long id, EquipeRequestDto equipeDto) {
        log.debug("Mise à jour de l'équipe avec ID: {}", id);
        Equipe equipe = findEquipeById(id);

        // Vérifier si une autre équipe utilise déjà ce nom
        if (!equipe.getNom().equalsIgnoreCase(equipeDto.getNom()) &&
                equipeRepository.existsByNomIgnoreCase(equipeDto.getNom())) {
            log.warn("Une autre équipe utilise déjà le nom '{}'", equipeDto.getNom());
            throw new IllegalArgumentException("Une autre équipe utilise déjà ce nom");
        }

        equipe.setNom(equipeDto.getNom());
        if (equipeDto.getLogo() != null) {
            equipe.setLogo(equipeDto.getLogo());
        }

        Equipe updatedEquipe = equipeRepository.save(equipe);
        log.info("Équipe mise à jour avec succès: ID={}, Nom={}", updatedEquipe.getId(), updatedEquipe.getNom());

        return toEquipeResponseDto(updatedEquipe, false);
    }

    @Override
    @Transactional
    public void deleteEquipe(Long id) {
        log.debug("Suppression de l'équipe avec ID: {}", id);
        Equipe equipe = findEquipeById(id);
        equipeRepository.delete(equipe);
        log.info("Équipe supprimée avec succès: ID={}, Nom={}", id, equipe.getNom());
    }

    @Override
    public List<JoueurDto> getJoueursByEquipe(Long equipeId) {
        log.debug("Récupération des joueurs de l'équipe avec ID: {}", equipeId);
        Equipe equipe = findEquipeById(equipeId);
        return joueurClientService.getJoueursByIds(equipe.getJoueursIds());
    }

    @Override
    @Transactional
    public void addJoueurToEquipe(Long equipeId, Long joueurId) {
        log.debug("Ajout du joueur ID: {} à l'équipe ID: {}", joueurId, equipeId);
        Equipe equipe = findEquipeById(equipeId);

        // Vérification que le joueur existe (appel au microservice Utilisateurs)
        JoueurDto joueur = joueurClientService.getJoueurById(joueurId);
        if (joueur == null) {
            log.warn("Joueur non trouvé avec l'ID: {}", joueurId);
            throw new ResourceNotFoundException("Joueur non trouvé avec l'ID: " + joueurId);
        }

        // Vérifier si le joueur n'est pas déjà dans l'équipe
        if (equipe.getJoueursIds().contains(joueurId)) {
            log.warn("Le joueur ID: {} fait déjà partie de l'équipe ID: {}", joueurId, equipeId);
            throw new IllegalArgumentException("Le joueur fait déjà partie de cette équipe");
        }

        equipe.addJoueurId(joueurId);
        equipeRepository.save(equipe);
        log.info("Joueur ID: {} ajouté avec succès à l'équipe ID: {}", joueurId, equipeId);
    }

    @Override
    @Transactional
    public void removeJoueurFromEquipe(Long equipeId, Long joueurId) {
        log.debug("Retrait du joueur ID: {} de l'équipe ID: {}", joueurId, equipeId);
        Equipe equipe = findEquipeById(equipeId);

        // Vérifier que le joueur fait bien partie de l'équipe
        if (!equipe.getJoueursIds().contains(joueurId)) {
            log.warn("Le joueur ID: {} ne fait pas partie de l'équipe ID: {}", joueurId, equipeId);
            throw new UnauthorizedException("Ce joueur n'appartient pas à cette équipe");
        }

        // Vérifier que ce n'est pas le capitaine
        if (joueurId.equals(equipe.getCapitaineId())) {
            log.warn("Impossible de retirer le capitaine (ID: {}) de l'équipe ID: {}", joueurId, equipeId);
            throw new UnauthorizedException("Impossible de retirer le capitaine de l'équipe");
        }

        equipe.removeJoueurId(joueurId);
        equipeRepository.save(equipe);
        log.info("Joueur ID: {} retiré avec succès de l'équipe ID: {}", joueurId, equipeId);
    }

    @Override
    @Transactional
    public void nommerCapitaine(Long equipeId, Long joueurId) {
        log.debug("Nomination du joueur ID: {} comme capitaine de l'équipe ID: {}", joueurId, equipeId);
        Equipe equipe = findEquipeById(equipeId);

        // Vérifier que le joueur fait bien partie de l'équipe
        if (!equipe.getJoueursIds().contains(joueurId)) {
            log.warn("Le joueur ID: {} ne fait pas partie de l'équipe ID: {}", joueurId, equipeId);
            throw new UnauthorizedException("Ce joueur n'appartient pas à cette équipe");
        }

        equipe.setCapitaineId(joueurId);
        equipeRepository.save(equipe);
        log.info("Joueur ID: {} nommé capitaine de l'équipe ID: {}", joueurId, equipeId);
    }

    @Override
    public List<EquipeResponseDto> searchEquipesByName(String nom) {
        log.debug("Recherche d'équipes par nom: {}", nom);
        return equipeRepository.findByNomContainingIgnoreCase(nom).stream()
                .map(equipe -> toEquipeResponseDto(equipe, false))
                .collect(Collectors.toList());
    }

    @Override
    public List<EquipeResponseDto> getEquipesByClassement() {
        log.debug("Récupération du classement des équipes");
        return equipeRepository.findAllOrderByPointsDesc().stream()
                .map(equipe -> toEquipeResponseDto(equipe, false))
                .collect(Collectors.toList());
    }

    @Override
    public List<JoueurDto> getDemandesJoueurs(Long equipeId) {
        log.debug("Récupération des demandes de joueurs pour l'équipe ID: {}", equipeId);
        // Vérifier que l'équipe existe
        findEquipeById(equipeId);

        // Récupérer les demandes depuis le microservice Utilisateurs
        return joueurClientService.getDemandesJoueurs(equipeId);
    }

    @Override
    @Transactional
    public void updateEquipeStats(Long equipeId, int butsMarques, int butsEncaisses, String resultat) {
        log.debug("Mise à jour des statistiques de l'équipe ID: {} - Buts marqués: {}, Buts encaissés: {}, Résultat: {}",
                equipeId, butsMarques, butsEncaisses, resultat);

        Equipe equipe = findEquipeById(equipeId);

        // Mettre à jour les statistiques de l'équipe
        equipe.setNbrButPlus(equipe.getNbrButPlus() + butsMarques);
        equipe.setNbrButMoins(equipe.getNbrButMoins() + butsEncaisses);

        // Mettre à jour le résultat (victoire, défaite, égalité)
        switch (resultat.toLowerCase()) {
            case "victoire":
                equipe.setVictoires(equipe.getVictoires() + 1);
                equipe.setPoints(equipe.getPoints() + 3);
                break;
            case "defaite":
                equipe.setDefaites(equipe.getDefaites() + 1);
                break;
            case "egalite":
                equipe.setEgalites(equipe.getEgalites() + 1);
                equipe.setPoints(equipe.getPoints() + 1);
                break;
            default:
                log.warn("Résultat invalide: {}", resultat);
                throw new IllegalArgumentException("Résultat invalide. Valeurs acceptées: victoire, defaite, egalite");
        }

        equipeRepository.save(equipe);
        log.info("Statistiques de l'équipe ID: {} mises à jour avec succès", equipeId);
    }

    // Méthode utilitaire pour trouver une équipe par ID
    private Equipe findEquipeById(Long id) {
        return equipeRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Équipe non trouvée avec l'ID: {}", id);
                    return new ResourceNotFoundException("Équipe non trouvée avec l'ID: " + id);
                });
    }

    // Méthode utilitaire pour convertir une entité Equipe en DTO
    private EquipeResponseDto toEquipeResponseDto(Equipe equipe, boolean includeJoueurs) {
        EquipeResponseDto dto = new EquipeResponseDto();
        dto.setId(equipe.getId());
        dto.setNom(equipe.getNom());
        dto.setNbrButPlus(equipe.getNbrButPlus());
        dto.setNbrButMoins(equipe.getNbrButMoins());
        dto.setVictoires(equipe.getVictoires());
        dto.setDefaites(equipe.getDefaites());
        dto.setEgalites(equipe.getEgalites());
        dto.setPoints(equipe.getPoints());
        dto.setLogo(equipe.getLogo());
        dto.setCapitaineId(equipe.getCapitaineId());
        dto.setJoueursIds(equipe.getJoueursIds());

        // Récupérer les informations du capitaine si disponible
        if (equipe.getCapitaineId() != null) {
            dto.setCapitaine(joueurClientService.getCapitaine(equipe.getCapitaineId()));
        }

        // Récupérer les détails des joueurs si demandé
        if (includeJoueurs && !equipe.getJoueursIds().isEmpty()) {
            dto.setJoueurs(joueurClientService.getJoueursByIds(equipe.getJoueursIds()));
        }

        return dto;
    }
}