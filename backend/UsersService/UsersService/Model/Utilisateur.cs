using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;


namespace UsersService.Models
{
    public class Utilisateur
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID_Utilisateur { get; set; }

        [Required(ErrorMessage = "Le nom est requis.")]
        [StringLength(50)]
        public string Nom { get; set; }

        [Required(ErrorMessage = "Le prénom est requis.")]
        [StringLength(50)]
        public string Prenom { get; set; }

        [Required(ErrorMessage = "La date de naissance est requise.")]
        [DataType(DataType.Date)]
        public DateOnly DateDeNaissance { get; set; }

        [Required(ErrorMessage = "Le CIN est requis.")]
        [StringLength(7)]
        [RegularExpression("[A-Z]{1,2}[0-9]{5,6}", ErrorMessage = "Le CIN doit commencer par 1 ou 2 lettres suivies de 5 ou 6 chiffres.")]
        public string Cin { get; set; }

        [Required(ErrorMessage = "L'email est requis.")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Le téléphone est requis.")]
        [Phone]
        public string Telephone { get; set; }

        [Required(ErrorMessage = "L'adresse est requise.")]
        [StringLength(100)]
        public string Adresse { get; set; }



        [Required(ErrorMessage = "Le login est requis.")]
        [StringLength(20)]

        public string Login { get; set; }

        [Required(ErrorMessage = "Le mot de passe est requis.")]
        [DataType(DataType.Password)]
        public string MotDePasse { get; set; }
        [Required(ErrorMessage = "Le rôle est requis.")]



        [NotMapped]
        public IFormFile ImageUpload { get; set; } // Fichier temporaire
        public string PhotoProfil { get; set; }


        public DateTime DateInscription { get; private set; } = DateTime.Now;

        public DateTime DateDerniereConnexion { get; private set; } = DateTime.Now;




        [Required]
        public string TypeUtilisateur { get; set; } // "Utilisateur", "Joueur" ou "Admin"
    





        //    // ✅ 1. Récupérer tous les utilisateurs
        public static async Task<List<Utilisateur>> GetAllUsers(Mycontext db)
        {

            return await db.Utilisateurs 
           //.Where(u => u.TypeUtilisateur == "joueur") // Optionnel, si tu veux filtrer par type
           .ToListAsync();



        }

        //    // ✅ 2. Récupérer un utilisateur par ID
        public static async Task<Utilisateur> GetUserById(Mycontext db, int id)
        {
            return await db.Utilisateurs.FindAsync(id);
        }
        // ✅ 3. Ajouter un utilisateur
       
        public async Task AjouterUtilisateur(Mycontext db)
        {
            await db.Utilisateurs.AddAsync(this);
            await db.SaveChangesAsync();
        }
        // ✅ 4. Modifier un utilisateur
        public async Task ModifierUtilisateur(Mycontext db)
        {
            try
            {
                // Vérifie que l'utilisateur a été modifié avant d'effectuer la mise à jour
                if (db.Entry(this).State == EntityState.Detached)
                {
                    db.Utilisateurs.Attach(this); // Attache l'entité à la session si elle est détachée
                }

                db.Utilisateurs.Update(this); // Mise à jour de l'entité dans le contexte
                await db.SaveChangesAsync(); // Sauvegarde des modifications en base
            }
            catch (Exception ex)
            {
                throw new Exception("Erreur lors de la mise à jour de l'utilisateur", ex);
            }
        }




        //    // ✅ 5. Supprimer un utilisateur
        public static async Task<bool> DeleteUser(Mycontext db, int id)
        {
            var user = await db.Utilisateurs.FindAsync(id);
            if (user == null) return false;

            db.Utilisateurs.Remove(user);
            await db.SaveChangesAsync();
            return true;
        }
        // ✅ 6. Authentification un utilisateur

        public static async Task<Utilisateur> Authenticate(Mycontext db, string login)
        {
            return await db.Utilisateurs.FirstOrDefaultAsync(u => u.Login == login);
        }



        //    // ✅ 7. Modifier un MotDePasse
        public static async Task<bool> UpdatePassword(Mycontext db, Utilisateur utilisateur)
        {
            try
            {
                db.Utilisateurs.Update(utilisateur); // Mets à jour uniquement l'utilisateur
                int result = await db.SaveChangesAsync(); // Enregistre les changements
                return result > 0; // Retourne true si au moins une ligne est modifiée
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la mise à jour du mot de passe : {ex.Message}");
                return false;
            }
        }


        //}





    }



}