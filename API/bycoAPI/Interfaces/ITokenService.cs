using bycoAPI.Models;

namespace bycoAPI.Interfaces
{
    public interface ITokenService
    {
        public Task<GenerateTokenResponse> GenerateToken(GenerateTokenRequest request);
        public Task<string> decodeKey(string token);
    }
}
