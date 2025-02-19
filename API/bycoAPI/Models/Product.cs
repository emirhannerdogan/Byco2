using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace bycoAPI.Models
{
    public class Product
    {
        [Key]
        public int id { get; set; }
        public string ad { get; set; }
        public string aciklama { get; set; }
        public string kod { get; set; }
        public int stok { get; set; }
        public decimal fiyat { get; set; }
        public string kategori { get; set; }
        public string? img { get; set; }
        public string? amper { get; set; }
        public string? aydinlatmaturu { get; set; }
        public string? cerceve { get; set; }
        public string? damarsayisi { get; set; }
        public string? disKilifrengi { get; set; }
        public string? duy { get; set; }
        public string? isikrengi { get; set; }
        public string? kablotipi { get; set; }
        public string? kablouzunlugu { get; set; }
        public string? kanalboyutu { get; set; }
        public string? kanalozelligi { get; set; }
        public string? kanalrengi { get; set; }
        public string? kasarengi { get; set; }
        public string? kesit { get; set; }
        public string? kesmekapasitesi { get; set; }
        public string? kullanimyeri { get; set; }
        public string? kutup { get; set; }
        public string? marka { get; set; }
        public string? model { get; set; }
        public string? prizsayisi { get; set; }
        public string? renk { get; set; }
        public string? renksicakligikelvin { get; set; }
        public string? sigortasayisi { get; set; }
        public string? tip { get; set; }
        public string? tur { get; set; }
        public string? urun { get; set; }
        public string? urunozelligi { get; set; }
        public string? uruntipi { get; set; }
        public string? watt { get; set; }
        public int? indirim { get; set; }
    }

}