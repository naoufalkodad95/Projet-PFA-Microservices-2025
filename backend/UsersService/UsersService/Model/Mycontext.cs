using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
//using UsersService.ModelViews;

namespace UsersService.Models
{
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using UsersService.Models;
    //using UsersService.ModelViews;


    public class Mycontext : DbContext
    {
        public Mycontext(DbContextOptions<Mycontext> options) : base(options) { }

        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<Joueur> Joueurs { get; set; }
        public DbSet<Admin> Admins { get; set; }

     
            protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Utilisateur>()
                .HasKey(u => u.ID_Utilisateur); // Clé primaire

            modelBuilder.Entity<Utilisateur>()
                .HasDiscriminator<string>("TypeUtilisateur")
                .HasValue<Utilisateur>("Utilisateur") // ✅ Discriminateur unique
                .HasValue<Joueur>("Joueur")           // ✅ Discriminateur unique
                .HasValue<Admin>("Admin");            // ✅ Discriminateur unique

            base.OnModelCreating(modelBuilder);
        }
    
    
}
}
