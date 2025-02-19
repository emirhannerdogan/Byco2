using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace bycoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorController : ControllerBase
    {
        // Bankadan gelen hata verilerini karşılayacak olan endpoint
        [HttpPost("process-error")]
        public async Task<IActionResult> ProcessError([FromForm] BankErrorModel errorData)
        {
            if (errorData == null)
            {
                return BadRequest("Geçersiz hata verisi.");
            }

            // Hata verilerini işleyin veya loglayın
            await LogErrorAsync(errorData);

            // Kullanıcıya hata mesajını göster
            return Ok(new
            {
                Message = "İşlem başarısız oldu.",
                ErrorMessage = errorData.MdErrorMessage,
                MdStatus = errorData.MdStatus,
                ProcReturnCode = errorData.ProcReturnCode
            });
        }

        // Hata verilerini loglamak için basit bir metot
        private Task LogErrorAsync(BankErrorModel errorData)
        {
            // Burada hata verilerini bir dosyaya, veritabanına veya log sistemine kaydedebilirsiniz.
            // Örnek: Basitçe Console'a yazdırma
            Console.WriteLine($"Hata Kodu: {errorData.ProcReturnCode}, MdStatus: {errorData.MdStatus}, Mesaj: {errorData.MdErrorMessage}");
            return Task.CompletedTask;
        }
    }

    // Bankadan dönen hata verilerini temsil eden model
    public class BankErrorModel
    {
        [FromForm(Name = "mdstatus")]
        public string MdStatus { get; set; }

        [FromForm(Name = "mderrormessage")]
        public string MdErrorMessage { get; set; }

        [FromForm(Name = "procreturncode")]
        public string ProcReturnCode { get; set; }

        [FromForm(Name = "response")]
        public string Response { get; set; }

        [FromForm(Name = "orderid")]
        public string OrderId { get; set; }
    }
}
