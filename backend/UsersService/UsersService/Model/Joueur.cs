
using UsersService.Models;

public class Joueur : Utilisateur
{
    public Joueur()
    {
        TypeUtilisateur = "Joueur"; // ✅ Définit un discriminateur unique
    }

    public bool IsCapitaine { get; set; } = false;
    public int NbrMarquer { get; set; }
    public string Niveau { get; set; }
    public string PositionPreferee { get; set; }
}



