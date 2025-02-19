using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace bycoAPI.Models
{
    
    public class Siparis
    {
        [Key]
        public int siparis_id {get; set;}
        public string siparisno {get;set;}
        public string ad {get;set;}
        public string mail {get;set;}
        public string telefon {get;set;}
        public string faturaadresi {get;set;}
        public string teslimatadresi { get; set; }
        public DateTime tarih { get; set; }
        public string? durum {get;set;}
        public string urunler {get;set;}
        public string fiyat {get;set;}
        public string? tcknvkn { get; set; }
    }
}
