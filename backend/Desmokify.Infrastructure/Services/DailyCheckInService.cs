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


    public async Task<DailyCheckInStatisticsResponse> GetStatisticsAsync(int userId)
    {
        var quitPlan = await _context.QuitPlans
            .FirstOrDefaultAsync(q => q.UserId == userId);

        
        if (quitPlan == null)
        {
            throw new KeyNotFoundException(
                "Quit plan not found."
            );
        }


        var today = DateTime.UtcNow.Date;
        var quitDate = quitPlan.QuitDate.Date;

        var checkIns = await _context.DailyCheckIns
            .Where(d => 
                d.UserId == userId &&
                d.Date >= quitDate &&
                d.Date <= today)
            .OrderBy(d => d.Date)
            .ToListAsync();

        var daysSinceQuit =
            quitDate > today ? 0 : (today - quitDate).Days + 1;

        var totalCheckIns = checkIns.Count;
        var smokeFreeDays = checkIns.Count(d => d.CigarettesSmoked == 0);

        var totalCigarettesSmoked = checkIns.Sum(d => d.CigarettesSmoked);
        var expectedCigarettes = daysSinceQuit * quitPlan.CigarettesPerDay;

        var cigarettesAvoided =
            Math.Max(
                0,
                expectedCigarettes - totalCigarettesSmoked
            );
        
        var moneySaved =
            quitPlan.CigarettesPerPack > 0
                ? (decimal)cigarettesAvoided / quitPlan.CigarettesPerPack * quitPlan.PackPrice
                : 0;
        
        var averageCigarettesPerDay =
            totalCheckIns > 0
                ? (decimal)totalCigarettesSmoked / totalCheckIns
                : 0;

        var currentStreak = CalculateCurrentStreak(checkIns);
        var longestStreak = CalculateLongestStreak(checkIns);

        return new DailyCheckInStatisticsResponse
        {
            DaysSinceQuit = daysSinceQuit,
            SmokeFreeDays = smokeFreeDays,
            CurrentStreak = currentStreak,
            LongestStreak = longestStreak,
            TotalCheckIns = totalCheckIns,
            CigarettesAvoided = cigarettesAvoided,
            MoneySaved = Math.Round(
                moneySaved,
                2),
            AverageCigarettesPerDay = Math.Round(
                averageCigarettesPerDay,
                2)
        };
    }


    private static int CalculateCurrentStreak(
        List<DailyCheckIn> checkIns)
    {
        var today = DateTime.UtcNow.Date;

        var checkInByDate = checkIns
            .ToDictionary(
                d => d.Date.Date,
                d => d.CigarettesSmoked);

        var streak = 0;
        var date = today;

        while (
            checkInByDate.TryGetValue(
                date,
                out var cigarettesSmoked))
        {
            if (cigarettesSmoked != 0)
            {
                break;
            }

            streak++;

            date = date.AddDays(-1);
        }

        return streak;
    }


    private static int CalculateLongestStreak(
        List<DailyCheckIn> checkIns)
    {
        var longestStreak = 0;
        var currentStreak = 0;

        DateTime? previousDate = null;

        foreach (
            var checkIn in checkIns.OrderBy(d => d.Date))
        {
            if (checkIn.CigarettesSmoked != 0)
            {
                currentStreak = 0;
                previousDate = checkIn.Date.Date;
                continue;
            }

            if (
                previousDate.HasValue &&
                checkIn.Date.Date ==
                previousDate.Value.AddDays(1))
            {
                currentStreak++;
            }
            
            else
            {
                currentStreak = 1;
            }

            longestStreak =
                Math.Max(
                    longestStreak,
                    currentStreak);

            previousDate =
                checkIn.Date.Date;
        }

        return longestStreak;
    }
}