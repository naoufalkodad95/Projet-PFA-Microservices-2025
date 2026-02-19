using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UsersService.Models;


using UsersService.ModelViews.Authentification;
using UsersService.Mappers;
using UsersService.Services.Token;



namespace UsersService.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Mycontext db;
        private readonly IConfiguration config;
        private readonly IJwtTokenService jwtTokenService;

        public AuthController(Mycontext db, IConfiguration config, IJwtTokenService jwtTokenService)
        {
            this.db = db;
            this.config = config;
            this.jwtTokenService = jwtTokenService;

        }



        [HttpPost("register")]
        public async Task<ActionResult> RegisterUtilisateur([FromForm] RegisterVM registerVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // 🔍 Vérifier si l'email ou le login existent déjà
                var existingUser = await db.Utilisateurs
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == registerVM.Email.ToLower() ||
                                              u.Login.ToLower() == registerVM.Login.ToLower());

                if (existingUser != null)
                {
                    if (existingUser.Email.ToLower() == registerVM.Email.ToLower() &&
                        existingUser.Login.ToLower() == registerVM.Login.ToLower())
                    {
                        return BadRequest(new { message = "L'email et le login sont déjà utilisés !" });
                    }
                    else if (existingUser.Email.ToLower() == registerVM.Email.ToLower())
                    {
                        return BadRequest(new { message = "L'email est déjà utilisé !" });
                    }
                    else if (existingUser.Login.ToLower() == registerVM.Login.ToLower())
                    {
                        return BadRequest(new { message = "Le login est déjà pris !" });
                    }

                }

                // Vérification de l'image
                string imagePath = null;
                if (registerVM.ImageUpload != null && registerVM.ImageUpload.Length > 0)
                {
                    imagePath = "/uploads/default.jpg";
                    string[] formatsAutorises = { ".jpg", ".jpeg", ".png" };
                    string extension = Path.GetExtension(registerVM.ImageUpload.FileName).ToLower();

                    // Vérification de l'extension
                    if (string.IsNullOrEmpty(extension) || !formatsAutorises.Contains(extension))
                    {
                        return BadRequest(new { message = "Seuls les fichiers JPG, JPEG et PNG sont autorisés." });
                    }

                    // Dossier où stocker les images (wwwroot/uploads/)
                    string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                    // Vérifier si le dossier existe, sinon le créer
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }


                    // 🔹 Nettoyer le nom et prénom pour éviter les caractères spéciaux
                    string nomNettoye = registerVM.Nom.Replace(" ", "_").Replace(".", "").Replace("-", "");
                    string prenomNettoye = registerVM.Prenom.Replace(" ", "_").Replace(".", "").Replace("-", "");
                    string loginNettoye = registerVM.Login.Replace(" ", "_").Replace(".", "").Replace("-", "");

                    // 🔹 Générer le nom du fichier avec Nom_Prenom_GUID
                    string uniqueFileName = $"{nomNettoye}_{prenomNettoye}_{loginNettoye}{extension}";
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    // Enregistrer le fichier sur le serveur
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await registerVM.ImageUpload.CopyToAsync(fileStream);
                    }

                    // Vérification finale du fichier enregistré
                    if (!System.IO.File.Exists(filePath))
                    {
                        return StatusCode(500, " Erreur lors de l'enregistrement de l'image !");
                    }

                    imagePath = $"/uploads/{uniqueFileName}"; // URL relative stockée en base
                }

                // 📌 Mapping vers modèle
                Utilisateur utilisateur = UtilisateursMapper.GetUtilisateurModelFromRegisterUtilisateursVM(registerVM);
                utilisateur.PhotoProfil = imagePath;
                // 🔐 Hachage du mot de passe
                utilisateur.MotDePasse = HashPassword(registerVM.MotDePasse);

                // 📌 Ajouter en base via la méthode du modèle
                await utilisateur.AjouterUtilisateur(db);

                return StatusCode(200);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Erreur lors de l'insertion en base de données", details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur inconnue", details = ex.Message });
            }
        }






        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginVM loginVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 🔍 Récupérer l'utilisateur depuis la base de données
            Utilisateur user = await Utilisateur.Authenticate(db, loginVM.Login);

            // ❌ Vérifier si l'utilisateur existe
            if (user == null || !VerifyPasswordHash(loginVM.MotDePasse, user.MotDePasse))
            {
                return Unauthorized(new { message = "Login ou mot de passe incorrect." });
            }



            // ✅ Générer un token JWT
            var token = jwtTokenService.GenerateJwtToken(user);
            //tokenStorageService.SetToken(token, HttpContext);

            // 🔄 Si l'utilisateur est un Joueur, effectuer un cast pour accéder à la propriété IsCapitaine
            var joueur = user as Joueur;
            if (joueur != null)
            {
                // ✅ Générer un token JWT

                return Ok(new
                {
                    token,
                    user = new
                    {
                        joueur.ID_Utilisateur,
                        joueur.Nom,
                        joueur.Prenom,
                        joueur.PhotoProfil,
                        joueur.TypeUtilisateur,
                        joueur.IsCapitaine // Accéder à IsCapitaine depuis Joueur
                    }
                });
            }

            // Si l'utilisateur n'est pas un Joueur (par exemple un Admin), retourner un autre format de réponse
            return Ok(new
            {
                token,
                user = new
                {
                    user.ID_Utilisateur,
                    user.Nom,
                    user.Prenom,
                    user.PhotoProfil,
                    user.TypeUtilisateur
                }
            });
        }


        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }


        private bool VerifyPasswordHash(string enteredPassword, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(enteredPassword, storedHash);
        }



    }
}
