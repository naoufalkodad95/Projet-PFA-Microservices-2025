namespace UsersService.Services
{
    public interface ITokenStorageService
    {
        void SetToken(string token, HttpContext context);
        string? GetToken(HttpContext context);
        void ClearToken(HttpContext context);
    }
}
