using bycoAPI.Interfaces;
using bycoAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Utils;

namespace bycoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase {
        readonly IUserServices userService;
        readonly ITokenService tokenService;

        public UserController(IUserServices userService, ITokenService tokenService)
        {
            this.userService = userService;
            this.tokenService = tokenService;
        }

        [HttpPost("SifremiUnuttum")]
        [AllowAnonymous]
        public async Task<RequestResponse> RegisterUser([FromBody] ForgotPass mail)
        {
            return await userService.ForgotPassword(mail.mail);
        }

        [HttpGet("GetUser")]
        public async Task<User> GetUser()
        {
            string token = Request.Headers["Authorization"];

            token = token.Substring(7);
            string email = await tokenService.decodeKey(token);
            User user = await userService.GetUserByEmail(email);
            return await userService.GetUserAsync(user.user_id);
        }

        [AllowAnonymous]
        [HttpPost("RegisterUser")]
        public async Task<RequestResponse> RegisterUser([FromBody] User user)
        {
            return await userService.UserKaydet(user);
        }

        [HttpPut("Update")]
        public async Task<RequestResponse> UpdateUser([FromBody] User body)
        {
            string token = Request.Headers["Authorization"];

            token = token.Substring(7);
            string email = await tokenService.decodeKey(token);
            User user = await userService.GetUserByEmail(email);

            if (user.user_id == body.user_id)
            {
                return await userService.UpdateUser(body);
            }
            else if(user.tip == 0){
                return await userService.UpdateUser(body);

            }
            else return new RequestResponse{StatusCode=401,ReasonString="unauthorized"};
        }

        [HttpPut("UpdatePassword")]
        public async Task<RequestResponse> UpdatePassword([FromBody] string password)
        {
            string token = Request.Headers["Authorization"];

            token = token.Substring(7);
            string email = await tokenService.decodeKey(token);
            User user = await userService.GetUserByEmail(email);

            if (user != null)
            {
                return await userService.UpdatePassword(password,user.user_id);
            }
            else return new RequestResponse{StatusCode=401,ReasonString="unauthorized"};
        }
        [AllowAnonymous]

        [HttpGet("GetAll")]
        public async Task<List<User>> GetAll() {
            string token = Request.Headers["Authorization"];

            token = token.Substring(7);
            string email = await tokenService.decodeKey(token);
            User user = await userService.GetUserByEmail(email);
            if (user.tip == 0)
            {
                return await userService.GetUserInfoForAdmin();
    
            }
            else return [];
        }

    }
}
