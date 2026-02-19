using System;

namespace TournoiAPI.DTOs
{
    public class ClassementDTO
    {
        public int ID_Classement { get; set; }
        public int Position { get; set; }
        public int Points { get; set; }
        public DateTime DateMaj { get; set; }
        public int ID_Tournoi { get; set; }
        public int ID_Equipe { get; set; }
        public string? NomEquipe { get; set; }
    }

    public class ClassementCreateDTO
    {
        public int Position { get; set; }
        public int Points { get; set; }
        public int ID_Tournoi { get; set; }
        public int ID_Equipe { get; set; }
    }

    public class ClassementUpdateDTO
    {
        public int Position { get; set; }
        public int Points { get; set; }
    }
}
