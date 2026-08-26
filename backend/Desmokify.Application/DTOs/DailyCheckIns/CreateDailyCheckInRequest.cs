namespace Desmokify.Application.DTOs.DailyCheckIns;

public class CreateDailyCheckInRequest
{
    public int CigarettesSmoked { get; set; }
    public string? Note { get; set; }
}