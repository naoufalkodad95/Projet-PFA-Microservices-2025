using Microsoft.AspNetCore.Mvc;
using TournoiAPI.DTOs;
using TournoiAPI.Models;
using TournoiAPI.Repositories.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class ClassementsController : ControllerBase
{
    private readonly IClassementRepository _classementRepository;
    private readonly ITournoiRepository _tournoiRepository;

    public ClassementsController(IClassementRepository classementRepository, ITournoiRepository tournoiRepository)
    {
        _classementRepository = classementRepository;
        _tournoiRepository = tournoiRepository;
    }

    // GET: api/Classements
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClassementDTO>>> GetClassements()
    {
        var classements = await _classementRepository.GetAllClassementsAsync();
        var classementDtos = new List<ClassementDTO>();

        foreach (var classement in classements)
        {
            classementDtos.Add(new ClassementDTO
            {
                ID_Classement = classement.ID_Classement,
                Position = classement.Position,
                Points = classement.Points,
                DateMaj = classement.DateMaj,
                ID_Tournoi = classement.ID_Tournoi,
                ID_Equipe = classement.ID_Equipe,
                NomEquipe = classement.Equipe?.Nom
            });
        }

        return Ok(classementDtos);
    }

    // GET: api/Classements/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ClassementDTO>> GetClassement(int id)
    {
        var classement = await _classementRepository.GetClassementByIdAsync(id);

        if (classement == null)
        {
            return NotFound();
        }

        var classementDto = new ClassementDTO
        {
            ID_Classement = classement.ID_Classement,
            Position = classement.Position,
            Points = classement.Points,
            DateMaj = classement.DateMaj,
            ID_Tournoi = classement.ID_Tournoi,
            ID_Equipe = classement.ID_Equipe,
            NomEquipe = classement.Equipe?.Nom
        };

        return Ok(classementDto);
    }

    // GET: api/Classements/Tournoi/1/Equipe/2
    [HttpGet("Tournoi/{tournoiId}/Equipe/{equipeId}")]
    public async Task<ActionResult<ClassementDTO>> GetClassementByTournoiAndEquipe(int tournoiId, int equipeId)
    {
        var classement = await _classementRepository.GetClassementByTournoiAndEquipeAsync(tournoiId, equipeId);

        if (classement == null)
        {
            return NotFound();
        }

        var classementDto = new ClassementDTO
        {
            ID_Classement = classement.ID_Classement,
            Position = classement.Position,
            Points = classement.Points,
            DateMaj = classement.DateMaj,
            ID_Tournoi = classement.ID_Tournoi,
            ID_Equipe = classement.ID_Equipe,
            NomEquipe = classement.Equipe?.Nom
        };

        return Ok(classementDto);
    }

    // POST: api/Classements
    [HttpPost]
    public async Task<ActionResult<ClassementDTO>> PostClassement(ClassementCreateDTO classementDto)
    {
        // Vérifier si le tournoi existe
        if (!await _tournoiRepository.TournoiExistsAsync(classementDto.ID_Tournoi))
        {
            return BadRequest("Le tournoi spécifié n'existe pas");
        }

        var classement = new Classement
        {
            Position = classementDto.Position,
            Points = classementDto.Points,
            DateMaj = DateTime.Now,
            ID_Tournoi = classementDto.ID_Tournoi,
            ID_Equipe = classementDto.ID_Equipe
        };

        await _classementRepository.AddClassementAsync(classement);

        return CreatedAtAction(nameof(GetClassement), new { id = classement.ID_Classement }, new ClassementDTO
        {
            ID_Classement = classement.ID_Classement,
            Position = classement.Position,
            Points = classement.Points,
            DateMaj = classement.DateMaj,
            ID_Tournoi = classement.ID_Tournoi,
            ID_Equipe = classement.ID_Equipe
        });
    }

    // PUT: api/Classements/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutClassement(int id, ClassementUpdateDTO classementDto)
    {
        var classement = await _classementRepository.GetClassementByIdAsync(id);
        if (classement == null)
        {
            return NotFound();
        }

        classement.Position = classementDto.Position;
        classement.Points = classementDto.Points;
        classement.DateMaj = DateTime.Now;

        await _classementRepository.UpdateClassementAsync(classement);

        return NoContent();
    }

    // DELETE: api/Classements/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClassement(int id)
    {
        if (!await _classementRepository.ClassementExistsAsync(id))
        {
            return NotFound();
        }

        await _classementRepository.DeleteClassementAsync(id);

        return NoContent();
    }
}
