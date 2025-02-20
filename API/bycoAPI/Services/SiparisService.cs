using bycoAPI.Interfaces;
using bycoAPI.Models;
using Utils;
using Microsoft.EntityFrameworkCore;
using Azure.Core;
using System.Reflection;
using System.Text;
using System.Diagnostics.Metrics;
using Microsoft.Extensions.Primitives;
using System.Globalization;

namespace bycoAPI.Services
{
    public class SiparisService : ISiparisService
    {
        private readonly DbContexts _context;
        private readonly IEmailSender _emailService;

        public SiparisService(DbContexts context, IEmailSender emailSender)
        {
            _context = context;
            _emailService = emailSender;

        }

        public async Task<List<SiparisOut>> GetSiparisForAdmin()
        {
            List<Siparis> siparisler = await _context.Siparis.OrderByDescending(s => s.siparis_id).ToListAsync();

            List<SiparisOut> hizliSiparisler = [];

            foreach (Siparis s in siparisler)
            {
                SiparisOut hp = new SiparisOut();
                hp.siparis_id = s.siparis_id;
                hp.siparisno = s.siparisno;
                hp.ad = s.ad;
                hp.mail = s.mail;
                hp.telefon = s.telefon;
                hp.faturaadresi = s.faturaadresi;
                hp.teslimatadresi = s.teslimatadresi;
                hp.tarih = s.tarih;
                hp.durum = s.durum;
                hp.fiyat = s.fiyat;
                hp.tcknvkn = s.tcknvkn;
                hp.urunler = [];
                var urunAdetCiftleri = s.urunler.Split('-', StringSplitOptions.RemoveEmptyEntries);

                foreach (var cift in urunAdetCiftleri)
                {
                    var parts = cift.Split('x');
                    if (parts.Length == 2
                        && int.TryParse(parts[0], out int urunId)
                        && int.TryParse(parts[1], out int adet))
                    {
                        // 2. Ürün ID'sine göre veritabanından ürünü getir
                        Product product = await _context.Products.FindAsync(urunId);

                        if (product != null)
                        {
                            product.stok = adet;
                            // Ürün bulunduysa listeye ekle
                            hp.urunler.Add(product);
                        }
                    }
                }

                hizliSiparisler.Add(hp);

            }

            return hizliSiparisler;
        }

        public async Task<List<SiparisOut>> GetSiparisForLasts(string maili)
        {
            List<Siparis> siparisler = await _context.Siparis.Where(s => s.mail == maili).ToListAsync();

            List<SiparisOut> hizliSiparisler = [];

            foreach (Siparis s in siparisler)
            {
                SiparisOut hp = new SiparisOut();
                hp.siparis_id = s.siparis_id;
                hp.siparisno = s.siparisno;
                hp.ad = s.ad;
                hp.mail = s.mail;
                hp.telefon = s.telefon;
                hp.faturaadresi = s.faturaadresi;
                hp.teslimatadresi = s.teslimatadresi;
                hp.tarih = s.tarih;
                hp.durum = s.durum;
                hp.fiyat = s.fiyat;
                hp.tcknvkn = s.tcknvkn;
                hp.urunler = [];
                var urunAdetCiftleri = s.urunler.Split('-', StringSplitOptions.RemoveEmptyEntries);

                foreach (var cift in urunAdetCiftleri)
                {
                    var parts = cift.Split('x');
                    if (parts.Length == 2
                        && int.TryParse(parts[0], out int urunId)
                        && int.TryParse(parts[1], out int adet))
                    {
                        // 2. Ürün ID'sine göre veritabanından ürünü getir
                        Product product = await _context.Products.FindAsync(urunId);

                        if (product != null)
                        {
                            // Ürün bulunduysa listeye ekle
                            hp.urunler.Add(product);
                        }
                    }
                }
                hizliSiparisler.Add(hp);

            }

            return hizliSiparisler;
        }

