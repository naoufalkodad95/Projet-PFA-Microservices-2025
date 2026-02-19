// DefiService.java
package com.futsal.teamsmatchesservice.service;

import com.futsal.teamsmatchesservice.dto.request.DefiRequestDto;
import com.futsal.teamsmatchesservice.dto.response.DefiResponseDto;
import com.futsal.teamsmatchesservice.model.StatutEnum;

import java.util.List;

public interface DefiService {

    // Opérations CRUD
    List<DefiResponseDto> getAllDefis();

    DefiResponseDto getDefiById(Long id);

    DefiResponseDto createDefi(Long equipeInitiatriceId, DefiRequestDto defiDto);

    DefiResponseDto updateDefi(Long id, DefiRequestDto defiDto);

    void deleteDefi(Long id);

    // Opérations métier
    List<DefiResponseDto> getDefisEnvoyesByEquipe(Long equipeId);

    List<DefiResponseDto> getDefisRecusByEquipe(Long equipeId);

    DefiResponseDto accepterDefi(Long defiId);

    DefiResponseDto refuserDefi(Long defiId);

    DefiResponseDto annulerDefi(Long defiId);

    List<DefiResponseDto> getDefisByStatut(StatutEnum statut);
}
