using Desmokify.Application.DTOs.Auth;

namespace Desmokify.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task<UserResponse?> GetCurrentUserAsync(int userId);
}