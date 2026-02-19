//package com.futsal.teamsmatchesservice.util;
//
//import com.futsal.teamsmatchesservice.dto.response.DefiResponseDto;
//import com.futsal.teamsmatchesservice.dto.response.EquipeResponseDto;
//import com.futsal.teamsmatchesservice.dto.response.JoueurResponseDto;
//import com.futsal.teamsmatchesservice.dto.response.MatchResponseDto;
//import com.futsal.teamsmatchesservice.model.Defi;
//import com.futsal.teamsmatchesservice.model.Equipe;
//import com.futsal.teamsmatchesservice.model.Joueur;
//import com.futsal.teamsmatchesservice.model.Match;
//import org.springframework.stereotype.Component;
//
//import java.util.stream.Collectors;
//
///**
// * Composant utilitaire pour convertir les entités en DTO et vice-versa
// */
//@Component
//public class DtoMapper {
//
//    /**
//     * Convertit une entité Equipe en DTO EquipeResponseDto
//     */
//    public EquipeResponseDto toEquipeResponseDto(Equipe equipe) {
//        EquipeResponseDto dto = new EquipeResponseDto();
//        dto.setId(equipe.getId());
//        dto.setNom(equipe.getNom());
//        dto.setNbrButPlus(equipe.getNbrButPlus());
//        dto.setNbrButMoins(equipe.getNbrButMoins());
//        dto.setVictoires(equipe.getVictoires());
//        dto.setDefaites(equipe.getDefaites());
//        dto.setEgalites(equipe.getEgalites());
//        dto.setPoints(equipe.getPoints());
//        dto.setLogo(equipe.getLogo());
//
//        // Convertir les joueurs de l'équipe si nécessaire
//        if (equipe.getJoueurs() != null && !equipe.getJoueurs().isEmpty()) {
//            dto.setJoueurs(equipe.getJoueurs().stream()
//                    .map(this::toJoueurResponseDto)
//                    .collect(Collectors.toList()));
//        }
//
//        return dto;
//    }
//
//    /**
//     * Convertit une entité Joueur en DTO JoueurResponseDto
//     */
//    public JoueurResponseDto toJoueurResponseDto(Joueur joueur) {
//        JoueurResponseDto dto = new JoueurResponseDto();
//        dto.setId(joueur.getId());
//        dto.setNom(joueur.getNom());
//        dto.setPrenom(joueur.getPrenom());
//        dto.setDateNaissance(joueur.getDateNaissance());
//        dto.setEmail(joueur.getEmail());
//        dto.setTelephone(joueur.getTelephone());
//        dto.setEstCapitaine(joueur.isEstCapitaine());
//        dto.setNbrButs(joueur.getNbrButs());
//        dto.setPosition(joueur.getPosition());
//        dto.setNiveau(joueur.getNiveau());
//        dto.setDemandeEquipeId(joueur.getDemandeEquipeId());
//        dto.setStatutDemande(joueur.getStatutDemande());
//
//        // Ajouter les informations de l'équipe si elle existe
//        if (joueur.getEquipe() != null) {
//            dto.setEquipeId(joueur.getEquipe().getId());
//            dto.setEquipeNom(joueur.getEquipe().getNom());
//        }
//
//        return dto;
//    }
//
//    /**
//     * Convertit une entité Match en DTO MatchResponseDto
//     */
//    public MatchResponseDto toMatchResponseDto(Match match) {
//        MatchResponseDto dto = new MatchResponseDto();
//        dto.setId(match.getId());
//        dto.setDateMatch(match.getDateMatch());
//        dto.setTerrain(match.getTerrain());
//        dto.setScoreDomicile(match.getScoreDomicile());
//        dto.setScoreExterieur(match.getScoreExterieur());
//        dto.setStatut(match.getStatut());
//        dto.setIsTournoi(match.getIsTournoi());
//        dto.setTournoiId(match.getTournoiId());
//        dto.setDefiId(match.getDefiId());
//
//        // Ajouter les informations des équipes
//        if (match.getEquipeDomicile() != null) {
//            dto.setEquipeDomicileId(match.getEquipeDomicile().getId());
//            dto.setEquipeDomicileNom(match.getEquipeDomicile().getNom());
//        }
//
//        if (match.getEquipeExterieur() != null) {
//            dto.setEquipeExterieurId(match.getEquipeExterieur().getId());
//            dto.setEquipeExterieurNom(match.getEquipeExterieur().getNom());
//        }
//
//        return dto;
//    }
//
//    /**
//     * Convertit une entité Defi en DTO DefiResponseDto
//     */
//    public DefiResponseDto toDefiResponseDto(Defi defi) {
//        DefiResponseDto dto = new DefiResponseDto();
//        dto.setId(defi.getId());
//        dto.setDateDefi(defi.getDateDefi());
//        dto.setHeureDebut(defi.getHeureDebut());
//        dto.setHeureFin(defi.getHeureFin());
//        dto.setTerrain(defi.getTerrain());
//        dto.setMessage(defi.getMessage());
//        dto.setStatut(defi.getStatut());
//        dto.setMatchId(defi.getMatchId());
//
//        // Ajouter les informations des équipes
//        if (defi.getEquipeInitiatrice() != null) {
//            dto.setEquipeInitiatriceId(defi.getEquipeInitiatrice().getId());
//            dto.setEquipeInitiatriceNom(defi.getEquipeInitiatrice().getNom());
//        }
//
//        if (defi.getEquipeAdverse() != null) {
//            dto.setEquipeAdverseId(defi.getEquipeAdverse().getId());
//            dto.setEquipeAdverseNom(defi.getEquipeAdverse().getNom());
//        }
//
//        return dto;
//    }
//}




