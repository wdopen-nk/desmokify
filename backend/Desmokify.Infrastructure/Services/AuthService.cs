using Desmokify.Application.DTOs.Auth;
using Desmokify.Application.Interfaces;
using Desmokify.Domain.Entities;
using Desmokify.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Desmokify.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly DesmokifyDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthService(
        DesmokifyDbContext context,
        ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<AuthResponse> RegisterAsync(
        RegisterRequest request)
    {
        var email = request.Email
            .Trim()
            .ToLowerInvariant();

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (existingUser != null)
        {
            throw new InvalidOperationException(
                "A user with this email already exists.");
        }

        var user = new User
        {
            Name = request.Name.Trim(),
            Email = email,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            request.Password);

        user.RefreshToken =
            _tokenService.GenerateRefreshToken();

        user.RefreshTokenExpiryTime =
            _tokenService.GetRefreshTokenExpiry();

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(
        LoginRequest request)
    {
        var email = request.Email
            .Trim()
            .ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            throw new UnauthorizedAccessException(
                "Invalid email or password.");
        }

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password);

        if (result == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException(
                "Invalid email or password.");
        }

        user.RefreshToken =
            _tokenService.GenerateRefreshToken();

        user.RefreshTokenExpiryTime =
            _tokenService.GetRefreshTokenExpiry();

        await _context.SaveChangesAsync();

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponse> RefreshTokenAsync(
        string refreshToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.RefreshToken == refreshToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException(
                "Invalid refresh token.");
        }

        if (user.RefreshTokenExpiryTime == null ||
            user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException(
                "Refresh token has expired.");
        }

        // Rotate refresh token
        user.RefreshToken =
            _tokenService.GenerateRefreshToken();

        user.RefreshTokenExpiryTime =
            _tokenService.GetRefreshTokenExpiry();

        await _context.SaveChangesAsync();

        return CreateAuthResponse(user);
    }

    public async Task<UserResponse?> GetCurrentUserAsync(
        int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return null;
        }

        return new UserResponse
        {
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email
        };
    }

    private AuthResponse CreateAuthResponse(User user)
    {
        return new AuthResponse
        {
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            AccessToken = _tokenService.GenerateAccessToken(user),
            RefreshToken = user.RefreshToken!
        };
    }
}