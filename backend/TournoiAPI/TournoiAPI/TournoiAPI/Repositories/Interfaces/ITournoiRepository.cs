using System.Collections.Generic;
using System.Threading.Tasks;
using TournoiAPI.Models;

namespace TournoiAPI.Repositories.Interfaces
{
    public interface ITournoiRepository
    {
        Task<IEnumerable<Tournoi>> GetAllTournoisAsync();
        Task<Tournoi?> GetTournoiByIdAsync(int id);
        Task<Tournoi?> GetTournoiWithDetailsAsync(int id);
        Task<Tournoi> AddTournoiAsync(Tournoi tournoi);
        Task<Tournoi> UpdateTournoiAsync(Tournoi tournoi);
        Task<bool> DeleteTournoiAsync(int id);
        Task<IEnumerable<Equipe>> GetEquipesByTournoiIdAsync(int tournoiId);
        Task<IEnumerable<Match>> GetMatchesByTournoiIdAsync(int tournoiId);
        Task<IEnumerable<Classement>> GetClassementsByTournoiIdAsync(int tournoiId);
        Task<bool> TournoiExistsAsync(int id);
    }
}