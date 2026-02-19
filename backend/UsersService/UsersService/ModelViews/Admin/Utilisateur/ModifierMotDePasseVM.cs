using System.ComponentModel.DataAnnotations;

namespace UsersService.ModelViews.Admin.Utilisateur
{
    public class ModifierMotDePasseVM
    {
        [Required(ErrorMessage = "L'ancien mot de passe est requis.")]
        [DataType(DataType.Password)]
        public string? AncienMotDePasse { get; set; }

        [Required(ErrorMessage = "Le nouveau mot de passe est requis.")]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Le mot de passe doit avoir entre 6 et 100 caractères.")]
        public string? NouveauMotDePasse { get; set; }

        [Required(ErrorMessage = "Veuillez confirmer le nouveau mot de passe.")]
        [DataType(DataType.Password)]
        [Compare("NouveauMotDePasse", ErrorMessage = "Les mots de passe ne correspondent pas.")]
        public string? ConfirmerMotDePasse { get; set; }
    }
}
