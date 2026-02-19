using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TournoiAPI.DTOs;
using TournoiAPI.Models;  // Assurez-vous que cette directive est présente
using TournoiAPI.Repositories.Interfaces;

namespace TournoiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchesController : ControllerBase
    {
        private readonly IMatchRepository _matchRepository;
        private readonly ITournoiRepository _tournoiRepository;

        public MatchesController(IMatchRepository matchRepository, ITournoiRepository tournoiRepository)
        {
            _matchRepository = matchRepository;
            _tournoiRepository = tournoiRepository;
        }

        // GET: api/Matches
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MatchDTO>>> GetMatches()
        {
            var matches = await _matchRepository.GetAllMatchesAsync();
            var matchDtos = new List<MatchDTO>();

            foreach (var match in matches)
            {
                matchDtos.Add(new MatchDTO
                {
                    ID_Match = match.ID_Match,
                    Date = match.Date,
                    ScoreEquipe1 = match.ScoreEquipe1,
                    ScoreEquipe2 = match.ScoreEquipe2,
                    Statut = match.Statut,
                    ID_Tournoi = match.ID_Tournoi,
                    ID_Equipe1 = match.ID_Equipe1,
                    ID_Equipe2 = match.ID_Equipe2,
                    NomEquipe1 = match.Equipe1?.Nom,
                    NomEquipe2 = match.Equipe2?.Nom
                });
            }

            return Ok(matchDtos);
        }

        // GET: api/Matches/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MatchDTO>> GetMatch(int id)
        {
            var match = await _matchRepository.GetMatchByIdAsync(id);

            if (match == null)
            {
                return NotFound();
            }

            var matchDto = new MatchDTO
            {
                ID_Match = match.ID_Match,
                Date = match.Date,
                ScoreEquipe1 = match.ScoreEquipe1,
                ScoreEquipe2 = match.ScoreEquipe2,
                Statut = match.Statut,
                ID_Tournoi = match.ID_Tournoi,
                ID_Equipe1 = match.ID_Equipe1,
                ID_Equipe2 = match.ID_Equipe2,
                NomEquipe1 = match.Equipe1?.Nom,
                NomEquipe2 = match.Equipe2?.Nom
            };

            return Ok(matchDto);
        }

        // POST: api/Matches
        [HttpPost]
        public async Task<ActionResult<MatchDTO>> PostMatch(MatchCreateDTO matchDto)
        {
            // Vérifier si le tournoi existe
            if (!await _tournoiRepository.TournoiExistsAsync(matchDto.ID_Tournoi))
            {
                return BadRequest("Le tournoi spécifié n'existe pas");
            }

            var matchEntity = new TournoiAPI.Models.Match  // Utilisez le nom complet pour éviter l'ambiguïté
            {
                Date = matchDto.Date,
                ScoreEquipe1 = matchDto.ScoreEquipe1,
                ScoreEquipe2 = matchDto.ScoreEquipe2,
                Statut = matchDto.Statut ?? "Programmé",
                ID_Tournoi = matchDto.ID_Tournoi,
                ID_Equipe1 = matchDto.ID_Equipe1,
                ID_Equipe2 = matchDto.ID_Equipe2
            };

            await _matchRepository.AddMatchAsync(matchEntity);

            return CreatedAtAction(nameof(GetMatch), new { id = matchEntity.ID_Match }, new MatchDTO
            {
                ID_Match = matchEntity.ID_Match,
                Date = matchEntity.Date,
                ScoreEquipe1 = matchEntity.ScoreEquipe1,
                ScoreEquipe2 = matchEntity.ScoreEquipe2,
                Statut = matchEntity.Statut,
                ID_Tournoi = matchEntity.ID_Tournoi,
                ID_Equipe1 = matchEntity.ID_Equipe1,
                ID_Equipe2 = matchEntity.ID_Equipe2
            });
        }

        // PUT: api/Matches/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMatch(int id, MatchUpdateDTO matchDto)
        {
            var matchEntity = await _matchRepository.GetMatchByIdAsync(id);
            if (matchEntity == null)
            {
                return NotFound();
            }

            matchEntity.Date = matchDto.Date;
            matchEntity.ScoreEquipe1 = matchDto.ScoreEquipe1;
            matchEntity.ScoreEquipe2 = matchDto.ScoreEquipe2;
            matchEntity.Statut = matchDto.Statut;

            await _matchRepository.UpdateMatchAsync(matchEntity);

            return NoContent();
        }

        // DELETE: api/Matches/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatch(int id)
        {
            if (!await _matchRepository.MatchExistsAsync(id))
            {
                return NotFound();
            }

            await _matchRepository.DeleteMatchAsync(id);

            return NoContent();
        }
    }
}