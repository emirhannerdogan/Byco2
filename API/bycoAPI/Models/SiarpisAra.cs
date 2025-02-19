using System.ComponentModel.DataAnnotations;

namespace bycoAPI.Models
{
    public class SiarpisAra
    {
        [Key]
        public int id { get; set; }
        public string siparisno { get; set; }
        public string aramano { get; set; }
    }
}
