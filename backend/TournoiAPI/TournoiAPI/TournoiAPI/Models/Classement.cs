using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TournoiAPI.Models
{
    public class Classement
    {
        [Key]
        public int ID_Classement { get; set; }

        [Required]
        public int Position { get; set; }

        public int Points { get; set; }

        public DateTime DateMaj { get; set; }

        // Clés étrangères
        public int ID_Tournoi { get; set; }

        public int ID_Equipe { get; set; }

        // Navigation properties
        [ForeignKey("ID_Tournoi")]
        public virtual Tournoi? Tournoi { get; set; }

        [ForeignKey("ID_Equipe")]
        public virtual Equipe? Equipe { get; set; }
    }
}
