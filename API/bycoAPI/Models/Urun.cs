using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace bycoAPI.Models
{
    
    public class Urun
    {
        [Key]
        public int urun_id { get; set; }
        public int stok { get; set; }
        public string ad { get; set; }
        public string aciklama { get; set; }
        public int kategori_id { get; set; }
        public string img { get; set; }
        public decimal fiyat { get; set;}
    }
}