package com.futsal.teamsmatchesservice.util;

import com.futsal.teamsmatchesservice.dto.response.DefiResponseDto;
import com.futsal.teamsmatchesservice.dto.response.EquipeResponseDto;
import com.futsal.teamsmatchesservice.dto.response.MatchResponseDto;
import com.futsal.teamsmatchesservice.model.Defi;
import com.futsal.teamsmatchesservice.model.Equipe;
import com.futsal.teamsmatchesservice.model.Match;
import org.springframework.stereotype.Component;

/**
 * Composant utilitaire pour convertir les entités en DTO et vice-versa
 */
@Component
public class DtoMapper {

    /**
     * Convertit une entité Equipe en DTO EquipeResponseDto
     * Note: Cette méthode ne remplit pas les informations des joueurs, cela doit être fait par le service
     */
    public EquipeResponseDto toEquipeResponseDto(Equipe equipe) {
        EquipeResponseDto dto = new EquipeResponseDto();
        dto.setId(equipe.getId());
        dto.setNom(equipe.getNom());
        dto.setNbrButPlus(equipe.getNbrButPlus());
        dto.setNbrButMoins(equipe.getNbrButMoins());
        dto.setVictoires(equipe.getVictoires());
        dto.setDefaites(equipe.getDefaites());
        dto.setEgalites(equipe.getEgalites());
        dto.setPoints(equipe.getPoints());
        dto.setLogo(equipe.getLogo());
        dto.setCapitaineId(equipe.getCapitaineId());
        dto.setJoueursIds(equipe.getJoueursIds());

        return dto;
    }

    /**
     * Convertit une entité Match en DTO MatchResponseDto
     */
    public MatchResponseDto toMatchResponseDto(Match match) {
        MatchResponseDto dto = new MatchResponseDto();
        dto.setId(match.getId());
        dto.setDateMatch(match.getDateMatch());
        dto.setTerrain(match.getTerrain());
        dto.setScoreDomicile(match.getScoreDomicile());
        dto.setScoreExterieur(match.getScoreExterieur());
        dto.setStatut(match.getStatut());
        dto.setIsTournoi(match.getIsTournoi());
        dto.setTournoiId(match.getTournoiId());
        dto.setDefiId(match.getDefiId());

        // Ajouter les informations des équipes
        if (match.getEquipeDomicile() != null) {
            dto.setEquipeDomicileId(match.getEquipeDomicile().getId());
            dto.setEquipeDomicileNom(match.getEquipeDomicile().getNom());
        }

        if (match.getEquipeExterieur() != null) {
            dto.setEquipeExterieurId(match.getEquipeExterieur().getId());
            dto.setEquipeExterieurNom(match.getEquipeExterieur().getNom());
        }

        return dto;
    }

    /**
     * Convertit une entité Defi en DTO DefiResponseDto
     */
    public DefiResponseDto toDefiResponseDto(Defi defi) {
        DefiResponseDto dto = new DefiResponseDto();
        dto.setId(defi.getId());
        dto.setDateDefi(defi.getDateDefi());
        dto.setHeureDebut(defi.getHeureDebut());
        dto.setHeureFin(defi.getHeureFin());
        dto.setTerrain(defi.getTerrain());
        dto.setMessage(defi.getMessage());
        dto.setStatut(defi.getStatut());
        dto.setMatchId(defi.getMatchId());

        // Ajouter les informations des équipes
        if (defi.getEquipeInitiatrice() != null) {
            dto.setEquipeInitiatriceId(defi.getEquipeInitiatrice().getId());
            dto.setEquipeInitiatriceNom(defi.getEquipeInitiatrice().getNom());
        }

        if (defi.getEquipeAdverse() != null) {
            dto.setEquipeAdverseId(defi.getEquipeAdverse().getId());
            dto.setEquipeAdverseNom(defi.getEquipeAdverse().getNom());
        }

        return dto;
    }
}