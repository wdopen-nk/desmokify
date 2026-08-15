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
}