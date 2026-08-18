using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Desmokify.Application.DTOs.QuitPlans;
using Desmokify.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Desmokify.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class QuitPlansController : ControllerBase
{
    private readonly IQuitPlanService _quitPlanService;

    public QuitPlansController(
        IQuitPlanService quitPlanService)
    {
        _quitPlanService = quitPlanService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateQuitPlanRequest request)
    {
        var userId = GetUserId();

        try
        {
            var plan = await _quitPlanService
                .CreateAsync(userId, request);

            return CreatedAtAction(
                nameof(Get),
                plan);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = GetUserId();

        var plan = await _quitPlanService.GetAsync(userId);

        if (plan == null)
        {
            return NotFound(new
            {
                message = "Quit plan not found."
            });
        }

        return Ok(plan);
    }

    [HttpPut]
    public async Task<IActionResult> Update(
        CreateQuitPlanRequest request)
    {
        var userId = GetUserId();

        try
        {
            var plan = await _quitPlanService
                .UpdateAsync(userId, request);

            return Ok(plan);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }

    private int GetUserId()
    {
        var claim =
            User.FindFirst(JwtRegisteredClaimNames.Sub)
            ?? User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null ||
            !int.TryParse(claim.Value, out var userId))
        {
            throw new UnauthorizedAccessException();
        }

        return userId;
    }
}