using System.ComponentModel.DataAnnotations;

namespace bycoAPI.Models
{
    
    public class HizliSiparis
    {
        public string aliciAdi {get; set;}
        public string tcknvkn {get;set;}
        public string telefon {get;set;}
        public string bireysel_kurumsal {get;set;}
        public string? teslimatAdresi { get; set; }
        public string? faturaAdresi{get;set;}
        public string? gecicino { get; set; }
        public List<OdemeUrun> urunler {get;set;}
        public string? CustomerEmailAddress { get; set; }
        public string? CustomerIpAddress { get; set; }
        public ulong TxnAmount { get; set; }
        public string? CardHolderName { get; set; }
        public string? CardNumber { get; set; }
        public string? CardExpireDateMonth { get; set; }
        public string? CardExpireDateYear { get; set; }
        public string? CardCvv2 { get; set; }

    }
}