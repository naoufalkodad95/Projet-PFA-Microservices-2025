//namespace UsersService.Services
//{
//    public interface ITokenStorageService
//    {
//        void SetToken(string token, HttpContext context);
//        string? GetToken(HttpContext context);
//        void ClearToken(HttpContext context);
//    }
//}

//namespace UsersService.Services
//{
//    public interface ITokenStorageService
//    {
//        void SetToken(string token, HttpContext context);
//        string? GetToken(HttpContext context);
//        void ClearToken(HttpContext context);
//    }
//}
using UsersService.Models;
namespace UsersService.Services.Token
{
    public interface IJwtTokenService
    {
        string GenerateJwtToken(Utilisateur user);
    }
}