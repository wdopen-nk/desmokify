namespace Desmokify.Domain.Entities;

public class User
{
    public int Id {get; set;}
    public string Email {get; set;} = string.Empty;
    public string PasswordHash {get; set;} = string.Empty;
    public string Name {get; set;} = string.Empty;
    public DateTime CreatedAt {get; set;}
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
}