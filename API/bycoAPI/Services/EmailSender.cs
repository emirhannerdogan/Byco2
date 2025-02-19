using MailKit.Security;
using bycoAPI.Interfaces;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;
using bycoAPI.Models;

namespace bycoAPI.Services
{
    public class EmailSender:IEmailSender
    {
        public EmailSender(){}
        public async Task Send(Message message)
        {
            var obj = new MimeMessage();
            obj.From.Add(new MailboxAddress("BYCO", "info@byco.com.tr"));
            obj.To.AddRange(message.To);
            obj.Subject = message.Subject;
            obj.Body = new TextPart(TextFormat.Html)
            {
                Text = message.Content
            };

            SecureSocketOptions secureSocket = SecureSocketOptions.None;
            using (var client = new SmtpClient())
            {
                // switch ("TLS")
                // {
                //     case "STARTTLS":
                //         secureSocket = SecureSocketOptions.StartTls;
                //         break;
                //     case "TLS":
                //         secureSocket = SecureSocketOptions.SslOnConnect;
                //         break;
                //     default:
                //         break;
                // }
                secureSocket = SecureSocketOptions.SslOnConnect;
                //client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                client.Connect("mail.kurumsaleposta.com", 465, secureSocket);
                //Remove any OAuth functionality
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                //client.Authenticate("contact@byco.com.tr", "wsxrfv23LS.-!");
                client.Authenticate("info@byco.com.tr", "wsxrfv23LS.-!");
                client.Send(obj);
                client.Disconnect(true);
            }

        }

        
    }
}
