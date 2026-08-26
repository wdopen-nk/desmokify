using Desmokify.Application.DTOs.DailyCheckIns;
using Desmokify.Application.Interfaces;
using Desmokify.Domain.Entities;
using Desmokify.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Desmokify.Infrastructure.Services;

public class DailyCheckInService : IDailyCheckInService
{
    private readonly DesmokifyDbContext _context;

    public DailyCheckInService(
        DesmokifyDbContext context)
    {
        _context = context;
    }

    public async Task<DailyCheckInResponse> CreateAsync(
        int userId,
        CreateDailyCheckInRequest request)
    {
        if (request.CigarettesSmoked < 0)
        {
            throw new ArgumentException(
                "Cigarettes smoked cannot be negative.");
        }

        var today = DateTime.UtcNow.Date;

        var existingCheckIn =
            await _context.DailyCheckIns
                .FirstOrDefaultAsync(d =>
                    d.UserId == userId &&
                    d.Date == today);

        if (existingCheckIn != null)
        {
            throw new InvalidOperationException(
                "Today's check-in already exists.");
        }

        var checkIn = new DailyCheckIn
        {
            UserId = userId,
            Date = today,
            CigarettesSmoked =
                request.CigarettesSmoked,
            Note = request.Note,
            CreatedAt = DateTime.UtcNow
        };

        _context.DailyCheckIns.Add(checkIn);

        await _context.SaveChangesAsync();

        return MapToResponse(checkIn);
    }

    public async Task<DailyCheckInResponse?>
        GetTodayAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;

        var checkIn =
            await _context.DailyCheckIns
                .FirstOrDefaultAsync(d =>
                    d.UserId == userId &&
                    d.Date == today);

        return checkIn == null
            ? null
            : MapToResponse(checkIn);
    }

    private static DailyCheckInResponse
        MapToResponse(DailyCheckIn checkIn)
    {
        return new DailyCheckInResponse
        {
            Id = checkIn.Id,
            Date = checkIn.Date,
            CigarettesSmoked =
                checkIn.CigarettesSmoked,
            Note = checkIn.Note,
            CreatedAt = checkIn.CreatedAt
        };
    }
}