        public async Task<RequestResponse> OdemeAlindi(string siparis_id)
        {
            SiarpisAra sa = await _context.SiparisAra.Where(s => s.aramano == siparis_id).FirstOrDefaultAsync();
            Siparis siparis = await _context.Siparis.Where(k => k.siparisno == sa.siparisno).FirstAsync();
            siparis.durum = "Odeme Alindi";
            bool vergiKontrol = siparis.tcknvkn.Any(char.IsLetter);

            Message ml = new Message(new string[] { "info@byco.com.tr", siparis.mail });
            ml.Subject = "Siparis Alındı";
            //string bilgiler = "Kullanıcı bilgileri:  " + siparis.ad + "  Telefon = " + siparis.telefon + " Mail = " + siparis.mail;
            StringBuilder sb = new StringBuilder();

            sb.Append("<html>");
            sb.Append("<body>");
            sb.Append("<h2>📦 Satış Bilgileri</h2>");
            sb.Append("<p>Merhaba, aşağıda sipariş detaylarını ve müşteri bilgilerini bulabilirsiniz:</p>");

            // Kullanıcı Bilgileri Bölümü
            sb.Append("<h3>👤 Kullanıcı Bilgileri</h3>");
            sb.Append("<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
            sb.Append("<tr><th>Ad</th><td>" + siparis.ad + "</td></tr>");
            sb.Append("<tr><th>Telefon</th><td>" + siparis.telefon + "</td></tr>");
            sb.Append("<tr><th>Mail</th><td>" + siparis.mail + "</td></tr>");
            sb.Append("</table>");
            sb.Append("<br>");

            // Ürün Bilgileri Bölümü
            sb.Append("<h3>🛒 Sipariş Detayları</h3>");
            sb.Append("<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
            sb.Append("<tr><th>Ürün Adı</th><th>Adet</th></tr>");

            var urunAdetCiftleri = siparis.urunler.Split('-', StringSplitOptions.RemoveEmptyEntries);

            foreach (var cift in urunAdetCiftleri)
            {
                var parts = cift.Split('x');
                if (parts.Length == 2
                    && int.TryParse(parts[0], out int urunId)
                    && int.TryParse(parts[1], out int adet))
                {
                    // 2. Ürün ID'sine göre veritabanından ürünü getir
                    Product product = await _context.Products.FindAsync(urunId);

                    if (product != null)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + product.ad + " (" + product.urun + ")</td>");
                        sb.Append("<td style='text-align: center;'>" + adet.ToString() + "</td>");
                        sb.Append("</tr>");
                    }
                }
            }

            sb.Append("</table>");
            sb.Append("<br>");

            // Fiyat Bilgileri Bölümü
            sb.Append("<h3>💰 Ödeme Bilgileri</h3>");
            decimal fiyatDecimal = decimal.Parse(siparis.fiyat, CultureInfo.InvariantCulture) / 100m;

            string formattedPrice = fiyatDecimal.ToString("#,0.00", new CultureInfo("tr-TR"));

            sb.Append("<p><strong>Toplam Fiyat:</strong> " + formattedPrice + " ₺</p>");
            sb.Append("<br>");

            // Teslimat ve Fatura Adresi Bölümü
            sb.Append("<h3>📍 Teslimat ve Fatura Adresi</h3>");
            sb.Append("<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
            sb.Append("<tr><th>Fatura Adresi</th><td>" + siparis.faturaadresi + "</td></tr>");
            sb.Append("<tr><th>Teslimat Adresi</th><td>" + siparis.teslimatadresi + "</td></tr>");
            
            if (vergiKontrol)
            {
                // İlk harfin indeksini bul
                int index = siparis.tcknvkn.Select((c, i) => new { c, i })
                                            .FirstOrDefault(x => char.IsLetter(x.c))?.i ?? -1;

                if (index > 0)
                {
                    // 10 rakamın olduğu kısım Vergi Kimlik No
                    string vergiKimlikNo = siparis.tcknvkn.Substring(0, index);
                    // Harflerin başladığı kısım Vergi Dairesi
                    string vergiDairesi = siparis.tcknvkn.Substring(index);

                    sb.Append($"<tr><th>Vergi Kimlik No</th><td>{vergiKimlikNo}</td></tr>");
                    sb.Append($"<tr><th>Vergi Dairesi</th><td>{vergiDairesi}</td></tr>");
                }
            }
            
            sb.Append("</table>");
            sb.Append("<br>");

            // Sipariş Numarası ve Kapanış
            sb.Append("<h3>📄 Sipariş Bilgileri</h3>");
            sb.Append("<p><strong>Sipariş Numarası:</strong> " + siparis.siparisno + "</p>");
            sb.Append("<br>");
            sb.Append("<p>Bu sipariş hakkında herhangi bir sorunuz olursa, lütfen bizimle iletişime geçmekten çekinmeyin.</p>");
            sb.Append("<p>Teşekkürler,</p>");
            sb.Append("<p><strong>BYCO Mühendislik</strong></p>");

            sb.Append("</body>");
            sb.Append("</html>");
            ml.Content = sb.ToString();

            await _emailService.Send(ml);

            _context.Siparis.Update(siparis);
            await _context.SaveChangesAsync();

            return new RequestResponse { StatusCode = 200, ReasonString = "Siparis güncellendi" };
        }

        public async Task<RequestResponse> KargoyaVerildi(SiparisKargoda sk)
        {
            Siparis siparis = await _context.Siparis.Where(k => k.siparisno == sk.siparisno).FirstAsync();
            siparis.durum = "Kargoya Verildi";

            Message ml = new Message(new string[] { "info@byco.com.tr", siparis.mail });
            ml.Subject = "Sipariş Kargoya Verildi";
            //string bilgiler = "Kullanıcı bilgileri:  " + siparis.ad + "  Telefon = " + siparis.telefon + " Mail = " + siparis.mail;
            StringBuilder sb = new StringBuilder();

            sb.Append("<html>");
            sb.Append("<body>");
            sb.Append("<h2>📦 Satış Bilgileri</h2>");
            sb.Append("<p>Merhaba, aşağıda sipariş detaylarını ve müşteri bilgilerini bulabilirsiniz:</p>");

            // Kullanıcı Bilgileri Bölümü
            sb.Append("<h3>👤 Kullanıcı Bilgileri</h3>");
            sb.Append("<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
            sb.Append("<tr><th>Ad</th><td>" + siparis.ad + "</td></tr>");
            sb.Append("<tr><th>Telefon</th><td>" + siparis.telefon + "</td></tr>");
            sb.Append("<tr><th>Mail</th><td>" + siparis.mail + "</td></tr>");
            sb.Append("</table>");
            sb.Append("<br>");

            // Ürün Bilgileri Bölümü
            sb.Append("<h3>🛒 Sipariş Detayları</h3>");
            sb.Append("<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
            sb.Append("<tr><th>Ürün Adı</th><th>Adet</th></tr>");

            var urunAdetCiftleri = siparis.urunler.Split('-', StringSplitOptions.RemoveEmptyEntries);

            foreach (var cift in urunAdetCiftleri)
            {
                var parts = cift.Split('x');
                if (parts.Length == 2
                    && int.TryParse(parts[0], out int urunId)
                    && int.TryParse(parts[1], out int adet))
                {
                    // 2. Ürün ID'sine göre veritabanından ürünü getir
                    Product product = await _context.Products.FindAsync(urunId);

                    if(await stokSorunu(urunId,adet)){
                        return new RequestResponse { StatusCode = 333, ReasonString = "Yetersiz stok" };
                    }

                    if (product != null)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + product.ad + " (" + product.urun + ")</td>");
                        sb.Append("<td style='text-align: center;'>" + adet.ToString() + "</td>");
                        sb.Append("</tr>");
                    }
                }
            }

            sb.Append("</table>");
            sb.Append("<br>");

            // Fiyat Bilgileri Bölümü
            sb.Append("<h3>💰 Ödeme Bilgileri</h3>");
            decimal fiyatDecimal = decimal.Parse(siparis.fiyat, CultureInfo.InvariantCulture) / 100m;

            string formattedPrice = fiyatDecimal.ToString("#,0.00", new CultureInfo("tr-TR"));

            sb.Append("<p><strong>Toplam Fiyat:</strong> " + formattedPrice + " ₺</p>");
            sb.Append("<br>");

            // Teslimat ve Fatura Adresi Bölümü
            sb.Append("<h3>📍 Teslimat ve Fatura Adresi</h3>");
            sb.Append("<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
            sb.Append("<tr><th>Fatura Adresi</th><td>" + siparis.faturaadresi + "</td></tr>");
            sb.Append("<tr><th>Teslimat Adresi</th><td>" + siparis.teslimatadresi + "</td></tr>");
            sb.Append("</table>");
            sb.Append("<br>");

            // Sipariş Numarası ve Kapanış
            sb.Append("<h3>📄 Sipariş Bilgileri</h3>");
            sb.Append("<p><strong>Sipariş Numarası:</strong> " + siparis.siparisno + "</p>");
            sb.Append("<br>");
            sb.Append("<p><strong>Kargo Numarası:</strong> " + sk.kargono + "(xxxxxx Kargo)</p>");
            sb.Append("<br>");
            sb.Append("<p>Bu sipariş hakkında herhangi bir sorunuz olursa, lütfen bizimle iletişime geçmekten çekinmeyin.</p>");
            sb.Append("<p>Teşekkürler,</p>");
            sb.Append("<p><strong>BYCO Mühendislik</strong></p>");

            sb.Append("</body>");
            sb.Append("</html>");
            ml.Content = sb.ToString();

            await _emailService.Send(ml);

            _context.Siparis.Update(siparis);
            await _context.SaveChangesAsync();

            return new RequestResponse { StatusCode = 200, ReasonString = "Siparis güncellendi" };
        }

        
        
        public async Task<RequestResponse> SiparisKaydet(HizliSiparis hp, string siparisno)
        {
            Siparis siparis = new Siparis();
            siparis.siparisno = siparisno;
            siparis.ad = hp.aliciAdi;
            siparis.mail = hp.CustomerEmailAddress;
            siparis.faturaadresi = hp.faturaAdresi;
            siparis.teslimatadresi = hp.teslimatAdresi;
            siparis.telefon = hp.telefon;
            siparis.tarih = DateTime.Now;
            siparis.tcknvkn = hp.tcknvkn;
            siparis.durum = "Ödemeye gönderildi";
            SiarpisAra sa = new SiarpisAra();
            sa.aramano = hp.gecicino;
            sa.siparisno = siparisno;

            StringBuilder sb = new StringBuilder();

            foreach (OdemeUrun ou in hp.urunler)
            {
                Product p = await _context.Products.FindAsync(ou.id);
                if(p.stok<ou.adet) return new RequestResponse { StatusCode = 333, ReasonString = "Yetersiz Stok" };
                sb.Append(ou.id.ToString() + "x" + ou.adet.ToString() + "-");
            }

            siparis.urunler = sb.ToString();
            siparis.fiyat = hp.TxnAmount.ToString();

            try
            {
                Siparis siparisdb = await Copy(siparis, "siparis_id");
                await _context.Siparis.AddAsync(siparisdb);
                await _context.SaveChangesAsync();
                await _context.SiparisAra.AddAsync(sa);
                await _context.SaveChangesAsync();
                return new RequestResponse { StatusCode = 200, ReasonString = "Kullanıcı eklendi" };

            }
            catch
            {
                return new RequestResponse { StatusCode = 400, ReasonString = "Hata olustu" };
            }
        }

        private async Task<Boolean> stokSorunu(int id, int adet){
            Product product = await _context.Products.FindAsync(id);

            if(product.stok<adet)return true;

            product.stok = product.stok - adet;
            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return false;

        }

        public async Task<Siparis> Copy(Siparis source, string excludeProperty)
        {
            Siparis target = new Siparis();
            foreach (PropertyInfo property in typeof(Siparis).GetProperties())
            {
                if (property.Name != excludeProperty && property.CanWrite)
                {
                    var value = property.GetValue(source);
                    property.SetValue(target, value);
                }
            }
            //target.password=HashString(target.password);
            return target;
        }

        public async Task<SiparisOut> GetSiparisBySiparisNo(string orderid)
        {
            SiarpisAra sa = await _context.SiparisAra.Where(sa => sa.aramano == orderid).FirstOrDefaultAsync();
            Siparis s = await _context.Siparis.Where(s => s.siparisno == sa.siparisno).FirstOrDefaultAsync();


            SiparisOut hp = new SiparisOut();
            hp.siparis_id = s.siparis_id;
            hp.siparisno = s.siparisno;
            hp.ad = s.ad;
            hp.mail = s.mail;
            hp.telefon = s.telefon;
            hp.faturaadresi = s.faturaadresi;
            hp.teslimatadresi = s.teslimatadresi;
            hp.tarih = s.tarih;
            hp.durum = s.durum;
            hp.fiyat = s.fiyat;
            hp.tcknvkn = s.tcknvkn;
            hp.urunler = [];
            var urunAdetCiftleri = s.urunler.Split('-', StringSplitOptions.RemoveEmptyEntries);

            foreach (var cift in urunAdetCiftleri)
            {
                var parts = cift.Split('x');
                if (parts.Length == 2
                    && int.TryParse(parts[0], out int urunId)
                    && int.TryParse(parts[1], out int adet))
                {
                    // 2. Ürün ID'sine göre veritabanından ürünü getir
                    Product product = await _context.Products.FindAsync(urunId);

                    if (product != null)
                    {
                        // Ürün bulunduysa listeye ekle
                        hp.urunler.Add(product);
                    }
                }
            }


            return hp;
        }
    }
}
