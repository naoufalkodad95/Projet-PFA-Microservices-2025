// DefiResponseDto.java
package com.futsal.teamsmatchesservice.dto.response;

import com.futsal.teamsmatchesservice.model.StatutEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DefiResponseDto {

    private Long id;
    private Long equipeInitiatriceId;
    private String equipeInitiatriceNom;
    private Long equipeAdverseId;
    private String equipeAdverseNom;
    private LocalDate dateDefi;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String terrain;
    private String message;
    private StatutEnum statut;
    private Long matchId;
}