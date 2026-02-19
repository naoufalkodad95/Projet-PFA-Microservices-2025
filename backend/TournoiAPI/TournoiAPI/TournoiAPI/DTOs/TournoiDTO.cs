using System;
using System.Collections.Generic;

namespace TournoiAPI.DTOs
{
    // DTO pour renvoyer les données d'un tournoi (GET)
    public class TournoiDTO
    {
        public int ID_Tournoi { get; set; }
        public string Nom { get; set; }
        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }
        public int NbEquipesMax { get; set; }
        public string Statut { get; set; }
        public string Reglement { get; set; }
        public decimal? Prix { get; set; }
    }

    // DTO pour créer un nouveau tournoi (POST)
    public class TournoiCreateDTO
    {
        public string Nom { get; set; }
        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }
        public int NbEquipesMax { get; set; }
        public string Statut { get; set; }
        public string Reglement { get; set; }
        public decimal? Prix { get; set; }
    }

    // DTO pour mettre à jour un tournoi existant (PUT)
    public class TournoiUpdateDTO
    {
        public string Nom { get; set; }
        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }
        public int NbEquipesMax { get; set; }
        public string Statut { get; set; }
        public string Reglement { get; set; }
        public decimal? Prix { get; set; }
    }

    // DTO pour les détails complets d'un tournoi avec ses relations
    public class TournoiDetailDTO
    {
        public int ID_Tournoi { get; set; }
        public string Nom { get; set; }
        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }
        public int NbEquipesMax { get; set; }
        public string Statut { get; set; }
        public string Reglement { get; set; }
        public List<EquipeDTO> Equipes { get; set; }
        public List<MatchDTO> Matches { get; set; }
        public List<ClassementDTO> Classements { get; set; }
        public decimal? Prix { get; set; }
    }
}