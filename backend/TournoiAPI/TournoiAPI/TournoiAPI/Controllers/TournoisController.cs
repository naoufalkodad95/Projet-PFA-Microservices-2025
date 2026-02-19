using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TournoiAPI.Data;
using TournoiAPI.DTOs;
using TournoiAPI.Models;

namespace TournoiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TournoisController : ControllerBase
    {
        private readonly TournoiDbContext _context;

        public TournoisController(TournoiDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tournoi>>> GetTournois()
        {
            try
            {
                var tournois = await _context.Tournois.ToListAsync();
                return Ok(tournois);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TournoiDetailDTO>> GetTournoi(int id)
        {
            try
            {
                var tournoi = await _context.Tournois
                    .Include(t => t.EquipesTournois)
                        .ThenInclude(et => et.Equipe)
                    .Include(t => t.Matches)
                        .ThenInclude(m => m.Equipe1)
                    .Include(t => t.Matches)
                        .ThenInclude(m => m.Equipe2)
                    .Include(t => t.Classements)
                        .ThenInclude(c => c.Equipe)
                    .FirstOrDefaultAsync(t => t.ID_Tournoi == id);

                if (tournoi == null)
                {
                    return NotFound($"Tournoi avec ID {id} non trouvé");
                }

                var tournoiDTO = new TournoiDetailDTO
                {
                    ID_Tournoi = tournoi.ID_Tournoi,
                    Nom = tournoi.Nom,
                    DateDebut = tournoi.DateDebut,
                    DateFin = tournoi.DateFin,
                    NbEquipesMax = tournoi.NbEquipesMax,
                    Statut = tournoi.Statut,
                    Reglement = tournoi.Reglement,
                    Prix = tournoi.Prix,
                    Equipes = tournoi.EquipesTournois.Select(et => new EquipeDTO
                    {
                        ID_Equipe = et.Equipe.ID_Equipe,
                        Nom = et.Equipe.Nom,
                        DateCreation = et.Equipe.DateCreation,
                        LogoBase64 = et.Equipe.Logo != null ? Convert.ToBase64String(et.Equipe.Logo) : null
                    }).ToList(),
                    Matches = tournoi.Matches.Select(m => new MatchDTO
                    {
                        ID_Match = m.ID_Match,
                        Date = m.Date,
                        ScoreEquipe1 = m.ScoreEquipe1,
                        ScoreEquipe2 = m.ScoreEquipe2,
                        Statut = m.Statut,
                        ID_Tournoi = m.ID_Tournoi,
                        ID_Equipe1 = m.ID_Equipe1,
                        ID_Equipe2 = m.ID_Equipe2,
                        NomEquipe1 = m.Equipe1?.Nom,
                        NomEquipe2 = m.Equipe2?.Nom
                    }).ToList(),
                    Classements = tournoi.Classements.Select(c => new ClassementDTO
                    {
                        ID_Classement = c.ID_Classement,
                        Position = c.Position,
                        Points = c.Points,
                        DateMaj = c.DateMaj,
                        ID_Tournoi = c.ID_Tournoi,
                        ID_Equipe = c.ID_Equipe,
                        NomEquipe = c.Equipe?.Nom
                    }).ToList()
                };

                return Ok(tournoiDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}, StackTrace: {ex.StackTrace}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Tournoi>> PostTournoi(TournoiCreateDTO tournoiDto)
        {
            try
            {
                if (tournoiDto.DateFin < tournoiDto.DateDebut)
                {
                    return BadRequest("La date de fin doit être postérieure à la date de début");
                }

                var tournoi = new Tournoi
                {
                    Nom = tournoiDto.Nom,
                    DateDebut = tournoiDto.DateDebut,
                    DateFin = tournoiDto.DateFin,
                    NbEquipesMax = tournoiDto.NbEquipesMax,
                    Statut = tournoiDto.Statut,
                    Reglement = tournoiDto.Reglement,
                    Prix = tournoiDto.Prix
                };

                _context.Tournois.Add(tournoi);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTournoi), new { id = tournoi.ID_Tournoi }, tournoi);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTournoi(int id, TournoiUpdateDTO tournoiDto)
        {
            try
            {
                var tournoi = await _context.Tournois.FindAsync(id);
                if (tournoi == null)
                {
                    return NotFound($"Tournoi avec ID {id} non trouvé");
                }

                if (tournoiDto.DateFin < tournoiDto.DateDebut)
                {
                    return BadRequest("La date de fin doit être postérieure à la date de début");
                }

                tournoi.Nom = tournoiDto.Nom;
                tournoi.DateDebut = tournoiDto.DateDebut;
                tournoi.DateFin = tournoiDto.DateFin;
                tournoi.NbEquipesMax = tournoiDto.NbEquipesMax;
                tournoi.Statut = tournoiDto.Statut;
                tournoi.Reglement = tournoiDto.Reglement;
                tournoi.Prix = tournoiDto.Prix;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TournoiExists(id))
                    {
                        return NotFound($"Tournoi avec ID {id} non trouvé");
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTournoi(int id)
        {
            try
            {
                var tournoi = await _context.Tournois.FindAsync(id);
                if (tournoi == null)
                {
                    return NotFound($"Tournoi avec ID {id} non trouvé");
                }

                var equipesTournoi = await _context.EquipesTournois
                    .Where(et => et.ID_Tournoi == id)
                    .ToListAsync();

                if (equipesTournoi.Any())
                {
                    _context.EquipesTournois.RemoveRange(equipesTournoi);
                }

                var matches = await _context.Matches
                    .Where(m => m.ID_Tournoi == id)
                    .ToListAsync();

                if (matches.Any())
                {
                    _context.Matches.RemoveRange(matches);
                }

                var classements = await _context.Classements
                    .Where(c => c.ID_Tournoi == id)
                    .ToListAsync();

                if (classements.Any())
                {
                    _context.Classements.RemoveRange(classements);
                }

                _context.Tournois.Remove(tournoi);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la suppression du tournoi {id}: {ex}");

                if (ex.InnerException != null && ex.InnerException.Message.Contains("FOREIGN KEY"))
                {
                    return BadRequest($"Impossible de supprimer le tournoi car il est référencé par d'autres données. Erreur: {ex.InnerException.Message}");
                }

                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        [HttpGet("{id}/Equipes")]
        public async Task<ActionResult<IEnumerable<EquipeDTO>>> GetEquipesByTournoiId(int id)
        {
            try
            {
                if (!TournoiExists(id))
                {
                    return NotFound($"Tournoi avec ID {id} non trouvé");
                }

                var equipes = await _context.EquipesTournois
                    .Where(et => et.ID_Tournoi == id)
                    .Include(et => et.Equipe)
                    .Select(et => new EquipeDTO
                    {
                        ID_Equipe = et.Equipe.ID_Equipe,
                        Nom = et.Equipe.Nom,
                        DateCreation = et.Equipe.DateCreation,
                        LogoBase64 = et.Equipe.Logo != null ? Convert.ToBase64String(et.Equipe.Logo) : null
                    })
                    .ToListAsync();

                return Ok(equipes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        [HttpGet("{id}/Matches")]
        public async Task<ActionResult<IEnumerable<MatchDTO>>> GetMatchesByTournoiId(int id)
        {
            try
            {
                if (!TournoiExists(id))
                {
                    return NotFound($"Tournoi avec ID {id} non trouvé");
                }

                var matches = await _context.Matches
                    .Where(m => m.ID_Tournoi == id)
                    .Include(m => m.Equipe1)
                    .Include(m => m.Equipe2)
                    .Select(m => new MatchDTO
                    {
                        ID_Match = m.ID_Match,
                        Date = m.Date,
                        ScoreEquipe1 = m.ScoreEquipe1,
                        ScoreEquipe2 = m.ScoreEquipe2,
                        Statut = m.Statut,
                        ID_Tournoi = m.ID_Tournoi,
                        ID_Equipe1 = m.ID_Equipe1,
                        ID_Equipe2 = m.ID_Equipe2,
                        NomEquipe1 = m.Equipe1.Nom,
                        NomEquipe2 = m.Equipe2.Nom
                    })
                    .ToListAsync();

                return Ok(matches);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        [HttpGet("{id}/Classements")]
        public async Task<ActionResult<IEnumerable<ClassementDTO>>> GetClassementsByTournoiId(int id)
        {
            try
            {
                if (!TournoiExists(id))
                {
                    return NotFound($"Tournoi avec ID {id} non trouvé");
                }

                var classements = await _context.Classements
                    .Where(c => c.ID_Tournoi == id)
                    .Include(c => c.Equipe)
                    .OrderBy(c => c.Position)
                    .Select(c => new ClassementDTO
                    {
                        ID_Classement = c.ID_Classement,
                        Position = c.Position,
                        Points = c.Points,
                        DateMaj = c.DateMaj,
                        ID_Tournoi = c.ID_Tournoi,
                        ID_Equipe = c.ID_Equipe,
                        NomEquipe = c.Equipe.Nom
                    })
                    .ToListAsync();

                return Ok(classements);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        private bool TournoiExists(int id)
        {
            return _context.Tournois.Any(e => e.ID_Tournoi == id);
        }
    }
}
