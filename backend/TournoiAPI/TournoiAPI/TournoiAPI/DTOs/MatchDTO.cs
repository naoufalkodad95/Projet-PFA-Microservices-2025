using System;

namespace TournoiAPI.DTOs
{
    public class MatchDTO
    {
        public int ID_Match { get; set; }
        public DateTime Date { get; set; }
        public int? ScoreEquipe1 { get; set; }
        public int? ScoreEquipe2 { get; set; }
        public string? Statut { get; set; }
        public int ID_Tournoi { get; set; }
        public int ID_Equipe1 { get; set; }
        public int ID_Equipe2 { get; set; }
        public string? NomEquipe1 { get; set; }
        public string? NomEquipe2 { get; set; }
    }

    public class MatchCreateDTO
    {
        public DateTime Date { get; set; }
        public int? ScoreEquipe1 { get; set; }
        public int? ScoreEquipe2 { get; set; }
        public string? Statut { get; set; }
        public int ID_Tournoi { get; set; }
        public int ID_Equipe1 { get; set; }
        public int ID_Equipe2 { get; set; }
    }

    public class MatchUpdateDTO
    {
        public DateTime Date { get; set; }
        public int? ScoreEquipe1 { get; set; }
        public int? ScoreEquipe2 { get; set; }
        public string? Statut { get; set; }
    }
}
