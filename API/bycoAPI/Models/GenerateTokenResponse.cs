namespace bycoAPI.Models
{
    public class GenerateTokenResponse
    {
        public string Token { get; set; }
        public DateTime TokenExpirationDate { get; set; }
    }
}