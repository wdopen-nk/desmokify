namespace Desmokify.Application.DTOs.Auth;

public class UserResponse
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}