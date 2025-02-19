using bycoAPI.Interfaces;
using bycoAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace bycoAPI.Services
{
    public class OtherService : IOtherService
    {
        private readonly DbContexts _context;

        public OtherService(DbContexts context)
        {
            _context = context;

        }

        public async Task<List<Others>> GetAll()//ok
        {
            return await _context.Others.ToListAsync();
        }


        public async Task<RequestResponse> Update(Others others)
        {
            RequestResponse response = new RequestResponse();
            // Id ile product'ı veritabanından getiriyoruz
            Others other = await _context.Others.Where(p => p.position == others.position).FirstOrDefaultAsync();

            if (other == null)
            {
                return new RequestResponse { StatusCode = 400, ReasonString = "Değer bulunamadı!" };
            }


            try
            {
                other.text=others.text;
                _context.Update(other);

                await _context.SaveChangesAsync();
                return new RequestResponse { StatusCode = 200, ReasonString = "İşlem başarılı" };
            }
            catch (Exception ex)
            {
                throw new Exception($"'{others.position}' özelliği için geçersiz değer türü");
            }

        }



    }
}
