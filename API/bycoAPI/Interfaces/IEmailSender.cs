using bycoAPI.Services;

namespace bycoAPI.Interfaces
{
    public interface IEmailSender
    {
        public Task Send(Message message);
    }
}
