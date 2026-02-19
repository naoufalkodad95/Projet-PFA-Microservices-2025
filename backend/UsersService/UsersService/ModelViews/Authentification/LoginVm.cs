using System.ComponentModel.DataAnnotations;

namespace UsersService.ModelViews.Authentification
{
    public class LoginVM
    {
        [Required(ErrorMessage = "Le champ 'Login' est requis.")]
        //[StringLength(50, MinimumLength = 5, ErrorMessage = "Le login doit contenir entre 5 et 50 caractères.")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Le champ 'Mot de passe' est requis.")]
        [DataType(DataType.Password)]
        //[MinLength(8, ErrorMessage = "Le mot de passe doit contenir au moins 8 caractères.")]
        //[RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d).{8,}$", ErrorMessage = "Le mot de passe doit contenir au moins une lettre et un chiffre.")]
        public string MotDePasse { get; set; }
    }
}
