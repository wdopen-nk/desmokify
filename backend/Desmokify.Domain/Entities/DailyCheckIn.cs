namespace Desmokify.Domain.Entities;

public class DailyCheckIn
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public int CigarettesSmoked { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public User User { get; set; } = null!;
}