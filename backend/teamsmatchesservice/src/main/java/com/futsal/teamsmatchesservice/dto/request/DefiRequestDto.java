// DefiRequestDto.java
package com.futsal.teamsmatchesservice.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DefiRequestDto {

    @NotNull(message = "L'ID de l'équipe adverse est obligatoire")
    private Long equipeAdverseId;

    @NotNull(message = "La date du défi est obligatoire")
    @FutureOrPresent(message = "La date du défi doit être dans le présent ou le futur")
    private LocalDate dateDefi;

    @NotNull(message = "L'heure de début est obligatoire")
    private LocalTime heureDebut;

    @NotNull(message = "L'heure de fin est obligatoire")
    private LocalTime heureFin;

    @NotNull(message = "Le terrain est obligatoire")
    private String terrain;

    @Size(max = 500, message = "Le message ne peut pas dépasser 500 caractères")
    private String message;
}

