using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;

namespace UsersService.Services
{
    public class TokenStorageService : ITokenStorageService
    {
        private const string TokenKey = "AuthToken";
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<TokenStorageService> _logger;
        private readonly string _cookieDomain;

        public TokenStorageService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ILogger<TokenStorageService> logger)
        {
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _cookieDomain = configuration["CookieSettings:Domain"] ?? string.Empty; // Optionnel pour multi-domaines
        }

        public void SetToken(string token)
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null)
            {
                _logger.LogWarning("HttpContext is null, cannot set token.");
                return;
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, // Empêche l'accès via JS (sécurité XSS)
                Secure = true, // HTTPS obligatoire
                SameSite = SameSiteMode.Strict, // Empêche l’envoi automatique sur un autre domaine
                IsEssential = true, // Nécessaire pour être stocké même en mode RGPD
                Domain = !string.IsNullOrEmpty(_cookieDomain) ? _cookieDomain : null, // Gestion multi-domaines
                Expires = DateTime.UtcNow.AddHours(2) // Expire après 2h
            };

            context.Response.Cookies.Append(TokenKey, token, cookieOptions);
        }

        public string? GetToken()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null)
            {
                _logger.LogWarning("HttpContext is null, cannot get token.");
                return null;
            }

            // Vérifier si le token est présent dans les cookies
            if (context.Request.Cookies.TryGetValue(TokenKey, out var token))
            {
                return token;
            }

            // Vérifier si le token est présent dans l'en-tête Authorization (Bearer)
            if (context.Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                var tokenParts = authHeader.ToString().Split(" ");
                if (tokenParts.Length == 2 && tokenParts[0] == "Bearer")
                {
                    return tokenParts[1];
                }
            }

            return null;
        }

        public void ClearToken()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null)
            {
                _logger.LogWarning("HttpContext is null, cannot clear token.");
                return;
            }

            context.Response.Cookies.Delete(TokenKey);
        }

        public void SetToken(string token, HttpContext context)
        {
            throw new NotImplementedException();
        }

        public string? GetToken(HttpContext context)
        {
            throw new NotImplementedException();
        }

        public void ClearToken(HttpContext context)
        {
            throw new NotImplementedException();
        }
    }
}
