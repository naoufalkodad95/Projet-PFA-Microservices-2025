package com.example.reservationservice.client;

import com.example.reservationservice.DTO.UtilisateurDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class JoueurClient {
    private final RestTemplate restTemplate;

    public JoueurClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public UtilisateurDto getUtilisateurParId(int ID_Utilisateur) {
        String url = "http://localhost:5021/api/Utilisateurs/" + ID_Utilisateur;
        try {
            ResponseEntity<UtilisateurDto> response = restTemplate.getForEntity(url, UtilisateurDto.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            // Gestion des erreurs HTTP, par exemple, utilisateur non trouvé
            System.out.println("Erreur lors de la récupération de l'utilisateur: " + e.getMessage());
            return null;
        } catch (Exception e) {
            // Gestion d'autres types d'erreurs
            System.out.println("Erreur générale: " + e.getMessage());
            return null;
        }
    }

    public boolean estUnJoueur(int id) {
        UtilisateurDto utilisateur = getUtilisateurParId(id);
        if (utilisateur == null) {
            return false; // Si l'utilisateur n'est pas trouvé, il n'est pas un joueur
        }
        return "Joueur".equals(utilisateur.getTypeUtilisateur());
    }
}
