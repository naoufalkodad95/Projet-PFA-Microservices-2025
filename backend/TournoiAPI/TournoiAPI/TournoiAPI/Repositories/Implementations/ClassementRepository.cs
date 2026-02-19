using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TournoiAPI.Data;
using TournoiAPI.Models;
using TournoiAPI.Repositories.Interfaces;

namespace TournoiAPI.Repositories.Implementations
{
    public class ClassementRepository : IClassementRepository
    {
        private readonly TournoiDbContext _context;

        public ClassementRepository(TournoiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Classement>> GetAllClassementsAsync()
        {
            return await _context.Classements
                .Include(c => c.Equipe)
                .Include(c => c.Tournoi)
                .ToListAsync();
        }

        public async Task<Classement?> GetClassementByIdAsync(int id)
        {
            return await _context.Classements
                .Include(c => c.Equipe)
                .Include(c => c.Tournoi)
                .FirstOrDefaultAsync(c => c.ID_Classement == id);
        }

        public async Task<Classement?> GetClassementByTournoiAndEquipeAsync(int tournoiId, int equipeId)
        {
            return await _context.Classements
                .Include(c => c.Equipe)
                .Include(c => c.Tournoi)
                .FirstOrDefaultAsync(c => c.ID_Tournoi == tournoiId && c.ID_Equipe == equipeId);
        }

        public async Task<Classement> AddClassementAsync(Classement classement)
        {
            classement.DateMaj = DateTime.Now;
            _context.Classements.Add(classement);
            await _context.SaveChangesAsync();
            return classement;
        }

        public async Task<Classement> UpdateClassementAsync(Classement classement)
        {
            classement.DateMaj = DateTime.Now;
            _context.Entry(classement).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return classement;
        }

        public async Task<bool> DeleteClassementAsync(int id)
        {
            var classement = await _context.Classements.FindAsync(id);
            if (classement == null)
                return false;

            _context.Classements.Remove(classement);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ClassementExistsAsync(int id)
        {
            return await _context.Classements.AnyAsync(c => c.ID_Classement == id);
        }
    }
}