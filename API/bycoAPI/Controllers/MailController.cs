using bycoAPI.Interfaces;
using bycoAPI.Models;
using bycoAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace bycoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        readonly IEmailSender _emailSender;

        public MailController(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        

        [HttpPost("iletisim")]
        public async Task<IActionResult>  iletisimMail([FromBody] MailRequest mailRequest)
        {
            Message message = new Message(new string[] { "info@byco.com.tr" });
            message.Subject = mailRequest.konu;
            message.Content = mailRequest.mesaj + "<br><br>ALICI:" + mailRequest.isim + "<br>Bilgiler:" + mailRequest.email;
            await _emailSender.Send(message);
            return Ok();
        }

    }
}
