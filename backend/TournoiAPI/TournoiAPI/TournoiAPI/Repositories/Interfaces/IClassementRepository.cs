using System.Collections.Generic;
using System.Threading.Tasks;
using TournoiAPI.Models;

namespace TournoiAPI.Repositories.Interfaces
{
    public interface IClassementRepository
    {
        Task<IEnumerable<Classement>> GetAllClassementsAsync();
        Task<Classement?> GetClassementByIdAsync(int id);
        Task<Classement> AddClassementAsync(Classement classement);
        Task<Classement> UpdateClassementAsync(Classement classement);
        Task<bool> DeleteClassementAsync(int id);
        Task<bool> ClassementExistsAsync(int id);
        Task<Classement?> GetClassementByTournoiAndEquipeAsync(int tournoiId, int equipeId);
    }
}