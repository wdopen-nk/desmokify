using Desmokify.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Desmokify.Infrastructure.Data;

public class DesmokifyDbContext : DbContext
{
    public DesmokifyDbContext(DbContextOptions<DesmokifyDbContext> options) 
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<QuitPlan> QuitPlans => Set<QuitPlan>();
    public DbSet<DailyCheckIn> DailyCheckIns => Set<DailyCheckIn>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasOne(u => u.QuitPlan)
            .WithOne(q => q.User)
            .HasForeignKey<QuitPlan>(q => q.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<QuitPlan>()
            .Property(q => q.PackPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<QuitPlan>()
            .HasIndex(q => q.UserId)
            .IsUnique();

        modelBuilder.Entity<DailyCheckIn>()
            .HasOne(d => d.User)
            .WithMany()
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<DailyCheckIn>()
            .HasIndex(d => new
            {
                d.UserId,
                d.Date
            })
            .IsUnique();
    }
}