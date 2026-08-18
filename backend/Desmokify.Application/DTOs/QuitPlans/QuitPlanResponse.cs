namespace Desmokify.Application.DTOs.QuitPlans;

public class QuitPlanResponse
{
    public int Id {get; set;}
    public DateTime QuitDate {get; set;}
    public int CigarettesPerDay {get; set;}
    public int CigarettesPerPack {get; set;}
    public decimal PackPrice {get; set;}
    public DateTime CreatedAt {get; set;}
}