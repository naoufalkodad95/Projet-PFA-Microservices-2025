using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TournoiAPI.Models
{
    public class EquipeTournoi
    {
        [Key]
        public int ID_EquipeTournoi { get; set; }

        public DateTime DateInscription { get; set; }

        [StringLength(50)]
        public string? Statut { get; set; }

        // Clés étrangères
        public int ID_Equipe { get; set; }

        public int ID_Tournoi { get; set; }

        // Navigation properties
        [ForeignKey("ID_Equipe")]
        public virtual Equipe? Equipe { get; set; }

        [ForeignKey("ID_Tournoi")]
        public virtual Tournoi? Tournoi { get; set; }
    }
}
