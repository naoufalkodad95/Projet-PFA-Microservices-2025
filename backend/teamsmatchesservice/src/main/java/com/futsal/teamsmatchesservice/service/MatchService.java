// MatchService.java
package com.futsal.teamsmatchesservice.service;

import com.futsal.teamsmatchesservice.dto.request.MatchRequestDto;
import com.futsal.teamsmatchesservice.dto.request.ResultatMatchDto;
import com.futsal.teamsmatchesservice.dto.response.MatchResponseDto;

import java.time.LocalDateTime;
import java.util.List;

public interface MatchService {

    // Opérations CRUD
    List<MatchResponseDto> getAllMatchs();

    MatchResponseDto getMatchById(Long id);

    MatchResponseDto createMatch(MatchRequestDto matchDto);

    MatchResponseDto updateMatch(Long id, MatchRequestDto matchDto);

    void deleteMatch(Long id);

    // Opérations métier
    List<MatchResponseDto> getMatchsEquipe(Long equipeId);

    List<MatchResponseDto> getMatchsEnAttente();

    MatchResponseDto saisirResultat(Long id, ResultatMatchDto resultatDto);

    List<MatchResponseDto> getMatchsPeriode(LocalDateTime debut, LocalDateTime fin);

    boolean isTerrainDisponible(String terrain, LocalDateTime dateDebut, LocalDateTime dateFin);
}