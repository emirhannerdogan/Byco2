using bycoAPI.Interfaces;
using bycoAPI.Models;
using Utils;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace bycoAPI.Services
{
    public class UserService : IUserServices
    {

        private readonly DbContexts _dbContexts;
        private readonly IEmailSender _emailSender;
        public UserService(DbContexts dbContexts,IEmailSender emailSender)
        {
            _dbContexts = dbContexts;
            _emailSender = emailSender;
        }
        public async Task<User> GetUserAsync(int id)
        {
            return await _dbContexts.Users.FindAsync(id);
        }

        public async Task<User> GetUserByEmail(string userstring)
        {
            User user = await _dbContexts.Users.FirstOrDefaultAsync(k => k.email == userstring);
            if (user == null) { return null; }
            return await Task.FromResult(user);
        }

        public async Task<RequestResponse> UserKaydet(User user)
        {
            try
            {
                User userdb = await Copy(user, "user_id");
                await _dbContexts.Users.AddAsync(userdb);
                await _dbContexts.SaveChangesAsync();
                return new RequestResponse { StatusCode = 200, ReasonString = "Kullanıcı eklendi" };

            }
            catch
            {
                return new RequestResponse { StatusCode = 400, ReasonString = "Hata olustu" };
            }

        }

        public bool CheckUserExist(LoginReq loginReq)
        {
            if (_dbContexts.Users == null) return false;
            User user = _dbContexts.Users
            .FirstOrDefault(u => u.email == loginReq.email
            && u.password == loginReq.password);

            return true;
        }

        private string HashString(string text)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(text);
            SHA256Managed hashstring = new SHA256Managed();
            byte[] hash = hashstring.ComputeHash(bytes);
            string hashString = string.Empty;
            foreach (byte x in hash)
            {
                hashString += String.Format("{0:x2}", x);
            }
            return hashString;
        }

        public async Task<User> Copy(User source, string excludeProperty)
        {
            User target = new User();
            foreach (PropertyInfo property in typeof(User).GetProperties())
            {
                if (property.Name != excludeProperty && property.CanWrite)
                {
                    var value = property.GetValue(source);
                    property.SetValue(target, value);
                }
            }
            target.password = HashString(target.password);
            return target;
        }

        public async Task<List<User>> GetUserInfoForAdmin()
        {
            return await _dbContexts.Users.ToListAsync();
        }

        public async Task<RequestResponse> UpdateUser(User body)
        {
            User user = await _dbContexts.Users.FindAsync(body.user_id);
            if (user == null)
            {
                return new RequestResponse { StatusCode = 400, ReasonString = "Kullanici bulunamadı!" };
            }

            foreach (PropertyInfo property in typeof(User).GetProperties())
            {
                if (property.CanWrite)
                {
                    var value = property.GetValue(body);
                    property.SetValue(user, value);
                }
            }

            _dbContexts.Users.Update(user);
            await _dbContexts.SaveChangesAsync();

            return new RequestResponse { StatusCode = 200, ReasonString = "Kullanici güncellendi" };
        }

        public async Task<RequestResponse> UpdatePassword(string password, int id)
        {
            try
            {
                User user = await _dbContexts.Users.FindAsync(id);
                user.password = HashString(password);
                _dbContexts.Update(user);
                await _dbContexts.SaveChangesAsync();
                return new RequestResponse { StatusCode = 200, ReasonString = "Success" };

            }
            catch
            {
                return new RequestResponse { StatusCode = 331, ReasonString = "An Error Occured" };

            }


        }

        public async Task<RequestResponse> ForgotPassword(string mail)
        {
            User user = await _dbContexts.Users.FirstOrDefaultAsync(k => k.email == mail);
            if (user == null)
            {
                return new RequestResponse { StatusCode = 400, ReasonString = "Kullanici bulunamadı!" };
            }
            Random random = new Random((int)DateTime.Now.Ticks);
            string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            //throw new NotImplementedException();
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < 12; i++)
            {
                result.Append(chars[random.Next(chars.Length)]);
            }
            string newpassword = result.ToString();
            try{
                user.password = HashString(newpassword);
                _dbContexts.Update(user);
                await _dbContexts.SaveChangesAsync();
            }
            catch{
                return new RequestResponse { StatusCode = 400, ReasonString = "Şifre güncellenemedi" };
            }

            Message ml = new Message(new string[] { user.email});
            ml.Subject ="Yeni Şifre";
            StringBuilder sb = new StringBuilder();

            ml.Content= "Yeni şifreniz "+newpassword+" olarak belirlendi. Lütfen profil sayfanızdan en kısa zamanda şifrenizi hatırlayablieceğiniz bir şifre ile değiştiriniz!!";

            await _emailSender.Send(ml);

            return new RequestResponse { StatusCode = 200, ReasonString = "Şifre güncellendi" };
        }
    }
}
