using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TournoiAPI.Models
{
    public class Tournoi
    {
        [Key]
        public int ID_Tournoi { get; set; }

        [Required]
        [StringLength(100)]
        public string Nom { get; set; } = string.Empty;

        [Required]
        public DateTime DateDebut { get; set; }

        [Required]
        public DateTime DateFin { get; set; }

        public int NbEquipesMax { get; set; }

        [StringLength(50)]
        public string? Statut { get; set; }

        public string? Reglement { get; set; }

        [DataType(DataType.Currency)]
        public decimal? Prix { get; set; }
        // Relations
        public virtual ICollection<EquipeTournoi> EquipesTournois { get; set; } = new List<EquipeTournoi>();
        public virtual ICollection<Match> Matches { get; set; } = new List<Match>();
        public virtual ICollection<Classement> Classements { get; set; } = new List<Classement>();
    }
}
