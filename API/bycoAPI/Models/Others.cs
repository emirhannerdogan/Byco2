using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace bycoAPI.Models
{
    public class Others
    {
        [Key]
        public int id { get; set; }
        public string position { get; set; }
        public string text { get; set; }
    }

}