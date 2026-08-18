namespace Desmokify.Domain.Entities;

public class QuitPlan
{
    public int Id {get; set;}
    public int UserId {get; set;}
    public DateTime QuitDate {get; set;}
    public int CigarettesPerDay {get; set;}
    public int CigarettesPerPack {get; set;}
    public decimal PackPrice {get; set;}
    public DateTime CreatedAt {get; set;}
    public User User {get; set;} = null!;
}