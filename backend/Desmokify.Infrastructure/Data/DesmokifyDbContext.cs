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
    }
}