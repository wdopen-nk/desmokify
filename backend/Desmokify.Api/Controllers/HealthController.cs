using Microsoft.AspNetCore.Mvc;

namespace Desmokify.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHealthStatus()
        {
            return Ok(new 
            { 
                status = "Healthy",
                service = "Desmokify API",
            });
        }
    }
}