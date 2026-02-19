using UsersService.Models;
using UsersService.ModelViews.Admin.Utilisateur;
using UsersService.ModelViews.Authentification;
using UsersService.ModelViews.Utilisateurs;

namespace UsersService.Mappers
{
    public static class UtilisateursMapper
    {
        //public static Utilisateur GetUtilisateurModelFromVM(ListeUtilisateursVM vm)
        //{
        //    var joueurvm = vm as ListeUtilisateursVM;

        //    return new Utilisateur
        //    {
        //        ID_Utilisateur = vm.ID_Utilisateur,
        //        Nom = vm.Nom,
        //        Prenom = vm.Prenom,
        //        DateDeNaissance = vm.DateDeNaissance,
        //        Cin = vm.Cin,
        //        Email = vm.Email,
        //        Telephone = vm.Telephone,
        //        Adresse = vm.Adresse,
        //        Login = vm.Login,
        //        MotDePasse = vm.MotDePasse, // ⚠️ Vérifier que cette ligne existe
        //        PhotoProfil = vm.PhotoProfil,

        //        // Vérifie si c'est un joueur avant de mapper les propriétés spécifiques aux joueurs
        //        IsCapitaine = joueurvm?.IsCapitaine ?? false, // Valeur par défaut si ce n'est pas un joueur
        //        NbrMarquer = joueurvm?.NbrMarquer ?? 0, // Valeur par défaut si ce n'est pas un joueur
        //        Niveau = joueurvm?.Niveau ?? "Non défini", // Valeur par défaut si ce n'est pas un joueur
        //        PositionPreferee = joueurvm?.PositionPreferee ?? "Non définie" // Valeur par défaut si ce n'est pas un joueur
        //    };
        //}


        //************* RegisterVM *****************

        public static Utilisateur GetUtilisateurModelFromRegisterUtilisateursVM(RegisterVM vm)
        {


            return new Utilisateur
            {
                Nom = vm.Nom,
                Prenom = vm.Prenom,
                DateDeNaissance = vm.DateDeNaissance,
                Cin = vm.Cin,
                Email = vm.Email,
                Telephone = vm.Telephone,
                Adresse = vm.Adresse,
                Login = vm.Login,
                TypeUtilisateur = "Joueur",
                MotDePasse = vm.MotDePasse,

            };
        }
        public static Utilisateur GetUtilisateurModelFromLoginVM(LoginVM loginVM)
        {
            return new Utilisateur
            {
                Login = loginVM.Login,
                MotDePasse = loginVM.MotDePasse
            };
        }

        //************* ListeUtilisateursVM *****************

        public static ListeUtilisateursVM GetListeUtilisateursVMFromModel(Utilisateur model)
        {
            // Vérifie si l'utilisateur est un joueur
            var joueurModel = model as Joueur;

            // Retourne le ViewModel en fonction du type de l'utilisateur
            return new ListeUtilisateursVM
            {
                ID_Utilisateur = model.ID_Utilisateur,
                Nom = model.Nom,
                Prenom = model.Prenom,
                DateDeNaissance = model.DateDeNaissance,
                Cin = model.Cin,
                Email = model.Email,
                Telephone = model.Telephone,
                Adresse = model.Adresse,
                Login = model.Login,
                TypeUtilisateur = model.TypeUtilisateur, // ✅ Corrigé : doit afficher "Joueur" ou "Admin"
                MotDePasse = model.MotDePasse,
                PhotoProfil = model.PhotoProfil,

                // Vérifiez si l'utilisateur est un joueur

                // Vérifie si c'est un joueur avant de mapper les propriétés spécifiques aux joueurs
                IsCapitaine = joueurModel?.IsCapitaine ?? false, // Valeur par défaut si ce n'est pas un joueur
                NbrMarquer = joueurModel?.NbrMarquer ?? 0, // Valeur par défaut si ce n'est pas un joueur
                Niveau = joueurModel?.Niveau ?? "Null", // Valeur par défaut si ce n'est pas un joueur
                PositionPreferee = joueurModel?.PositionPreferee ?? "Null" // Valeur par défaut si ce n'est pas un joueur
            };
      
        }


