using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TournoiAPI.DTOs;
using TournoiAPI.Models;
using TournoiAPI.Repositories.Interfaces;

namespace TournoiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipesController : ControllerBase
    {
        private readonly IEquipeRepository _equipeRepository;

        public EquipesController(IEquipeRepository equipeRepository)
        {
            _equipeRepository = equipeRepository;
        }

        // GET: api/Equipes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipeDTO>>> GetEquipes()
        {
            var equipes = await _equipeRepository.GetAllEquipesAsync();
            var equipeDtos = new List<EquipeDTO>();

            foreach (var equipe in equipes)
            {
                equipeDtos.Add(new EquipeDTO
                {
                    ID_Equipe = equipe.ID_Equipe,
                    Nom = equipe.Nom,
                    DateCreation = equipe.DateCreation,
                    LogoBase64 = equipe.Logo != null ? Convert.ToBase64String(equipe.Logo) : null,
                    NombreJoueurs = equipe.NombreJoueurs,
                    Capitaine = equipe.Capitaine
                });
            }

            return Ok(equipeDtos);
        }

        // GET: api/Equipes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EquipeDTO>> GetEquipe(int id)
        {
            var equipe = await _equipeRepository.GetEquipeByIdAsync(id);

            if (equipe == null)
            {
                return NotFound();
            }

            var equipeDto = new EquipeDTO
            {
                ID_Equipe = equipe.ID_Equipe,
                Nom = equipe.Nom,
                DateCreation = equipe.DateCreation,
                LogoBase64 = equipe.Logo != null ? Convert.ToBase64String(equipe.Logo) : null,
                NombreJoueurs = equipe.NombreJoueurs,
                Capitaine = equipe.Capitaine
            };

            return Ok(equipeDto);
        }

        // POST: api/Equipes
        [HttpPost]
        public async Task<ActionResult<EquipeDTO>> PostEquipe(EquipeCreateDTO equipeDto)
        {
            var equipe = new Equipe
            {
                Nom = equipeDto.Nom,
                DateCreation = equipeDto.DateCreation,
                Logo = !string.IsNullOrEmpty(equipeDto.LogoBase64) ? Convert.FromBase64String(equipeDto.LogoBase64) : null,
                NombreJoueurs = equipeDto.NombreJoueurs,
                Capitaine = equipeDto.Capitaine
            };

            await _equipeRepository.AddEquipeAsync(equipe);

            return CreatedAtAction(nameof(GetEquipe), new { id = equipe.ID_Equipe }, new EquipeDTO
            {
                ID_Equipe = equipe.ID_Equipe,
                Nom = equipe.Nom,
                DateCreation = equipe.DateCreation,
                LogoBase64 = equipe.Logo != null ? Convert.ToBase64String(equipe.Logo) : null,
                NombreJoueurs = equipe.NombreJoueurs,
                Capitaine = equipe.Capitaine
            });
        }

        // PUT: api/Equipes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEquipe(int id, EquipeUpdateDTO equipeDto)
        {
            var equipe = await _equipeRepository.GetEquipeByIdAsync(id);
            if (equipe == null)
            {
                return NotFound();
            }

            equipe.Nom = equipeDto.Nom;
            equipe.DateCreation = equipeDto.DateCreation;
            equipe.NombreJoueurs = equipeDto.NombreJoueurs;
            equipe.Capitaine = equipeDto.Capitaine;

            if (!string.IsNullOrEmpty(equipeDto.LogoBase64))
            {
                equipe.Logo = Convert.FromBase64String(equipeDto.LogoBase64);
            }

            await _equipeRepository.UpdateEquipeAsync(equipe);

            return NoContent();
        }

        // DELETE: api/Equipes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipe(int id)
        {
            if (!await _equipeRepository.EquipeExistsAsync(id))
            {
                return NotFound();
            }

            try
            {
                await _equipeRepository.DeleteEquipeAsync(id);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la suppression de l'équipe {id}: {ex.Message}");
                return StatusCode(500, "Erreur serveur : impossible de supprimer cette équipe.");
            }

            return NoContent();
        }

        // GET: api/Equipes/5/Tournois
        [HttpGet("{id}/Tournois")]
        public async Task<ActionResult<IEnumerable<TournoiDTO>>> GetTournoisByEquipeId(int id)
        {
            if (!await _equipeRepository.EquipeExistsAsync(id))
            {
                return NotFound();
            }

            var tournois = await _equipeRepository.GetTournoisByEquipeIdAsync(id);
            var tournoiDtos = new List<TournoiDTO>();

            foreach (var tournoi in tournois)
            {
                tournoiDtos.Add(new TournoiDTO
                {
                    ID_Tournoi = tournoi.ID_Tournoi,
                    Nom = tournoi.Nom,
                    DateDebut = tournoi.DateDebut,
                    DateFin = tournoi.DateFin,
                    NbEquipesMax = tournoi.NbEquipesMax,
                    Statut = tournoi.Statut,
                    Reglement = tournoi.Reglement
                });
            }

            return Ok(tournoiDtos);
        }

        // POST: api/Equipes/5/Tournois/1
        [HttpPost("{equipeId}/Tournois/{tournoiId}")]
        public async Task<IActionResult> AddEquipeToTournoi(int equipeId, int tournoiId)
        {
            if (!await _equipeRepository.EquipeExistsAsync(equipeId))
            {
                return NotFound("Équipe non trouvée");
            }

            var result = await _equipeRepository.AddEquipeToTournoiAsync(equipeId, tournoiId);
            if (!result)
            {
                return BadRequest("Impossible d'ajouter l'équipe au tournoi");
            }

            return NoContent();
        }

        // DELETE: api/Equipes/5/Tournois/1
        [HttpDelete("{equipeId}/Tournois/{tournoiId}")]
        public async Task<IActionResult> RemoveEquipeFromTournoi(int equipeId, int tournoiId)
        {
            if (!await _equipeRepository.EquipeExistsAsync(equipeId))
            {
                return NotFound("Équipe non trouvée");
            }

            var result = await _equipeRepository.RemoveEquipeFromTournoiAsync(equipeId, tournoiId);
            if (!result)
            {
                return BadRequest("Impossible de retirer l'équipe du tournoi");
            }

            return NoContent();
        }
    }
}
