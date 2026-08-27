namespace Desmokify.Application.DTOs.DailyCheckIns;

public class DailyCheckInStatisticsResponse
{
    public int DaysSinceQuit {get; set;}
    public int SmokeFreeDays {get; set;}
    public int CurrentStreak {get; set;}
    public int LongestStreak {get; set;}
    public int TotalCheckIns {get; set;}
    public int CigarettesAvoided {get; set;}
    public decimal MoneySaved {get; set;}
    public decimal AverageCigarettesPerDay {get; set;}
}