// MatchResponseDto.java
package com.futsal.teamsmatchesservice.dto.response;

import com.futsal.teamsmatchesservice.model.StatutEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchResponseDto {

    private Long id;
    private Long equipeDomicileId;
    private String equipeDomicileNom;
    private Long equipeExterieurId;
    private String equipeExterieurNom;
    private LocalDateTime dateMatch;
    private String terrain;
    private Integer scoreDomicile;
    private Integer scoreExterieur;
    private StatutEnum statut;
    private Boolean isTournoi;
    private Long tournoiId;
    private Long defiId;
}