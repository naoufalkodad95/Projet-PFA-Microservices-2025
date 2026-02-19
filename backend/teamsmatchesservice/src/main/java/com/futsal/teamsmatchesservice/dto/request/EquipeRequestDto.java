// EquipeRequestDto.java
package com.futsal.teamsmatchesservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipeRequestDto {

    @NotBlank(message = "Le nom de l'équipe est obligatoire")
    private String nom;

    private byte[] logo;
}

