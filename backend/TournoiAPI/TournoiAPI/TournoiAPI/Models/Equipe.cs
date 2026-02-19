// Models/Equipe.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TournoiAPI.Models
{
    public class Equipe
    {
        [Key]
        public int ID_Equipe { get; set; }

        [Required]
        [StringLength(100)]
        public string Nom { get; set; } = string.Empty;

        public DateTime DateCreation { get; set; }

        public byte[]? Logo { get; set; }

        // Nouveaux champs
        public int? NombreJoueurs { get; set; }

        [StringLength(100)]
        public string? Capitaine { get; set; }

        // Relations
        public virtual ICollection<EquipeTournoi> EquipesTournois { get; set; } = new List<EquipeTournoi>();
        public virtual ICollection<Match> MatchesEquipe1 { get; set; } = new List<Match>();
        public virtual ICollection<Match> MatchesEquipe2 { get; set; } = new List<Match>();
    }
}