using System.Collections.Generic;
using System.Threading.Tasks;
using TournoiAPI.Models;

namespace TournoiAPI.Repositories.Interfaces
{
    public interface IMatchRepository
    {
        Task<IEnumerable<Match>> GetAllMatchesAsync();
        Task<Match?> GetMatchByIdAsync(int id);
        Task<Match> AddMatchAsync(Match match);
        Task<Match> UpdateMatchAsync(Match match);
        Task<bool> DeleteMatchAsync(int id);
        Task<bool> MatchExistsAsync(int id);
    }
}