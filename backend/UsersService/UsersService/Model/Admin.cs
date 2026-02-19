using UsersService.Models;

public class Admin : Utilisateur
{
    public Admin()
    {
        TypeUtilisateur = "Admin"; // ✅ Définit un discriminateur unique
    }
}