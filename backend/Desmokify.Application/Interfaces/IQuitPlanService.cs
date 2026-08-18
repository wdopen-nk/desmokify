using Desmokify.Application.DTOs.QuitPlans;

namespace Desmokify.Application.Interfaces;

public interface IQuitPlanService
{
    Task<QuitPlanResponse> CreateAsync(
        int userId,
        CreateQuitPlanRequest request);

    Task<QuitPlanResponse?> GetAsync(int userId);

    Task<QuitPlanResponse> UpdateAsync(
        int userId,
        CreateQuitPlanRequest request);
}