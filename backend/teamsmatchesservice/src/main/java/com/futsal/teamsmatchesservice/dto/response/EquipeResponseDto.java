//// EquipeResponseDto.java
//package com.futsal.teamsmatchesservice.dto.response;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class EquipeResponseDto {
//
//    private Long id;
//    private String nom;
//    private Integer nbrButPlus;
//    private Integer nbrButMoins;
//    private Integer victoires;
//    private Integer defaites;
//    private Integer egalites;
//    private Integer points;
//    private byte[] logo;
//    private List<JoueurResponseDto> joueurs = new ArrayList<>();
//}

package com.futsal.teamsmatchesservice.dto.response;

import com.futsal.teamsmatchesservice.dto.external.JoueurDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipeResponseDto {

    private Long id;
    private String nom;
    private Integer nbrButPlus;
    private Integer nbrButMoins;
    private Integer victoires;
    private Integer defaites;
    private Integer egalites;
    private Integer points;
    private byte[] logo;

    // ID du capitaine
    private Long capitaineId;

    // Détails du capitaine (si disponible)
    private JoueurDto capitaine;

    // Liste des IDs des joueurs
    private Set<Long> joueursIds;

    // Liste des détails des joueurs (si disponibles)
    private List<JoueurDto> joueurs = new ArrayList<>();
}