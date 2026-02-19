// DTOs/EquipeDTO.cs
using System;

namespace TournoiAPI.DTOs
{
    public class EquipeDTO
    {
        public int ID_Equipe { get; set; }
        public string Nom { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
        public string? LogoBase64 { get; set; }
        public int? NombreJoueurs { get; set; }
        public string? Capitaine { get; set; }
    }

    public class EquipeCreateDTO
    {
        public string Nom { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
        public string? LogoBase64 { get; set; }
        public int? NombreJoueurs { get; set; }
        public string? Capitaine { get; set; }
    }

    public class EquipeUpdateDTO
    {
        public string Nom { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
        public string? LogoBase64 { get; set; }
        public int? NombreJoueurs { get; set; }
        public string? Capitaine { get; set; }
    }
}