using Microsoft.EntityFrameworkCore;
using TournoiAPI.Models;

namespace TournoiAPI.Data
{
    public class TournoiDbContext : DbContext
    {
        public TournoiDbContext(DbContextOptions<TournoiDbContext> options) : base(options)
        {
        }

        public DbSet<Tournoi> Tournois { get; set; }
        public DbSet<Equipe> Equipes { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Classement> Classements { get; set; }
        public DbSet<EquipeTournoi> EquipesTournois { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration de la relation many-to-many entre Equipe et Tournoi via EquipeTournoi
            modelBuilder.Entity<EquipeTournoi>()
                .HasOne(et => et.Equipe)
                .WithMany(e => e.EquipesTournois)
                .HasForeignKey(et => et.ID_Equipe);

            modelBuilder.Entity<EquipeTournoi>()
                .HasOne(et => et.Tournoi)
                .WithMany(t => t.EquipesTournois)
                .HasForeignKey(et => et.ID_Tournoi);

            // Configuration de la relation entre Match et Equipe (double relation)
            modelBuilder.Entity<Match>()
                .HasOne(m => m.Equipe1)
                .WithMany(e => e.MatchesEquipe1)
                .HasForeignKey(m => m.ID_Equipe1)
                .OnDelete(DeleteBehavior.Restrict); // Évite la suppression en cascade pour les contraintes circulaires

            modelBuilder.Entity<Match>()
                .HasOne(m => m.Equipe2)
                .WithMany(e => e.MatchesEquipe2)
                .HasForeignKey(m => m.ID_Equipe2)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration de la relation entre Match et Tournoi
            modelBuilder.Entity<Match>()
                .HasOne(m => m.Tournoi)
                .WithMany(t => t.Matches)
                .HasForeignKey(m => m.ID_Tournoi);

            // Configuration de la relation entre Classement et Tournoi/Equipe
            modelBuilder.Entity<Classement>()
                .HasOne(c => c.Tournoi)
                .WithMany(t => t.Classements)
                .HasForeignKey(c => c.ID_Tournoi);

            modelBuilder.Entity<Classement>()
                .HasOne(c => c.Equipe)
                .WithMany()
                .HasForeignKey(c => c.ID_Equipe);
        }
    }
}
