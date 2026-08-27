using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Desmokify.Application.DTOs.DailyCheckIns;
using Desmokify.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Desmokify.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DailyCheckInsController
    : ControllerBase
{
    private readonly IDailyCheckInService
        _dailyCheckInService;

    public DailyCheckInsController(
        IDailyCheckInService dailyCheckInService)
    {
        _dailyCheckInService =
            dailyCheckInService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateDailyCheckInRequest request)
    {
        var userId = GetUserId();

        try
        {
            var checkIn =
                await _dailyCheckInService
                    .CreateAsync(userId, request);

            return Ok(checkIn);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetToday()
    {
        var userId = GetUserId();

        var checkIn =
            await _dailyCheckInService
                .GetTodayAsync(userId);

        if (checkIn == null)
        {
            return NotFound(new
            {
                message = "Today's check-in not found."
            });
        }

        return Ok(checkIn);
    }

    private int GetUserId()
    {
        var claim =
            User.FindFirst(
                JwtRegisteredClaimNames.Sub)
            ?? User.FindFirst(
                ClaimTypes.NameIdentifier);

        if (
            claim == null ||
            !int.TryParse(
                claim.Value,
                out var userId))
        {
            throw new UnauthorizedAccessException();
        }

        return userId;
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
        var userId = GetUserId();

        try
        {
            var statistics =
                await _dailyCheckInService
                    .GetStatisticsAsync(userId);

            return Ok(statistics);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }
}