using System;

namespace TournoiAPI.DTOs
{
    public class EquipeTournoiDTO
    {
        public int ID_EquipeTournoi { get; set; }
        public DateTime DateInscription { get; set; }
        public string? Statut { get; set; }
        public int ID_Equipe { get; set; }
        public int ID_Tournoi { get; set; }
        public string? NomEquipe { get; set; }
        public string? NomTournoi { get; set; }
    }

    public class EquipeTournoiCreateDTO
    {
        public int ID_Equipe { get; set; }
        public int ID_Tournoi { get; set; }
        public string? Statut { get; set; }
    }
}
