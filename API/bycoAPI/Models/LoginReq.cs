using Microsoft.EntityFrameworkCore;

namespace bycoAPI.Models
{   
    [Keyless]
    public class LoginReq
    {
        public string email { get; set; }
        public string password { get; set; }
    }
}
