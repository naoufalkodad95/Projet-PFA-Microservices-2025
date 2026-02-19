package com.futsal.teamsmatchesservice.service;

import com.futsal.teamsmatchesservice.dto.external.JoueurDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service client pour communiquer avec le microservice de gestion des utilisateurs
 */
@Service
public class JoueurClientService {

    private final RestTemplate restTemplate;
    private final String userServiceUrl;

    public JoueurClientService(
            RestTemplate restTemplate,
            @Value("${user-service.url:http://localhost:8081/api/v1}") String userServiceUrl) {
        this.restTemplate = restTemplate;
        this.userServiceUrl = userServiceUrl;
    }

    /**
     * Récupère les détails d'un joueur par son ID
     */
    public JoueurDto getJoueurById(Long id) {
        try {
            return restTemplate.getForObject(userServiceUrl + "/joueurs/" + id, JoueurDto.class);
        } catch (Exception e) {
            // Logger l'erreur
            return null;
        }
    }

    /**
     * Récupère les détails de plusieurs joueurs par leurs IDs
     */
    public List<JoueurDto> getJoueursByIds(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }

        try {
            String idsParam = ids.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));

            return restTemplate.exchange(
                    userServiceUrl + "/joueurs/batch?ids=" + idsParam,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<JoueurDto>>() {}
            ).getBody();
        } catch (Exception e) {
            // Logger l'erreur
            return Collections.emptyList();
        }
    }

    /**
     * Récupère les détails du capitaine d'une équipe
     */
    public JoueurDto getCapitaine(Long capitaineId) {
        return getJoueurById(capitaineId);
    }

    /**
     * Récupère les demandes de joueurs pour rejoindre une équipe
     */
    public List<JoueurDto> getDemandesJoueurs(Long equipeId) {
        try {
            return restTemplate.exchange(
                    userServiceUrl + "/joueurs/demandes?equipeId=" + equipeId,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<JoueurDto>>() {}
            ).getBody();
        } catch (Exception e) {
            // Logger l'erreur
            return Collections.emptyList();
        }
    }
}