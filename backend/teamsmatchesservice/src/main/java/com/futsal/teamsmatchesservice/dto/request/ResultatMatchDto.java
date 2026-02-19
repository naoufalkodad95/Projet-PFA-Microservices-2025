package com.futsal.teamsmatchesservice.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultatMatchDto {

    @NotNull(message = "Le score de l'équipe à domicile est obligatoire")
    @Min(value = 0, message = "Le score ne peut pas être négatif")
    private Integer scoreDomicile;

    @NotNull(message = "Le score de l'équipe à l'extérieur est obligatoire")
    @Min(value = 0, message = "Le score ne peut pas être négatif")
    private Integer scoreExterieur;
}

