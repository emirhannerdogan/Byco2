using bycoAPI.Interfaces;
using bycoAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Utils;

namespace bycoAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OthersController : ControllerBase {
        readonly IUserServices _userService;
        readonly ITokenService _tokenService;
        readonly IOtherService _otherService;

        public OthersController(IOtherService otherService, IUserServices userServices,ITokenService tokenService) {
            _userService = userServices;
            _tokenService = tokenService;
            _otherService = otherService;
        }
        
        [AllowAnonymous]
        [HttpGet("Get")]
        public async Task<List<Others>> GetAll(){
            return await _otherService.GetAll();

        }


        [HttpPut("Change")]
        public async Task<RequestResponse> Update([FromBody] Others um)
        {
            string token = Request.Headers["Authorization"];

            token = token.Substring(7);
            string email = await _tokenService.decodeKey(token);
            User user = await _userService.GetUserByEmail(email);

            if (user.tip == 0)
            {
                return await _otherService.Update(um);
            }
            else return new RequestResponse{StatusCode=401,ReasonString="unauthorized"};
            //return await _service.Update(um);
        }

        

    }
}
