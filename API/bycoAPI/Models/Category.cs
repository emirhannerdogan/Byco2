using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace bycoAPI.Models
{
    
    public class Category
    {
        [Key]
        public int id { get; set; }
        public string ad { get; set; }
        public string? parent { get; set; }
        public string urunturu { get; set; }
    }
}
