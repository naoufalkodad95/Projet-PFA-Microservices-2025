// Repositories/Implementations/TournoiRepository.cs
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TournoiAPI.Data;
using TournoiAPI.Models;
using TournoiAPI.Repositories.Interfaces;

namespace TournoiAPI.Repositories.Implementations
{
    public class TournoiRepository : ITournoiRepository
    {
        private readonly TournoiDbContext _context;

        public TournoiRepository(TournoiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Tournoi>> GetAllTournoisAsync()
        {
            return await _context.Tournois.ToListAsync();
        }

        public async Task<Tournoi?> GetTournoiByIdAsync(int id)
        {
            return await _context.Tournois.FindAsync(id);
        }

        public async Task<Tournoi?> GetTournoiWithDetailsAsync(int id)
        {
            return await _context.Tournois
                .Include(t => t.EquipesTournois)
                    .ThenInclude(et => et.Equipe)
                .Include(t => t.Matches)
                    .ThenInclude(m => m.Equipe1)
                .Include(t => t.Matches)
                    .ThenInclude(m => m.Equipe2)
                .Include(t => t.Classements)
                    .ThenInclude(c => c.Equipe)
                .FirstOrDefaultAsync(t => t.ID_Tournoi == id);
        }

        public async Task<Tournoi> AddTournoiAsync(Tournoi tournoi)
        {
            _context.Tournois.Add(tournoi);
            await _context.SaveChangesAsync();
            return tournoi;
        }

        public async Task<Tournoi> UpdateTournoiAsync(Tournoi tournoi)
        {
            _context.Entry(tournoi).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return tournoi;
        }

        public async Task<bool> DeleteTournoiAsync(int id)
        {
            var tournoi = await _context.Tournois.FindAsync(id);
            if (tournoi == null)
                return false;

            _context.Tournois.Remove(tournoi);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Equipe>> GetEquipesByTournoiIdAsync(int tournoiId)
        {
            return await _context.EquipesTournois
                .Where(et => et.ID_Tournoi == tournoiId)
                .Select(et => et.Equipe!)
                .ToListAsync();
        }

        public async Task<IEnumerable<Match>> GetMatchesByTournoiIdAsync(int tournoiId)
        {
            return await _context.Matches
                .Include(m => m.Equipe1)
                .Include(m => m.Equipe2)
                .Where(m => m.ID_Tournoi == tournoiId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Classement>> GetClassementsByTournoiIdAsync(int tournoiId)
        {
            return await _context.Classements
                .Include(c => c.Equipe)
                .Where(c => c.ID_Tournoi == tournoiId)
                .OrderBy(c => c.Position)
                .ToListAsync();
        }

        public async Task<bool> TournoiExistsAsync(int id)
        {
            return await _context.Tournois.AnyAsync(t => t.ID_Tournoi == id);
        }
    }
}