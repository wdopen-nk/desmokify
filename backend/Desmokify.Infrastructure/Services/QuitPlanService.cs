using Desmokify.Application.DTOs.QuitPlans;
using Desmokify.Application.Interfaces;
using Desmokify.Domain.Entities;
using Desmokify.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Desmokify.Infrastructure.Services;

public class QuitPlanService : IQuitPlanService
{
    private readonly DesmokifyDbContext _context;

    public QuitPlanService(DesmokifyDbContext context)
    {
        _context = context;
    }

    public async Task<QuitPlanResponse> CreateAsync(
        int userId,
        CreateQuitPlanRequest request)
    {
        var existingPlan = await _context.QuitPlans
            .FirstOrDefaultAsync(q => q.UserId == userId);

        if (existingPlan != null)
        {
            throw new InvalidOperationException(
                "A quit plan already exists.");
        }

        var plan = new QuitPlan
        {
            UserId = userId,
            QuitDate = request.QuitDate,
            CigarettesPerDay = request.CigarettesPerDay,
            CigarettesPerPack = request.CigarettesPerPack,
            PackPrice = request.PackPrice,
            CreatedAt = DateTime.UtcNow
        };

        _context.QuitPlans.Add(plan);

        await _context.SaveChangesAsync();

        return MapToResponse(plan);
    }

    public async Task<QuitPlanResponse?> GetAsync(
        int userId)
    {
        var plan = await _context.QuitPlans
            .FirstOrDefaultAsync(q => q.UserId == userId);

        return plan == null
            ? null
            : MapToResponse(plan);
    }

    public async Task<QuitPlanResponse> UpdateAsync(
        int userId,
        CreateQuitPlanRequest request)
    {
        var plan = await _context.QuitPlans
            .FirstOrDefaultAsync(q => q.UserId == userId);

        if (plan == null)
        {
            throw new KeyNotFoundException(
                "Quit plan not found.");
        }

        plan.QuitDate = request.QuitDate;
        plan.CigarettesPerDay = request.CigarettesPerDay;
        plan.CigarettesPerPack = request.CigarettesPerPack;
        plan.PackPrice = request.PackPrice;

        await _context.SaveChangesAsync();

        return MapToResponse(plan);
    }

    private static QuitPlanResponse MapToResponse(
        QuitPlan plan)
    {
        return new QuitPlanResponse
        {
            Id = plan.Id,
            QuitDate = plan.QuitDate,
            CigarettesPerDay = plan.CigarettesPerDay,
            CigarettesPerPack = plan.CigarettesPerPack,
            PackPrice = plan.PackPrice,
            CreatedAt = plan.CreatedAt
        };
    }
}