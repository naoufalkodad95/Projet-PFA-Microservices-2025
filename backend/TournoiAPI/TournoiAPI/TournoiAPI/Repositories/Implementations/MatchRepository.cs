using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using TournoiAPI.Data;
using TournoiAPI.Models;
using TournoiAPI.Repositories.Interfaces;

namespace TournoiAPI.Repositories.Implementations
{
    public class MatchRepository : IMatchRepository
    {
        private readonly TournoiDbContext _context;

        public MatchRepository(TournoiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Match>> GetAllMatchesAsync()
        {
            return await _context.Matches
                .Include(m => m.Equipe1)
                .Include(m => m.Equipe2)
                .Include(m => m.Tournoi)
                .ToListAsync();
        }


        public async Task<Match?> GetMatchByIdAsync(int id)
        {
            return await _context.Matches
                .Include(m => m.Equipe1)
                .Include(m => m.Equipe2)
                .Include(m => m.Tournoi)
                .FirstOrDefaultAsync(m => m.ID_Match == id);
        }

        public async Task<Match> AddMatchAsync(Match match)
        {
            _context.Matches.Add(match);
            await _context.SaveChangesAsync();
            return match;
        }

        public async Task<Match> UpdateMatchAsync(Match match)
        {
            _context.Entry(match).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return match;
        }

        public async Task<bool> DeleteMatchAsync(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null)
                return false;

            _context.Matches.Remove(match);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> MatchExistsAsync(int id)
        {
            return await _context.Matches.AnyAsync(m => m.ID_Match == id);
        }
    }
}