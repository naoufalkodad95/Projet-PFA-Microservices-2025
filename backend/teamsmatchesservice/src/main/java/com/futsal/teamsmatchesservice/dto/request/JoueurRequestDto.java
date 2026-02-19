//// JoueurRequestDto.java
//package com.futsal.teamsmatchesservice.dto.request;
//
//import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.Past;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class JoueurRequestDto {
//
//    @NotBlank(message = "Le nom est obligatoire")
//    private String nom;
//
//    @NotBlank(message = "Le prénom est obligatoire")
//    private String prenom;
//
//    @Past(message = "La date de naissance doit être dans le passé")
//    private LocalDate dateNaissance;
//
//    @NotBlank(message = "L'email est obligatoire")
//    @Email(message = "Format d'email invalide")
//    private String email;
//
//    private String telephone;
//
//    private boolean estCapitaine;
//
//    private String position;
//
//    private Integer niveau;
//}
//
