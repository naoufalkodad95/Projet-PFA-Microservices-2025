using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TournoiAPI.Data;
using TournoiAPI.Models;
using TournoiAPI.Repositories.Interfaces;

namespace TournoiAPI.Repositories.Implementations
{
    public class EquipeRepository : IEquipeRepository
    {
        private readonly TournoiDbContext _context;

        public EquipeRepository(TournoiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Equipe>> GetAllEquipesAsync()
        {
            return await _context.Equipes.ToListAsync();
        }

        public async Task<Equipe?> GetEquipeByIdAsync(int id)
        {
            return await _context.Equipes.FindAsync(id);
        }

        public async Task<Equipe> AddEquipeAsync(Equipe equipe)
        {
            _context.Equipes.Add(equipe);
            await _context.SaveChangesAsync();
            return equipe;
        }

        public async Task<Equipe> UpdateEquipeAsync(Equipe equipe)
        {
            _context.Entry(equipe).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return equipe;
        }

        public async Task<bool> DeleteEquipeAsync(int id)
        {
            var equipe = await _context.Equipes.FindAsync(id);
            if (equipe == null)
                return false;

            _context.Equipes.Remove(equipe);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Tournoi>> GetTournoisByEquipeIdAsync(int equipeId)
        {
            return await _context.EquipesTournois
                .Where(et => et.ID_Equipe == equipeId)
                .Select(et => et.Tournoi!)
                .ToListAsync();
        }

        public async Task<bool> EquipeExistsAsync(int id)
        {
            return await _context.Equipes.AnyAsync(e => e.ID_Equipe == id);
        }

        public async Task<bool> AddEquipeToTournoiAsync(int equipeId, int tournoiId)
        {
            var equipeTournoi = new EquipeTournoi
            {
                ID_Equipe = equipeId,
                ID_Tournoi = tournoiId,
                DateInscription = DateTime.Now,
                Statut = "Inscrit"
            };

            _context.EquipesTournois.Add(equipeTournoi);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveEquipeFromTournoiAsync(int equipeId, int tournoiId)
        {
            var equipeTournoi = await _context.EquipesTournois
                .FirstOrDefaultAsync(et => et.ID_Equipe == equipeId && et.ID_Tournoi == tournoiId);

            if (equipeTournoi == null)
                return false;

            _context.EquipesTournois.Remove(equipeTournoi);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
