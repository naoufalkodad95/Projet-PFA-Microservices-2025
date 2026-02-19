// MatchRequestDto.java
package com.futsal.teamsmatchesservice.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchRequestDto {

    @NotNull(message = "L'ID de l'équipe à domicile est obligatoire")
    private Long equipeDomicileId;

    @NotNull(message = "L'ID de l'équipe à l'extérieur est obligatoire")
    private Long equipeExterieurId;

    @NotNull(message = "La date et l'heure du match sont obligatoires")
    @FutureOrPresent(message = "La date du match doit être dans le présent ou le futur")
    private LocalDateTime dateMatch;

    @NotNull(message = "Le terrain est obligatoire")
    private String terrain;

    private Boolean isTournoi = false;

    private Long tournoiId;
}


