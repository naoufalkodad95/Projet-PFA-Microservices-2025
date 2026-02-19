//package com.futsal.teamsmatchesservice.model;
//
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotBlank;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Entity
//@Table(name = "equipes")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Equipe {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @NotBlank(message = "Le nom de l'équipe est obligatoire")
//    @Column(nullable = false, length = 255)
//    private String nom;
//
//    @Column(name = "nbr_but_plus")
//    private Integer nbrButPlus = 0;
//
//    @Column(name = "nbr_but_moins")
//    private Integer nbrButMoins = 0;
//
//    @Column
//    private Integer victoires = 0;
//
//    @Column
//    private Integer defaites = 0;
//
//    @Column
//    private Integer egalites = 0;
//
//    @Column
//    private Integer points = 0;
//
//    @Lob
//    @Column(columnDefinition = "LONGBLOB")
//    private byte[] logo;
//
//    @OneToMany(mappedBy = "equipe", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Joueur> joueurs = new ArrayList<>();
//
//    // Méthode utilitaire pour ajouter un joueur à l'équipe
//    public void addJoueur(Joueur joueur) {
//        joueurs.add(joueur);
//        joueur.setEquipe(this);
//    }
//
//    // Méthode utilitaire pour retirer un joueur de l'équipe
//    public void removeJoueur(Joueur joueur) {
//        joueurs.remove(joueur);
//        joueur.setEquipe(null);
//    }
//}


package com.futsal.teamsmatchesservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "equipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de l'équipe est obligatoire")
    @Column(nullable = false, length = 255)
    private String nom;

    @Column(name = "nbr_but_plus")
    private Integer nbrButPlus = 0;

    @Column(name = "nbr_but_moins")
    private Integer nbrButMoins = 0;

    @Column
    private Integer victoires = 0;

    @Column
    private Integer defaites = 0;

    @Column
    private Integer egalites = 0;

    @Column
    private Integer points = 0;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] logo;

    // Référence à l'ID du capitaine dans le microservice Utilisateurs
    @Column(name = "capitaine_id")
    private Long capitaineId;

    // Collection des IDs des joueurs faisant partie de l'équipe
    @ElementCollection
    @CollectionTable(name = "equipe_joueurs", joinColumns = @JoinColumn(name = "equipe_id"))
    @Column(name = "joueur_id")
    private Set<Long> joueursIds = new HashSet<>();

    // Méthodes utilitaires pour gérer les joueurs
    public void addJoueurId(Long joueurId) {
        this.joueursIds.add(joueurId);
    }

    public void removeJoueurId(Long joueurId) {
        this.joueursIds.remove(joueurId);
    }
}