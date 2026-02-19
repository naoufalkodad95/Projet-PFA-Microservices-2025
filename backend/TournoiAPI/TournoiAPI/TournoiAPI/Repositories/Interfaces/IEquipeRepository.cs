using System.Collections.Generic;
using System.Threading.Tasks;
using TournoiAPI.Models;

namespace TournoiAPI.Repositories.Interfaces
{
    public interface IEquipeRepository
    {
        Task<IEnumerable<Equipe>> GetAllEquipesAsync();
        Task<Equipe?> GetEquipeByIdAsync(int id);
        Task<Equipe> AddEquipeAsync(Equipe equipe);
        Task<Equipe> UpdateEquipeAsync(Equipe equipe);
        Task<bool> DeleteEquipeAsync(int id);
        Task<IEnumerable<Tournoi>> GetTournoisByEquipeIdAsync(int equipeId);
        Task<bool> EquipeExistsAsync(int id);
        Task<bool> AddEquipeToTournoiAsync(int equipeId, int tournoiId);
        Task<bool> RemoveEquipeFromTournoiAsync(int equipeId, int tournoiId);
    }
}
