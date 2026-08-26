namespace Desmokify.Application.DTOs.DailyCheckIns;

public class DailyCheckInResponse
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int CigarettesSmoked { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}