using bycoAPI.Models;
using Utils;

namespace bycoAPI.Interfaces
{
    public interface IUserServices
    {
        public Task<User> GetUserAsync(int id);//ok
        public Task<User> GetUserByEmail(string email);//ok
        public Task<RequestResponse> UserKaydet(User user);
        public Task<List<User>> GetUserInfoForAdmin();
        public bool CheckUserExist(LoginReq loginReq);
        public Task<RequestResponse> UpdateUser(User body);
        public Task<RequestResponse> ForgotPassword(string mail);
        public Task<RequestResponse> UpdatePassword(string password,int id);
        
    }
}
