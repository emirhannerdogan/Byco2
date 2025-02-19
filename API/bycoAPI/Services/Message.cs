using MimeKit;
using System.Collections.Generic;
using System.Linq;

namespace bycoAPI.Services
{
    public class Message
    {
        public Message(string[] to)
        {
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(o => new MailboxAddress("BYCO",o)));
        }
        public List<MailboxAddress> To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
    }
}
