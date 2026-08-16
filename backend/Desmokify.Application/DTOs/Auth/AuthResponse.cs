namespace Desmokify.Application.DTOs.Auth;

public class AuthResponse
{
    public int UserId {get; set;}
    public string Name {get; set;} = string.Empty;
    public string Email {get; set;} = string.Empty;
    public string AccessToken {get; set;} = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}