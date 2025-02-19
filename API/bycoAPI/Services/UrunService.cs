using bycoAPI.Interfaces;
using bycoAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace bycoAPI.Services
{
    public class UrunService : IUrunService
    {
        private readonly DbContexts _context;

        public UrunService(DbContexts context)
        {
            _context = context;

        }

        public async Task<Product> GetUrunByIdAsync(int id)//ok
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<List<Product>> GetAllUrun()//ok
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<RequestResponse> AddUrun(Product urun)
        {
            if(urun.urun == "" || urun.urun==null)
            return new RequestResponse { StatusCode = 400, ReasonString = "Barkod özelliği boş bırakılamaz" };


            if(await _context.Products.Where(p => p.urun == urun.urun).FirstOrDefaultAsync()!=null)
            return new RequestResponse { StatusCode = 400, ReasonString = "Barkodu aynı olan başka ürün var" };
            
            Product urundb = await Copy(urun, "id");
            await _context.Products.AddAsync(urundb);
            await _context.SaveChangesAsync();
            return new RequestResponse { StatusCode = 200, ReasonString = "Ürün eklendi" };
        }

        public async Task<RequestResponse> UpdateUrun(int urun_id, Product body)
        {
            Product urun = await _context.Products.FindAsync(urun_id);
            if (urun == null)
            {
                return new RequestResponse { StatusCode = 400, ReasonString = "Ürün bulunamadı!" };
            }

            if (urun.id == urun_id)
            {
                foreach (PropertyInfo property in typeof(Product).GetProperties())
                {
                    if (property.CanWrite)
                    {
                        var value = property.GetValue(body);
                        property.SetValue(urun, value);
                    }
                }

                _context.Products.Update(urun);
                await _context.SaveChangesAsync();
                return new RequestResponse { StatusCode = 200, ReasonString = "Ürün güncellendi" };

            }
            else return new RequestResponse { StatusCode = 331, ReasonString = "Ürün uyuşmuyor!" };


        }

        public async Task<RequestResponse> Update(UpdateModel updateModel)
        {
            RequestResponse response = new RequestResponse();
            // Id ile product'ı veritabanından getiriyoruz
            Product product = await _context.Products.Where(p => p.urun == updateModel.barkod).FirstOrDefaultAsync();

            if (product == null)
            {
                return new RequestResponse { StatusCode = 400, ReasonString = "Ürün bulunamadı!" };
            }

            // Reflection ile property'yi buluyoruz
            PropertyInfo property = typeof(Product).GetProperty(updateModel.entity);

            if (property == null)
            {
                return new RequestResponse { StatusCode = 400, ReasonString = "Geçersiz entity adı." };
            }

            try
            {
                object convertedValue;

                if (updateModel.entity == "fiyat")
                {
                    convertedValue = Convert.ToDecimal(updateModel.deger);
                }
                else if (updateModel.entity == "stok" || updateModel.entity == "indirim")
                {
                    convertedValue = Convert.ToInt32(updateModel.deger);
                }
                else if (property.PropertyType == typeof(string))
                {
                    convertedValue = Convert.ToString(updateModel.deger);
                }
                else
                {
                    throw new Exception("Desteklenmeyen veri türü.");
                }

                property.SetValue(product, convertedValue);
                await _context.SaveChangesAsync();
                return new RequestResponse { StatusCode = 200, ReasonString = "İşlem başarılı" };
            }
            catch (Exception ex)
            {
                throw new Exception($"'{updateModel.entity}' özelliği için geçersiz değer türü: {ex.Message}");
            }

            // Veritabanında değişiklikleri kaydediyoruz
            // await _context.SaveChangesAsync();
            // return response;
        }

        public async Task<RequestResponse> DeleteUrun(string barkod)//ok
        {
            RequestResponse response = new RequestResponse();
            Product urun = await _context.Products.Where(p => p.urun == barkod).FirstOrDefaultAsync();
            if (urun == null)
            {
                response.StatusCode = 400;
                response.ReasonString = "Ürün bulunamadı";
                return response;
            }

            _context.Products.Remove(urun);
            await _context.SaveChangesAsync();

            response.StatusCode = 200;
            response.ReasonString = "Ürün Silindi";
            return response;
        }

        public async Task<Product> Copy(Product source, string excludeProperty)
        {
            Product target = new Product();
            foreach (PropertyInfo property in typeof(Product).GetProperties())
            {
                if (property.Name != excludeProperty && property.CanWrite)
                {
                    var value = property.GetValue(source);
                    property.SetValue(target, value);
                }
            }
            return target;
        }

        public async Task<List<Product>> GetProductsByCategory(string category)
        {
            return await _context.Products.Where(p => p.kategori.Contains(category)).ToListAsync();
        }
    }
}