        //************* CreateUtilisateursVM *****************

        public static Utilisateur GetUtilisateurModelFromCreateUtilisateursVM(CreateUtilisateursVM vm)
        {
            if (vm.TypeUtilisateur == "Joueur")
            {
                return new Joueur
                {
                    Nom = vm.Nom,
                    Prenom = vm.Prenom,
                    DateDeNaissance = vm.DateDeNaissance,
                    Cin = vm.Cin,
                    Email = vm.Email,
                    Telephone = vm.Telephone,
                    Adresse = vm.Adresse,
                    Login = vm.Login,
                    TypeUtilisateur = "Joueur",
                    MotDePasse = vm.MotDePasse,
                    IsCapitaine = vm.IsCapitaine, // ✅ Prise en compte du capitaine seulement pour un Joueur
                    NbrMarquer = (int)vm.NbrMarquer,
                    Niveau = vm.Niveau,
                    PositionPreferee = vm.PositionPreferee
                };
            }
            else
            {
                return new Admin
                {
                    Nom = vm.Nom,
                    Prenom = vm.Prenom,
                    DateDeNaissance = vm.DateDeNaissance,
                    Cin = vm.Cin,
                    Email = vm.Email,
                    Telephone = vm.Telephone,
                    Adresse = vm.Adresse,
                    Login = vm.Login,
                    TypeUtilisateur = vm.TypeUtilisateur ?? "Utilisateur",
                    MotDePasse = vm.MotDePasse
                };
            }
        }


        //************* ModificationUtilisateursVM *****************        

        public static Utilisateur GetUtilisateurModelFromModifierUtilisateursVM(ModifierUtilisateursVM vm)
        {
            // Vérification du TypeUtilisateur
            var typeUtilisateur = string.IsNullOrEmpty(vm.TypeUtilisateur) ? "Admin" : vm.TypeUtilisateur;

            if (typeUtilisateur == "Joueur")
            {
                return new Joueur
                {
                    ID_Utilisateur = vm.ID_Utilisateur,
                    Nom = vm.Nom,
                    Prenom = vm.Prenom,
                    DateDeNaissance = vm.DateDeNaissance,
                    Cin = vm.Cin,
                    Email = vm.Email,
                    Telephone = vm.Telephone,
                    Adresse = vm.Adresse,
                    Login = vm.Login,
                    TypeUtilisateur = "Joueur",
                    IsCapitaine = vm.IsCapitaine,
                    NbrMarquer = vm.NbrMarquer ?? 0,  // Valeur par défaut si null
                    Niveau = vm.Niveau,
                    PositionPreferee = vm.PositionPreferee
    };
}
            else
{
    return new Admin
    {
        ID_Utilisateur = vm.ID_Utilisateur,
        Nom = vm.Nom,
        Prenom = vm.Prenom,
        DateDeNaissance = vm.DateDeNaissance,
        Cin = vm.Cin,
        Email = vm.Email,
        Telephone = vm.Telephone,
        Adresse = vm.Adresse,
        Login = vm.Login,
        TypeUtilisateur = typeUtilisateur, // Si null ou vide, "Admin" sera utilisé
    };
}
        }

        //public static void CopierChampsCommuns(Utilisateur cible, ModifierUtilisateursVM vm)
        //{
        //    cible.Nom = vm.Nom;
        //    cible.Prenom = vm.Prenom;
        //    cible.DateDeNaissance = vm.DateDeNaissance;
        //    cible.Cin = vm.Cin;
        //    cible.Email = vm.Email;
        //    cible.Telephone = vm.Telephone;
        //    cible.Adresse = vm.Adresse;
        //    cible.Login = vm.Login;
        //    cible.PhotoProfil = vm.PhotoProfil;
        //}
        //public static Utilisateur GetUtilisateurModelFromModifierUtilisateursVM(ModifierUtilisateursVM vm)
        //{
        //    Utilisateur utilisateur;

