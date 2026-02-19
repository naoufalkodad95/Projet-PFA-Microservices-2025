using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TournoiAPI.Models
{
    public class Match
    {
        [Key]
        public int ID_Match { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public int? ScoreEquipe1 { get; set; }

        public int? ScoreEquipe2 { get; set; }

        [StringLength(50)]
        public string? Statut { get; set; }

        // Clés étrangères
        public int ID_Tournoi { get; set; }

        public int ID_Equipe1 { get; set; }

        public int ID_Equipe2 { get; set; }

        // Navigation properties
        [ForeignKey("ID_Tournoi")]
        public virtual Tournoi? Tournoi { get; set; }

        [ForeignKey("ID_Equipe1")]
        public virtual Equipe? Equipe1 { get; set; }

        [ForeignKey("ID_Equipe2")]
        public virtual Equipe? Equipe2 { get; set; }
    }
}
