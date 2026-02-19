// DefiServiceImpl.java
package com.futsal.teamsmatchesservice.service.impl;

import com.futsal.teamsmatchesservice.dto.request.DefiRequestDto;
import com.futsal.teamsmatchesservice.dto.request.MatchRequestDto;
import com.futsal.teamsmatchesservice.dto.response.DefiResponseDto;
import com.futsal.teamsmatchesservice.dto.response.MatchResponseDto;
import com.futsal.teamsmatchesservice.exception.ResourceNotFoundException;
import com.futsal.teamsmatchesservice.exception.UnauthorizedException;
import com.futsal.teamsmatchesservice.model.Defi;
import com.futsal.teamsmatchesservice.model.Equipe;
import com.futsal.teamsmatchesservice.model.StatutEnum;
import com.futsal.teamsmatchesservice.repository.DefiRepository;
import com.futsal.teamsmatchesservice.repository.EquipeRepository;
import com.futsal.teamsmatchesservice.service.DefiService;
import com.futsal.teamsmatchesservice.service.MatchService;
import com.futsal.teamsmatchesservice.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DefiServiceImpl implements DefiService {

    private final DefiRepository defiRepository;
    private final EquipeRepository equipeRepository;
    private final MatchService matchService;
    private final DtoMapper dtoMapper;

    @Override
    public List<DefiResponseDto> getAllDefis() {
        return defiRepository.findAll().stream()
                .map(dtoMapper::toDefiResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public DefiResponseDto getDefiById(Long id) {
        Defi defi = findDefiById(id);
        return dtoMapper.toDefiResponseDto(defi);
    }

    @Override
    @Transactional
    public DefiResponseDto createDefi(Long equipeInitiatriceId, DefiRequestDto defiDto) {
        // Vérifier que les équipes existent
        Equipe equipeInitiatrice = equipeRepository.findById(equipeInitiatriceId)
                .orElseThrow(() -> new ResourceNotFoundException("Équipe initiatrice non trouvée avec l'ID: " + equipeInitiatriceId));

        Equipe equipeAdverse = equipeRepository.findById(defiDto.getEquipeAdverseId())
                .orElseThrow(() -> new ResourceNotFoundException("Équipe adverse non trouvée avec l'ID: " + defiDto.getEquipeAdverseId()));

        // Vérifier que ce n'est pas la même équipe
        if (equipeInitiatriceId.equals(defiDto.getEquipeAdverseId())) {
            throw new IllegalArgumentException("Une équipe ne peut pas se défier elle-même");
        }

        // Vérifier que l'heure de fin est après l'heure de début
        if (defiDto.getHeureDebut().isAfter(defiDto.getHeureFin()) || defiDto.getHeureDebut().equals(defiDto.getHeureFin())) {
            throw new IllegalArgumentException("L'heure de fin doit être postérieure à l'heure de début");
        }

        // Vérifier qu'il n'y a pas déjà un défi entre ces équipes à cette date
        List<StatutEnum> statutsActifs = List.of(StatutEnum.EN_ATTENTE, StatutEnum.ACCEPTE);
        if (defiRepository.existsDefiForEquipesOnDate(
                equipeInitiatriceId, defiDto.getEquipeAdverseId(), defiDto.getDateDefi(), statutsActifs)) {
            throw new IllegalArgumentException("Un défi existe déjà entre ces équipes à cette date");
        }

        // Vérifier la disponibilité du terrain
        LocalDateTime debut = LocalDateTime.of(defiDto.getDateDefi(), defiDto.getHeureDebut());
        LocalDateTime fin = LocalDateTime.of(defiDto.getDateDefi(), defiDto.getHeureFin());

        if (!matchService.isTerrainDisponible(defiDto.getTerrain(), debut, fin)) {
            throw new IllegalArgumentException("Le terrain n'est pas disponible à cette date/heure");
        }

        Defi defi = new Defi();
        defi.setEquipeInitiatrice(equipeInitiatrice);
        defi.setEquipeAdverse(equipeAdverse);
        defi.setDateDefi(defiDto.getDateDefi());
        defi.setHeureDebut(defiDto.getHeureDebut());
        defi.setHeureFin(defiDto.getHeureFin());
        defi.setTerrain(defiDto.getTerrain());
        defi.setMessage(defiDto.getMessage());
        defi.setStatut(StatutEnum.EN_ATTENTE);

        Defi savedDefi = defiRepository.save(defi);
        return dtoMapper.toDefiResponseDto(savedDefi);
    }

    @Override
    @Transactional
    public DefiResponseDto updateDefi(Long id, DefiRequestDto defiDto) {
        Defi defi = findDefiById(id);

        // Vérifier que le défi est bien en attente
        if (defi.getStatut() != StatutEnum.EN_ATTENTE) {
            throw new UnauthorizedException("Impossible de modifier un défi qui n'est pas en attente");
        }

        // Vérifier que l'équipe adverse existe
        Equipe equipeAdverse = equipeRepository.findById(defiDto.getEquipeAdverseId())
                .orElseThrow(() -> new ResourceNotFoundException("Équipe adverse non trouvée avec l'ID: " + defiDto.getEquipeAdverseId()));

        // Vérifier que ce n'est pas la même équipe
        if (defi.getEquipeInitiatrice().getId().equals(defiDto.getEquipeAdverseId())) {
            throw new IllegalArgumentException("Une équipe ne peut pas se défier elle-même");
        }

        // Vérifier que l'heure de fin est après l'heure de début
        if (defiDto.getHeureDebut().isAfter(defiDto.getHeureFin()) || defiDto.getHeureDebut().equals(defiDto.getHeureFin())) {
            throw new IllegalArgumentException("L'heure de fin doit être postérieure à l'heure de début");
        }

        // Vérifier qu'il n'y a pas déjà un défi entre ces équipes à cette date (sauf celui-ci)
        List<StatutEnum> statutsActifs = List.of(StatutEnum.EN_ATTENTE, StatutEnum.ACCEPTE);
        if (!defi.getDateDefi().equals(defiDto.getDateDefi()) ||
                !defi.getEquipeAdverse().getId().equals(defiDto.getEquipeAdverseId())) {
            if (defiRepository.existsDefiForEquipesOnDate(
                    defi.getEquipeInitiatrice().getId(), defiDto.getEquipeAdverseId(), defiDto.getDateDefi(), statutsActifs)) {
                throw new IllegalArgumentException("Un défi existe déjà entre ces équipes à cette date");
            }
        }

        // Vérifier la disponibilité du terrain
        LocalDateTime debut = LocalDateTime.of(defiDto.getDateDefi(), defiDto.getHeureDebut());
        LocalDateTime fin = LocalDateTime.of(defiDto.getDateDefi(), defiDto.getHeureFin());

        if (!defi.getTerrain().equals(defiDto.getTerrain()) ||
                !defi.getDateDefi().equals(defiDto.getDateDefi()) ||
                !defi.getHeureDebut().equals(defiDto.getHeureDebut()) ||
                !defi.getHeureFin().equals(defiDto.getHeureFin())) {
            if (!matchService.isTerrainDisponible(defiDto.getTerrain(), debut, fin)) {
                throw new IllegalArgumentException("Le terrain n'est pas disponible à cette date/heure");
            }
        }

        defi.setEquipeAdverse(equipeAdverse);
        defi.setDateDefi(defiDto.getDateDefi());
        defi.setHeureDebut(defiDto.getHeureDebut());
        defi.setHeureFin(defiDto.getHeureFin());
        defi.setTerrain(defiDto.getTerrain());
        defi.setMessage(defiDto.getMessage());

        Defi updatedDefi = defiRepository.save(defi);
        return dtoMapper.toDefiResponseDto(updatedDefi);
    }

    @Override
    @Transactional
    public void deleteDefi(Long id) {
        Defi defi = findDefiById(id);

        // Vérifier que le défi est bien en attente
        if (defi.getStatut() != StatutEnum.EN_ATTENTE) {
            throw new UnauthorizedException("Impossible de supprimer un défi qui n'est pas en attente");
        }

        defiRepository.delete(defi);
    }

    @Override
    public List<DefiResponseDto> getDefisEnvoyesByEquipe(Long equipeId) {
        // Vérifier que l'équipe existe
        if (!equipeRepository.existsById(equipeId)) {
            throw new ResourceNotFoundException("Équipe non trouvée avec l'ID: " + equipeId);
        }

        return defiRepository.findByEquipeInitiatriceIdOrderByDateDefiDesc(equipeId).stream()
                .map(dtoMapper::toDefiResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DefiResponseDto> getDefisRecusByEquipe(Long equipeId) {
        // Vérifier que l'équipe existe
        if (!equipeRepository.existsById(equipeId)) {
            throw new ResourceNotFoundException("Équipe non trouvée avec l'ID: " + equipeId);
        }

        return defiRepository.findByEquipeAdverseIdOrderByDateDefiDesc(equipeId).stream()
                .map(dtoMapper::toDefiResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DefiResponseDto accepterDefi(Long defiId) {
        Defi defi = findDefiById(defiId);

        // Vérifier que le défi est bien en attente
        if (defi.getStatut() != StatutEnum.EN_ATTENTE) {
            throw new UnauthorizedException("Impossible d'accepter un défi qui n'est pas en attente");
        }

        // Créer un match à partir du défi
        MatchRequestDto matchDto = new MatchRequestDto();
        matchDto.setEquipeDomicileId(defi.getEquipeAdverse().getId()); // L'équipe qui reçoit le défi joue à domicile
        matchDto.setEquipeExterieurId(defi.getEquipeInitiatrice().getId());
        matchDto.setDateMatch(LocalDateTime.of(defi.getDateDefi(), defi.getHeureDebut()));
        matchDto.setTerrain(defi.getTerrain());
        matchDto.setIsTournoi(false);

        MatchResponseDto matchResponse = matchService.createMatch(matchDto);

        // Mettre à jour le statut du défi
        defi.setStatut(StatutEnum.ACCEPTE);
        defi.setMatchId(matchResponse.getId());

        Defi updatedDefi = defiRepository.save(defi);
        return dtoMapper.toDefiResponseDto(updatedDefi);
    }

    @Override
    @Transactional
    public DefiResponseDto refuserDefi(Long defiId) {
        Defi defi = findDefiById(defiId);

        // Vérifier que le défi est bien en attente
        if (defi.getStatut() != StatutEnum.EN_ATTENTE) {
            throw new UnauthorizedException("Impossible de refuser un défi qui n'est pas en attente");
        }

        defi.setStatut(StatutEnum.REFUSE);

        Defi updatedDefi = defiRepository.save(defi);
        return dtoMapper.toDefiResponseDto(updatedDefi);
    }

    @Override
    @Transactional
    public DefiResponseDto annulerDefi(Long defiId) {
        Defi defi = findDefiById(defiId);

        // Vérifier que le défi est bien en attente
        if (defi.getStatut() != StatutEnum.EN_ATTENTE) {
            throw new UnauthorizedException("Impossible d'annuler un défi qui n'est pas en attente");
        }

        defi.setStatut(StatutEnum.ANNULE);

        Defi updatedDefi = defiRepository.save(defi);
        return dtoMapper.toDefiResponseDto(updatedDefi);
    }

    @Override
    public List<DefiResponseDto> getDefisByStatut(StatutEnum statut) {
        return defiRepository.findByStatut(statut).stream()
                .map(dtoMapper::toDefiResponseDto)
                .collect(Collectors.toList());
    }

    // Méthode utilitaire pour trouver un défi par ID
    private Defi findDefiById(Long id) {
        return defiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Défi non trouvé avec l'ID: " + id));
    }
}