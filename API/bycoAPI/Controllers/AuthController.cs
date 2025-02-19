using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using bycoAPI.Models;
using bycoAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace bycoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        readonly IAuthService authService;

        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("LoginUser")]
        public async Task<ActionResult<LoginResp>> LoginUserAsync([FromBody] LoginReq request)
        {
            var result = await authService.LoginUserAsync(request);
            if (result == null)
            {
                return Unauthorized();
            }

            return Ok(result);
        }
    }
}
