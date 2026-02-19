using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace UsersService.ModelViews.Utilisateurs
{
    public class CreateUtilisateursVM
    {
        public int ID_Utilisateur { get; set; }

        [Required(ErrorMessage = "Le nom est requis.")]
        [StringLength(50, ErrorMessage = "Le nom ne peut pas dépasser 50 caractères.")]
        public string Nom { get; set; }

        [Required(ErrorMessage = "Le prénom est requis.")]
        [StringLength(50, ErrorMessage = "Le prénom ne peut pas dépasser 50 caractères.")]
        public string Prenom { get; set; }

        [Required(ErrorMessage = "La date de naissance est requise.")]
        [DataType(DataType.Date)]
        public DateOnly DateDeNaissance { get; set; }

        [Required(ErrorMessage = "Le CIN est requis.")]
        [StringLength(7, ErrorMessage = "Le CIN ne peut pas dépasser 7 caractères.")]
        [RegularExpression("[A-Z]{1,2}[0-9]{5,6}", ErrorMessage = "Le CIN doit commencer par 1 ou 2 lettres suivies de 5 ou 6 chiffres.")]
        public string Cin { get; set; }

        [Required(ErrorMessage = "L'email est requis.")]
        [EmailAddress(ErrorMessage = "L'email n'est pas valide.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Le téléphone est requis.")]
        [Phone(ErrorMessage = "Le numéro de téléphone n'est pas valide.")]
        public string Telephone { get; set; }

        [Required(ErrorMessage = "L'adresse est requise.")]
        [StringLength(100, ErrorMessage = "L'adresse ne peut pas dépasser 100 caractères.")]
        public string Adresse { get; set; }

        [Required(ErrorMessage = "Le login est requis.")]
        [StringLength(20, ErrorMessage = "Le login ne peut pas dépasser 20 caractères.")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Le type d'utilisateur est requis.")]
        public string TypeUtilisateur { get; set; }  // Par défaut, Joueur

        [Required(ErrorMessage = "Le mot de passe est requis.")]
        [MinLength(6, ErrorMessage = "Le mot de passe doit contenir au moins 6 caractères.")]
        [DataType(DataType.Password)]
        public string MotDePasse { get; set; }

        [Compare(nameof(MotDePasse), ErrorMessage = "Les mots de passe ne correspondent pas.")]
        [DataType(DataType.Password)]
        public string ConfirmationMotDePasse { get; set; }

        public DateTime DateInscription { get; set; } = DateTime.Now;
        public DateTime DateDerniereConnexion { get; set; } = DateTime.Now;

        [NotMapped]
        public IFormFile? ImageUpload { get; set; } // Pour l'upload d'images
        public string? PhotoProfil { get; set; }

        // ✅ Ajout de IsCapitaine : seulement si TypeUtilisateur = Joueur
        public bool IsCapitaine { get; set; } = false;

        // ✅ Informations spécifiques aux Joueurs
        public int? NbrMarquer { get; set; }
        public string? Niveau { get; set; }
        public string? PositionPreferee { get; set; }

       
    }
}
