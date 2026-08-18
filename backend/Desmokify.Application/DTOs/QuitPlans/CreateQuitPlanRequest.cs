namespace Desmokify.Application.DTOs.QuitPlans;

public class CreateQuitPlanRequest
{
    public DateTime QuitDate {get; set;}
    public int CigarettesPerDay {get; set;}
    public int CigarettesPerPack {get; set;}
    public decimal PackPrice {get; set;}
}