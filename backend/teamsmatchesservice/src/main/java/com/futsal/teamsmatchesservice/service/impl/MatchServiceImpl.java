// MatchServiceImpl.java
package com.futsal.teamsmatchesservice.service.impl;

import com.futsal.teamsmatchesservice.dto.request.MatchRequestDto;
import com.futsal.teamsmatchesservice.dto.request.ResultatMatchDto;
import com.futsal.teamsmatchesservice.dto.response.MatchResponseDto;
import com.futsal.teamsmatchesservice.exception.ResourceNotFoundException;
import com.futsal.teamsmatchesservice.exception.UnauthorizedException;
import com.futsal.teamsmatchesservice.model.Equipe;
import com.futsal.teamsmatchesservice.model.Match;
import com.futsal.teamsmatchesservice.model.StatutEnum;
import com.futsal.teamsmatchesservice.repository.EquipeRepository;
import com.futsal.teamsmatchesservice.repository.MatchRepository;
import com.futsal.teamsmatchesservice.service.EquipeService;
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
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final EquipeRepository equipeRepository;
    private final EquipeService equipeService;
    private final DtoMapper dtoMapper;

    @Override
    public List<MatchResponseDto> getAllMatchs() {
        return matchRepository.findAll().stream()
                .map(dtoMapper::toMatchResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public MatchResponseDto getMatchById(Long id) {
        Match match = findMatchById(id);
        return dtoMapper.toMatchResponseDto(match);
    }

    @Override
    @Transactional
    public MatchResponseDto createMatch(MatchRequestDto matchDto) {
        // Vérifier que les équipes existent
        Equipe equipeDomicile = equipeRepository.findById(matchDto.getEquipeDomicileId())
                .orElseThrow(() -> new ResourceNotFoundException("Équipe domicile non trouvée avec l'ID: " + matchDto.getEquipeDomicileId()));

        Equipe equipeExterieur = equipeRepository.findById(matchDto.getEquipeExterieurId())
                .orElseThrow(() -> new ResourceNotFoundException("Équipe extérieur non trouvée avec l'ID: " + matchDto.getEquipeExterieurId()));

        // Vérifier que ce n'est pas la même équipe
        if (matchDto.getEquipeDomicileId().equals(matchDto.getEquipeExterieurId())) {
            throw new IllegalArgumentException("Les équipes domicile et extérieur ne peuvent pas être identiques");
        }

        // Vérifier la disponibilité du terrain
        LocalDateTime debut = matchDto.getDateMatch();
        // Durée standard d'un match : 1h30
        LocalDateTime fin = debut.plusMinutes(90);

        if (!isTerrainDisponible(matchDto.getTerrain(), debut, fin)) {
            throw new IllegalArgumentException("Le terrain n'est pas disponible à cette date/heure");
        }

        Match match = new Match();
        match.setEquipeDomicile(equipeDomicile);
        match.setEquipeExterieur(equipeExterieur);
        match.setDateMatch(matchDto.getDateMatch());
        match.setTerrain(matchDto.getTerrain());
        match.setStatut(StatutEnum.PLANIFIE);
        match.setIsTournoi(matchDto.getIsTournoi());
        match.setTournoiId(matchDto.getTournoiId());

        Match savedMatch = matchRepository.save(match);
        return dtoMapper.toMatchResponseDto(savedMatch);
    }

    @Override
    @Transactional
    public MatchResponseDto updateMatch(Long id, MatchRequestDto matchDto) {
        Match match = findMatchById(id);

        // Vérifier que le match n'est pas déjà joué
        if (match.getStatut() == StatutEnum.JOUE) {
            throw new UnauthorizedException("Impossible de modifier un match déjà joué");
        }

        // Vérifier que les équipes existent
        Equipe equipeDomicile = equipeRepository.findById(matchDto.getEquipeDomicileId())
                .orElseThrow(() -> new ResourceNotFoundException("Équipe domicile non trouvée avec l'ID: " + matchDto.getEquipeDomicileId()));

        Equipe equipeExterieur = equipeRepository.findById(matchDto.getEquipeExterieurId())
                .orElseThrow(() -> new ResourceNotFoundException("Équipe extérieur non trouvée avec l'ID: " + matchDto.getEquipeExterieurId()));

        // Vérifier que ce n'est pas la même équipe
        if (matchDto.getEquipeDomicileId().equals(matchDto.getEquipeExterieurId())) {
            throw new IllegalArgumentException("Les équipes domicile et extérieur ne peuvent pas être identiques");
        }

        // Vérifier la disponibilité du terrain (sauf pour le même match)
        LocalDateTime debut = matchDto.getDateMatch();
        // Durée standard d'un match : 1h30
        LocalDateTime fin = debut.plusMinutes(90);

        if (!match.getTerrain().equals(matchDto.getTerrain()) || !match.getDateMatch().equals(matchDto.getDateMatch())) {
            if (!isTerrainDisponible(matchDto.getTerrain(), debut, fin)) {
                throw new IllegalArgumentException("Le terrain n'est pas disponible à cette date/heure");
            }
        }

        match.setEquipeDomicile(equipeDomicile);
        match.setEquipeExterieur(equipeExterieur);
        match.setDateMatch(matchDto.getDateMatch());
        match.setTerrain(matchDto.getTerrain());
        match.setIsTournoi(matchDto.getIsTournoi());
        match.setTournoiId(matchDto.getTournoiId());

        Match updatedMatch = matchRepository.save(match);
        return dtoMapper.toMatchResponseDto(updatedMatch);
    }

    @Override
    @Transactional
    public void deleteMatch(Long id) {
        Match match = findMatchById(id);

        // Vérifier que le match n'est pas déjà joué
        if (match.getStatut() == StatutEnum.JOUE) {
            throw new UnauthorizedException("Impossible de supprimer un match déjà joué");
        }

        matchRepository.delete(match);
    }

    @Override
    public List<MatchResponseDto> getMatchsEquipe(Long equipeId) {
        // Vérifier que l'équipe existe
        if (!equipeRepository.existsById(equipeId)) {
            throw new ResourceNotFoundException("Équipe non trouvée avec l'ID: " + equipeId);
        }

        LocalDateTime now = LocalDateTime.now();

        // Récupérer les matchs à venir de l'équipe
        List<Match> matchsAVenir = matchRepository.findUpcomingMatchesByEquipe(equipeId, now, StatutEnum.PLANIFIE);

        // Récupérer les matchs passés de l'équipe
        List<Match> matchsPasses = matchRepository.findPastMatchesByEquipe(equipeId, now);

        // Combiner les deux listes
        List<Match> tousMatchs = matchsAVenir;
        tousMatchs.addAll(matchsPasses);

        return tousMatchs.stream()
                .map(dtoMapper::toMatchResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MatchResponseDto> getMatchsEnAttente() {
        return matchRepository.findByStatut(StatutEnum.PLANIFIE).stream()
                .map(dtoMapper::toMatchResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MatchResponseDto saisirResultat(Long id, ResultatMatchDto resultatDto) {
        Match match = findMatchById(id);

        // Vérifier que le match est bien en attente de résultat
        if (match.getStatut() != StatutEnum.PLANIFIE) {
            throw new UnauthorizedException("Le match n'est pas en attente de résultat");
        }

        // Enregistrer le score
        match.setScoreDomicile(resultatDto.getScoreDomicile());
        match.setScoreExterieur(resultatDto.getScoreExterieur());
        match.setStatut(StatutEnum.JOUE);

        Match updatedMatch = matchRepository.save(match);

        // Mettre à jour les statistiques des équipes
        updateEquipeStats(match);

        return dtoMapper.toMatchResponseDto(updatedMatch);
    }

    @Override
    public List<MatchResponseDto> getMatchsPeriode(LocalDateTime debut, LocalDateTime fin) {
        return matchRepository.findByDateMatchBetweenAndStatut(debut, fin, StatutEnum.PLANIFIE).stream()
                .map(dtoMapper::toMatchResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isTerrainDisponible(String terrain, LocalDateTime dateDebut, LocalDateTime dateFin) {
        return !matchRepository.isTerrainOccupied(terrain, dateDebut, dateFin, StatutEnum.PLANIFIE);
    }

    // Méthode utilitaire pour mettre à jour les stats des équipes après un match
    private void updateEquipeStats(Match match) {
        // Équipe domicile
        String resultatDomicile;
        if (match.getScoreDomicile() > match.getScoreExterieur()) {
            resultatDomicile = "victoire";
        } else if (match.getScoreDomicile() < match.getScoreExterieur()) {
            resultatDomicile = "defaite";
        } else {
            resultatDomicile = "egalite";
        }

        equipeService.updateEquipeStats(
                match.getEquipeDomicile().getId(),
                match.getScoreDomicile(),
                match.getScoreExterieur(),
                resultatDomicile
        );

        // Équipe extérieur
        String resultatExterieur;
        if (match.getScoreDomicile() < match.getScoreExterieur()) {
            resultatExterieur = "victoire";
        } else if (match.getScoreDomicile() > match.getScoreExterieur()) {
            resultatExterieur = "defaite";
        } else {
            resultatExterieur = "egalite";
        }

        equipeService.updateEquipeStats(
                match.getEquipeExterieur().getId(),
                match.getScoreExterieur(),
                match.getScoreDomicile(),
                resultatExterieur
        );
    }

    // Méthode utilitaire pour trouver un match par ID
    private Match findMatchById(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match non trouvé avec l'ID: " + id));
    }
}