package com.example.reservationservice.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Terrain {
    @Id @GeneratedValue
    private Long id;
    private String nom;
    private int capacite;
    private boolean etat;


        // Getters et Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getNom() {
            return nom;
        }

        public void setNom(String nom) {
            this.nom = nom;
        }

        public int getCapacite() {
            return capacite;
        }

        public void setCapacite(int capacite) {
            this.capacite = capacite;
        }

        public boolean getEtat() {
            return etat;
        }


    public void setEtat(boolean etat) {
        this.etat = etat;
    }

}

