using Desmokify.Application.DTOs.DailyCheckIns;

namespace Desmokify.Application.Interfaces;

public interface IDailyCheckInService
{
    Task<DailyCheckInResponse> CreateAsync(
        int userId,
        CreateDailyCheckInRequest request
    );

    Task<DailyCheckInResponse?> GetTodayAsync(
        int userId
    );

    Task<DailyCheckInStatisticsResponse> GetStatisticsAsync(
        int userId
    );
}