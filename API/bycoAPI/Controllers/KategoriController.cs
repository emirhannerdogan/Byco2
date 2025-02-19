using bycoAPI.Interfaces;
using bycoAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Utils;

namespace bycoAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class KategoriController : ControllerBase {
        readonly ICategoryService _service;
        readonly IUserServices _userService;
        readonly ITokenService _tokenService;

        public KategoriController(ICategoryService service, IUserServices userServices,ITokenService tokenService) {
            _service = service;
            _userService = userServices;
            _tokenService = tokenService;
        }
        
        [AllowAnonymous]
        [HttpGet("GetAll")]
        public async Task<List<Category>> GetAll() {
            var result = await _service.GetAll();
            return result;
        }


        [AllowAnonymous]
        [HttpGet("GetAllValueText/{urunturu}")]
        public async Task<List<Category>> GetAllValueText(string urunturu) {
            return await _service.GetCategoryByUrunTuru(urunturu);
        }


        
        [HttpPost("Add")]
        public async Task<ActionResult> AddKategori([FromBody]Category category) {
            string token = Request.Headers["Authorization"];
            token = token.Substring(7);
            string email = await _tokenService.decodeKey(token);
            User user = await _userService.GetUserByEmail(email);
            if(user.tip == 0) return Ok(await _service.Add(category));
            return Unauthorized();
            //return Ok(await _service.Add(category));
        }
        
        
        [HttpDelete("Delete")]
        public async Task<ActionResult> DeleteKategori([FromBody]int kategori_id) {
            string token = Request.Headers["Authorization"];
            token = token.Substring(7);
            string email = await _tokenService.decodeKey(token);
            User user = await _userService.GetUserByEmail(email);
            if(user.tip == 0) return Ok(await _service.Delete(kategori_id));
            return Unauthorized();
            //return Ok(await _service.Delete(kategori_id));
        }

    }
}
