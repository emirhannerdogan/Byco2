using bycoAPI.Interfaces;
using bycoAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace bycoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UrunController : ControllerBase
    {
        readonly IUrunService _service;
        readonly IUserServices _userService;
        readonly ITokenService _tokenService;

        public UrunController(IUrunService service, ITokenService tokenService, IUserServices userServices)
        {
            _service = service;
            _userService = userServices;
            _tokenService = tokenService;
        }

        [HttpGet("GetById/{id}")]
        [AllowAnonymous]
        public async Task<Product> GetUrunById(int id)
        {
            var result = await _service.GetUrunByIdAsync(id);

            return result;
        }

        [HttpGet("GetAll")]
        [AllowAnonymous]
        public async Task<List<Product>> GetAll()
        {
            return await _service.GetAllUrun();
        }

        [HttpGet("GetProductByCategory/{category}")]
        [AllowAnonymous]
        public async Task<List<Product>> GetProductByCategory(string category)
        {
            return await _service.GetProductsByCategory(category);
        }

        [HttpPost("Add")]
        [AllowAnonymous]
        public async Task<RequestResponse> AddUrun([FromBody] Product product)
        {

            string token = Request.Headers["Authorization"];

            token = token.Substring(7);
            string email = await _tokenService.decodeKey(token);
            User user = await _userService.GetUserByEmail(email);

            if (user.tip == 0)
            {
               return await _service.AddUrun(product);
            }
            else return new RequestResponse{StatusCode=401,ReasonString="unauthorized"};
        }

        [HttpPut("Update/{urun_id}")]
        public async Task<RequestResponse> UpdateUrun(int urun_id, [FromBody] Product body)
        {
            string token = Request.Headers["Authorization"];

            token = token.Substring(7);
            string email = await _tokenService.decodeKey(token);
            User user = await _userService.GetUserByEmail(email);

            if (user.tip == 0)
            {
                return await _service.UpdateUrun(urun_id, body);
            }
            else return new RequestResponse{StatusCode=401,ReasonString="unauthorized"};
        }

        [HttpPut("UpdateWithEntityName")]
        public async Task<RequestResponse> Update([FromBody] UpdateModel um)
        {
            string token = Request.Headers["Authorization"];

            token = token.Substring(7);
            string email = await _tokenService.decodeKey(token);
            User user = await _userService.GetUserByEmail(email);

            if (user.tip == 0)
            {
                return await _service.Update(um);
            }
            else return new RequestResponse{StatusCode=401,ReasonString="unauthorized"};
            //return await _service.Update(um);
        }

        [HttpDelete("Delete/{barkod}")]
        public async Task<RequestResponse> DeleteUrun(string barkod)
        {
            string token = Request.Headers["Authorization"];

            token = token.Substring(7);
            string email = await _tokenService.decodeKey(token);
            User user = await _userService.GetUserByEmail(email);

            if (user.tip == 0)
            {
                return await _service.DeleteUrun(barkod);
                
            }
            else return new RequestResponse{StatusCode=401,ReasonString="unauthorized"};
        }
    }
}
