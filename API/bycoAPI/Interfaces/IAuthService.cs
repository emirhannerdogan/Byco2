using bycoAPI.Models;

namespace bycoAPI.Interfaces
{
    public interface IAuthService
    {
        public Task<LoginResp> LoginUserAsync(LoginReq request);
    }
}
