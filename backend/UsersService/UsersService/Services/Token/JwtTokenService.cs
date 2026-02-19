using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UsersService.Models;
using UsersService.Services.Token;



public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _config;

    public JwtTokenService(IConfiguration config)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
    }

    public string GenerateJwtToken(Utilisateur user)
    {
        if (user == null)
            throw new ArgumentNullException(nameof(user));

        var IsCapitaine = false;
        if (user is Joueur joueur)
        {
            IsCapitaine = joueur.IsCapitaine;
        }

        var claims = new[]
        {
                new Claim(JwtRegisteredClaimNames.Sub, user.Login),
                new Claim(JwtRegisteredClaimNames.NameId, user.ID_Utilisateur.ToString()), // Standard claim for user ID
                new Claim(ClaimTypes.GivenName, user.Prenom),
                new Claim(ClaimTypes.Surname, user.Nom),
                new Claim(ClaimTypes.Role, user.TypeUtilisateur.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("PhotoProfil", user.PhotoProfil ?? ""),
                new Claim("IsCapitaine", IsCapitaine.ToString()), // Ajout du champ isCapitan

            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        var keyString = _config["Jwt:Key"];
        if (string.IsNullOrEmpty(keyString))
            throw new Exception("JWT Key not configured in appsettings.json");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
