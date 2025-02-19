using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace bycoAPI.Models
{
    [Keyless]
    public class MailRequest
    {
        public string isim { get; set; }
        public string email { get; set; }
        public string konu { get; set; }
        public string mesaj { get; set; }
    }
}