        //    switch (vm.TypeUtilisateur?.ToLower())
        //    {
        //        case "joueur":
        //            utilisateur = new Joueur
        //            {
        //                IsCapitaine = vm.IsCapitaine,
        //                NbrMarquer = vm.NbrMarquer ?? 0,
        //                Niveau = vm.Niveau,
        //                PositionPreferee = vm.PositionPreferee
        //            };
        //            break;

        //        case "admin":
        //            utilisateur = new Admin();
        //            // ajouter propriétés spécifiques admin si besoin
        //            break;

        //        default:
        //            utilisateur = new Utilisateur();
        //            break;
        //    }

        //    CopierChampsCommuns(utilisateur, vm);
        //    return utilisateur;
        //}



        //public static void UpdateUtilisateurFromModifierVM(Utilisateur utilisateur, ModifierUtilisateursVM vm)
        //{
        //    utilisateur.Nom = vm.Nom;
        //    utilisateur.Prenom = vm.Prenom;
        //    utilisateur.DateDeNaissance = vm.DateDeNaissance;
        //    utilisateur.Cin = vm.Cin;
        //    utilisateur.Email = vm.Email;
        //    utilisateur.Telephone = vm.Telephone;
        //    utilisateur.Adresse = vm.Adresse;
        //    utilisateur.Login = vm.Login;
        //    utilisateur.TypeUtilisateur = vm.TypeUtilisateur ?? "Utilisateur";
        //    utilisateur.PhotoProfil = vm.PhotoProfil;

        //    // Vérifier si c'est un Joueur et mettre à jour les champs spécifiques
        //    if (utilisateur is Joueur joueur)
        //    {
        //        joueur.IsCapitaine = vm.IsCapitaine;
        //        joueur.NbrMarquer = vm.NbrMarquer ?? 0;
        //        joueur.Niveau = vm.Niveau;
        //        joueur.PositionPreferee = vm.PositionPreferee;
        //    }
        //}



        //*************ModifierMotDePasseVM *****************


        public static void MapPasswordChange(Utilisateur utilisateur, ModifierMotDePasseVM modifierMotDePasseVM)
        {
            if (!string.IsNullOrWhiteSpace(modifierMotDePasseVM.NouveauMotDePasse))
            {
                utilisateur.MotDePasse = BCrypt.Net.BCrypt.HashPassword(modifierMotDePasseVM.NouveauMotDePasse);
            }
        }
    }

}
//public static Utilisateur GetUtilisateurModelFromModifiereUtilisateurVM(ModifierUtilisateursVM vm)
//{


//    if (vm.TypeUtilisateur == "Joueur")
//    {
//        return new Joueur
//        {
//            Nom = vm.Nom,
//            Prenom = vm.Prenom,
//            DateDeNaissance = vm.DateDeNaissance,
//            Cin = vm.Cin,
//            Email = vm.Email,
//            Telephone = vm.Telephone,
//            Adresse = vm.Adresse,
//            Login = vm.Login,
//            TypeUtilisateur = "Joueur",
//            IsCapitaine = vm.IsCapitaine, // ✅ Prise en compte du capitaine seulement pour un Joueur
//            NbrMarquer = (int)vm.NbrMarquer,
//            Niveau = vm.Niveau,
//            PositionPreferee = vm.PositionPreferee
//        };
//    }
//    else
//    {
//        return new Utilisateur
//        {
//            Nom = vm.Nom,
//            Prenom = vm.Prenom,
//            DateDeNaissance = vm.DateDeNaissance,
//            Cin = vm.Cin,
//            Email = vm.Email,
//            Telephone = vm.Telephone,
//            Adresse = vm.Adresse,
//            Login = vm.Login,
//            TypeUtilisateur = vm.TypeUtilisateur ?? "Utilisateur",

//        };




//    }
//    ;
//}