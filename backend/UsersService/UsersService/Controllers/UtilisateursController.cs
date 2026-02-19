using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using UsersService.Mappers;
using UsersService.Models;
using UsersService.ModelViews.Admin.Utilisateur;
using UsersService.ModelViews.Authentification;
using UsersService.ModelViews.Utilisateurs;



namespace UsersService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtilisateursController : ControllerBase
    {
        private readonly Mycontext db;

        public UtilisateursController(Mycontext db)
        {
            this.db = db;
        }

        // ✅ 1. GET : Récupérer tous les utilisateurs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ListeUtilisateursVM>>> GetUtilisateurs()
        {
            var utilisateurs = await Utilisateur.GetAllUsers(db);
            var utilisateursVM = utilisateurs.ConvertAll(UtilisateursMapper.GetListeUtilisateursVMFromModel);
            return Ok(utilisateursVM);
        }


        // ✅ 2. GET : Récupérer un utilisateur par ID
      
        [HttpGet("{id}")]
        public async Task<ActionResult<ListeUtilisateursVM>> GetUtilisateur(int id)
        {
            // Chercher l'utilisateur par son ID
            var utilisateur = await Utilisateur.GetUserById(db, id);

            // Si l'utilisateur n'est pas trouvé, retourner 404 Not Found
            if (utilisateur == null)
                return NotFound(new { message = "Utilisateur non trouvé." });

            // Mapper l'utilisateur à un modèle de vue
            var utilisateurVM = UtilisateursMapper.GetListeUtilisateursVMFromModel(utilisateur);
            return Ok(utilisateurVM);
        }

        // ✅ 3. POST : Ajouter un utilisateur
        [HttpPost]

        public async Task<ActionResult> PostUtilisateur([FromForm] CreateUtilisateursVM createutilisateurVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // 🔍 Vérifier si l'email ou le login existent déjà
                var existingUser = await db.Utilisateurs
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == createutilisateurVM.Email.ToLower() ||
                                              u.Login.ToLower() == createutilisateurVM.Login.ToLower());

                if (existingUser != null)
                {
                    if (existingUser.Email.ToLower() == createutilisateurVM.Email.ToLower() &&
                        existingUser.Login.ToLower() == createutilisateurVM.Login.ToLower())
                    {
                        return BadRequest(new { message = "L'email et le login sont déjà utilisés !" });
                    }
                    else if (existingUser.Email.ToLower() == createutilisateurVM.Email.ToLower())
                    {
                        return BadRequest(new { message = "L'email est déjà utilisé !" });
                    }
                    else if (existingUser.Login.ToLower() == createutilisateurVM.Login.ToLower())
                    {
                        return BadRequest(new { message = "Le login est déjà pris !" });
                    }
                }


                // Vérification de l'image
                string imagePath = null;
                if (createutilisateurVM.ImageUpload != null && createutilisateurVM.ImageUpload.Length > 0)
                {
                    imagePath = "/uploads/default.jpg";
                    string[] formatsAutorises = { ".jpg", ".jpeg", ".png" };
                    string extension = Path.GetExtension(createutilisateurVM.ImageUpload.FileName).ToLower();

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
                    string nomNettoye = createutilisateurVM.Nom.Replace(" ", "_").Replace(".", "").Replace("-", "");
                    string prenomNettoye = createutilisateurVM.Prenom.Replace(" ", "_").Replace(".", "").Replace("-", "");
                    string loginNettoye = createutilisateurVM.Login.Replace(" ", "_").Replace(".", "").Replace("-", "");

                    // 🔹 Générer le nom du fichier avec Nom_Prenom_GUID
                    string uniqueFileName = $"{nomNettoye}_{prenomNettoye}_{loginNettoye}{extension}";
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    // Enregistrer le fichier sur le serveur
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await createutilisateurVM.ImageUpload.CopyToAsync(fileStream);
                    }

                    // Vérification finale du fichier enregistré
                    if (!System.IO.File.Exists(filePath))
                    {
                        return StatusCode(500, " Erreur lors de l'enregistrement de l'image !");
                    }

                    imagePath = $"/uploads/{uniqueFileName}"; // URL relative stockée en base
                }

                // 📌 Mapping vers modèle
                Utilisateur utilisateur = UtilisateursMapper.GetUtilisateurModelFromCreateUtilisateursVM(createutilisateurVM);
                utilisateur.PhotoProfil = imagePath;
                // 🔐 Hachage du mot de passe
                utilisateur.MotDePasse = HashPassword(createutilisateurVM.MotDePasse);

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



        // ✅ 4. PUT : Modifier un utilisateur
        [HttpPut("{id}")]
        public async Task<ActionResult> PutUtilisateur(int id, [FromForm] ModifierUtilisateursVM modifierUtilisateurVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Vérifier si l'utilisateur existe
                var utilisateur = await db.Utilisateurs.FirstOrDefaultAsync(u => u.ID_Utilisateur == id);
                if (utilisateur == null)
                {
                    return NotFound(new { message = "Utilisateur non trouvé." });
                }

                // Vérifier si l'email ou le login existent déjà
                var existingUser = await db.Utilisateurs
                    .FirstOrDefaultAsync(u => (u.Email.ToLower() == modifierUtilisateurVM.Email.ToLower() ||
                                               u.Login.ToLower() == modifierUtilisateurVM.Login.ToLower()) &&
                                              u.ID_Utilisateur != id);

                if (existingUser != null)
                {
                    return BadRequest(new { message = "L'email ou le login est déjà utilisé !" });
                }

               
                // Gestion de l'image (si l'image est modifiée)
                string imagePath = utilisateur.PhotoProfil; // Conserver l'image actuelle si aucune nouvelle image n'est envoyée
                if (modifierUtilisateurVM.ImageUpload != null && modifierUtilisateurVM.ImageUpload.Length > 0)
                {
                    string[] formatsAutorises = { ".jpg", ".jpeg", ".png" };
                    string extension = Path.GetExtension(modifierUtilisateurVM.ImageUpload.FileName).ToLower();

                    if (!formatsAutorises.Contains(extension))
                    {
                        return BadRequest(new { message = "Seuls les fichiers JPG, JPEG et PNG sont autorisés." });
                    }

                    string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string nomNettoye = modifierUtilisateurVM.Nom.Replace(" ", "_").Replace(".", "").Replace("-", "");
                    string prenomNettoye = modifierUtilisateurVM.Prenom.Replace(" ", "_").Replace(".", "").Replace("-", "");
                    string loginNettoye = modifierUtilisateurVM.Login.Replace(" ", "_").Replace(".", "").Replace("-", "");

                    string uniqueFileName = $"{nomNettoye}_{prenomNettoye}_{loginNettoye}{extension}";
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await modifierUtilisateurVM.ImageUpload.CopyToAsync(fileStream);
                    }

                    if (!System.IO.File.Exists(filePath))
                    {
                        return StatusCode(500, "Erreur lors de l'enregistrement de l'image !");
                    }

                    imagePath = $"/uploads/{uniqueFileName}"; // Nouvelle image
                }
                else
                {
                    // Si aucune image n'est envoyée, garder la photo actuelle
                    imagePath = utilisateur.PhotoProfil;
                }

                // Mettre à jour les autres propriétés de l'utilisateur
                var utilisateurModifie = UtilisateursMapper.GetUtilisateurModelFromModifierUtilisateursVM(modifierUtilisateurVM);
                utilisateurModifie.PhotoProfil = imagePath; // Affecter le chemin de l'image mise à jour

                utilisateur.Nom = utilisateurModifie.Nom;
                utilisateur.Prenom = utilisateurModifie.Prenom;
                utilisateur.DateDeNaissance = utilisateurModifie.DateDeNaissance;
                utilisateur.Cin = utilisateurModifie.Cin;
                utilisateur.Email = utilisateurModifie.Email;
                utilisateur.Telephone = utilisateurModifie.Telephone;
                utilisateur.Adresse = utilisateurModifie.Adresse;
                utilisateur.Login = utilisateurModifie.Login;
                utilisateur.PhotoProfil = utilisateurModifie.PhotoProfil;

                // Si l'utilisateur est un joueur, mettre à jour les informations spécifiques
                if (utilisateur is Joueur joueur && utilisateurModifie is Joueur joueurModifie)
                {
                    joueur.IsCapitaine = joueurModifie.IsCapitaine;
                    joueur.NbrMarquer = joueurModifie.NbrMarquer;
                    joueur.Niveau = joueurModifie.Niveau;
                    joueur.PositionPreferee = joueurModifie.PositionPreferee;
                }

                // Mise à jour de l'utilisateur existant
                await utilisateur.ModifierUtilisateur(db);
                return StatusCode(200);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la mise à jour en base de données", details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur inconnue", details = ex.Message });
            }
        }


        // ✅ 5. DELETE : Supprimer un utilisateur
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUtilisateur(int id)
        {
            var user = await db.Utilisateurs.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Utilisateur introuvable !" });

            // 🔹 Supprimer l'image si elle existe
            if (!string.IsNullOrEmpty(user.PhotoProfil))
            {
                string imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.PhotoProfil.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
                var deleted = await Utilisateur.DeleteUser(db, id);
                if (!deleted)
                    return NotFound();

            }
            return NoContent();

        }

        // ✅ 5. PUT : Modifier un password

        [HttpPut("Modifier-MotDePasse/{id}")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ModifierMotDePasseVM passwordVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // 🔹 Récupérer l'utilisateur existant
            var existingUser = await Utilisateur.GetUserById(db, id);
            if (existingUser == null)
                return NotFound(new { message = "Utilisateur non trouvé." });

            // 🔹 Vérification de l'ancien mot de passe
            if (!BCrypt.Net.BCrypt.Verify(passwordVM.AncienMotDePasse, existingUser.MotDePasse))
            {
                return BadRequest(new { message = "L'ancien mot de passe est incorrect." });
            }

            // 🔹 Mapper la mise à jour du mot de passe
            UtilisateursMapper.MapPasswordChange(existingUser, passwordVM);

            // 🔹 Appeler le modèle pour mettre à jour en BD
            bool updated = await Utilisateur.UpdatePassword(db, existingUser);
            if (!updated)
                return StatusCode(500, "Erreur lors de la mise à jour du mot de passe.");

            return NoContent();
        }

        [Authorize]
        [HttpPut("MonProfil")]
        public async Task<IActionResult> PutMonProfil([FromForm] ModifierUtilisateursVM modifierUtilisateurVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Récupérer l'ID depuis le token JWT ou les claims
                var idStr = User.FindFirst("id")?.Value;
                if (idStr == null || !int.TryParse(idStr, out var id))
                    return Unauthorized(new { message = "Utilisateur non authentifié." });

                // Reprise du même code que dans PutUtilisateur, mais sans permettre de modifier un autre utilisateur
                var utilisateur = await db.Utilisateurs.FirstOrDefaultAsync(u => u.ID_Utilisateur == id);
                if (utilisateur == null)
                    return NotFound(new { message = "Utilisateur non trouvé." });

                var existingUser = await db.Utilisateurs
                    .FirstOrDefaultAsync(u => (u.Email.ToLower() == modifierUtilisateurVM.Email.ToLower() ||
                                               u.Login.ToLower() == modifierUtilisateurVM.Login.ToLower()) &&
                                              u.ID_Utilisateur != id);

                if (existingUser != null)
                    return BadRequest(new { message = "Email ou login déjà utilisé." });

                // Image
                string imagePath = utilisateur.PhotoProfil;
                if (modifierUtilisateurVM.ImageUpload != null && modifierUtilisateurVM.ImageUpload.Length > 0)
                {
                    string[] formatsAutorises = { ".jpg", ".jpeg", ".png" };
                    string extension = Path.GetExtension(modifierUtilisateurVM.ImageUpload.FileName).ToLower();

                    if (!formatsAutorises.Contains(extension))
                        return BadRequest(new { message = "Seuls les fichiers JPG, JPEG et PNG sont autorisés." });

                    string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string uniqueFileName = $"profil_{id}{extension}";
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await modifierUtilisateurVM.ImageUpload.CopyToAsync(fileStream);
                    }

                    imagePath = $"/uploads/{uniqueFileName}";
                }

                var utilisateurModifie = UtilisateursMapper.GetUtilisateurModelFromModifierUtilisateursVM(modifierUtilisateurVM);
                utilisateur.Nom = utilisateurModifie.Nom;
                utilisateur.Prenom = utilisateurModifie.Prenom;
                utilisateur.DateDeNaissance = utilisateurModifie.DateDeNaissance;
                utilisateur.Cin = utilisateurModifie.Cin;
                utilisateur.Email = utilisateurModifie.Email;
                utilisateur.Telephone = utilisateurModifie.Telephone;
                utilisateur.Adresse = utilisateurModifie.Adresse;
                utilisateur.Login = utilisateurModifie.Login;
                utilisateur.PhotoProfil = imagePath;

                await utilisateur.ModifierUtilisateur(db);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la mise à jour du profil", details = ex.Message });
            }
        }

        private string HashPassword(string password)
            {
                return BCrypt.Net.BCrypt.HashPassword(password);
            }
    }
}

