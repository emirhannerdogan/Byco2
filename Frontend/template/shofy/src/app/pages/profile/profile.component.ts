import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { URL } from '@/shared/services/url';

interface BulkUpdateRow {
  barkod: string;
  entities: { name: string; value: string }[];
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {

  oldPassword: string = '';
  newPassword: string = '';
  newCategoy: string = '';
  confirmPassword: string = '';
  indirimyeni: string[] = [];
  //indirimyeni: string = 'Buraya';
  passwordUpdated: boolean = false;
  infoUpdated: boolean = false;
  passwordMismatch: boolean = false;
  userid: number = -1;
  urunTuru: string = '';
  newCategory: string = '';
  siparisler: any[] = [];

  selectedSiparisId: number | null = null;
  //benimUrl = this.urlhost.geturl();
  
  
  currentProductPage: number = 1; // Başlangıç sayfası
  itemsPerProductPage: number = 10; // Her sayfada kaç ürün olacağını belirler
  totalProductPages: number = 0; // Toplam sayfa sayısı
  paginatedProducts: any[] = []; // Sayfaya özel ürünler

  products: any[] = []; // API'den çekilen tüm ürünler
  filteredProducts: any[] = []; // Filtrelenmiş ürünler
  searchQuery: string = ''; // Arama kutusuna girilen metin


  messages: Array<{ id: number; position: string; text: string }> = [];


  constructor(private router: Router, private toastrService: ToastrService) { }

  public kategoriSec: { value: string; text: string }[] = []; // Türü { value: string; text: string }[] olarak belirledik
  public urunTurleriOptions: { value: string; text: string }[] = [];


  public genderSelectOptions = [
    { value: 'male', text: 'Male' },
    { value: 'female', text: 'Female' },
    { value: 'others', text: 'Others' },
  ];

  public urunTurleri: string[] = [
    'Aydınlatma',
    'Anahtar Priz',
    'Enerji Kabloları',
    'Zayıf Akım Kabloları',
    'Şalt Malzemeler',
    'Elektrik Tesisat Ürünleri',
    'Grup Priz/Fiş',
    'Araç Şarj Cihazları',
  ];

  urundeneme = {
    ad: '',
    kategori: '',
    img: '',
    kod: '',
    aciklama: '',

    amper: '',
    aydinlatmaTuru: '',
    cerceve: '',
    damarSayisi: '',

    disKilifRengi: '',
    duy: '',
    isikRengi: '',
    kabloTipi: '',

    kabloUzunlugu: '',
    kanalBoyutu: '',
    kanalOzelligi: '',
    kanalRengi: '',

    kasaRengi: '',
    kesit: '',
    kesmeKapasitesi: '',
    kullanimYeri: '',

    kutup: '',
    marka: '',
    model: '',
    prizSayisi: '',

    renk: '',
    renkSicakligiKelvin: '',
    sigortaSayisi: '',
    tip: '',

    tur: '',
    urun: '',
    urunOzelligi: '',
    urunTipi: '',

    watt: '',
    stok: '',
    fiyat: '',
    indirim: '',

  }

  gonderilecekUrun = {
    ad: '',
    kategori: '',
    img: '',
    kod: '',
    aciklama: '',

    amper: '',
    aydinlatmaTuru: '',
    cerceve: '',
    damarSayisi: '',

    disKilifRengi: '',
    duy: '',
    isikRengi: '',
    kabloTipi: '',

    kabloUzunlugu: '',
    kanalBoyutu: '',
    kanalOzelligi: '',
    kanalRengi: '',

    kasaRengi: '',
    kesit: '',
    kesmeKapasitesi: '',
    kullanimYeri: '',

    kutup: '',
    marka: '',
    model: '',
    prizSayisi: '',

    renk: '',
    renkSicakligiKelvin: '',
    sigortaSayisi: '',
    tip: '',

    tur: '',
    urun: '',
    urunOzelligi: '',
    urunTipi: '',

    watt: '',
    stok: 0,
    fiyat: 0,
    indirim: 0

  }



  myObject = {
    user_id: 0,
    ad: 'Süleyman',
    soyad: 'Rıfkı',
    email: 'byco@byco.com.tr',
    password: 'password',
    telefon: '555555555',
    tip: 0,
    tcknvkn: '12345678910',
    teslimatadresi: 'Evim Caddesi, Okul Sokak, No:23',
    faturaadresi: 'İşim Caddesi, Üniversite Sokak, No:23',
    indirim: 5
  };

  siparislerimDeneme = [
    { no: '254789', musteri: 'Enka', urunadedi: '2', tarih: '01.02.2014', tutar: '245', durum: 'yolda', },
    { no: '154865', musteri: 'Berk CAn', urunadedi: '8', tarih: '01.02.2014', tutar: '714', durum: 'hazirlaniyor', },
    { no: '486154', musteri: 'Finnaz Ay', urunadedi: '7', tarih: '01.02.2014', tutar: '743', durum: 'teslim', },
    { no: '789524', musteri: 'Süleyman Rıfkı', urunadedi: '4', tarih: '01.02.2014', tutar: '22458', durum: 'hata', },
    { no: '215674', musteri: 'DUNYA', urunadedi: '6', tarih: '01.02.2014', tutar: '12', durum: 'yolda', },
    { no: '456846', musteri: 'şevket er', urunadedi: '1', tarih: '01.02.2014', tutar: '122422', durum: 'yolda', },
    { no: '964215', musteri: 'Enka', urunadedi: '1', tarih: '01.02.2014', tutar: '987554', durum: 'yolda', }
  ];

  musterilerDeneme = [
    { id: "0", ad: 'Berk Can', tip: '1', sipsayi: '3', tutar: '245', indirim: '20', },
    { id: "1", ad: 'Tesla', tip: '2', sipsayi: '5', tutar: '714', indirim: '10', },
    { id: "2", ad: 'Süleyman Rıfkı', tip: '1', sipsayi: '10', tutar: '743', indirim: '0', },
    { id: "3", ad: 'ENKA', tip: '2', sipsayi: '8', tutar: '22458', indirim: '0', },
    { id: "4", ad: 'DUNYA', tip: '2', sipsayi: '132', tutar: '12', indirim: '12', },
    { id: "5", ad: 'Merve Gündoğdu', tip: '1', sipsayi: '1', tutar: '122422', indirim: '23', },
    { id: "6", ad: 'Binnaz Türker', tip: '1', sipsayi: '0', tutar: '987554', indirim: '65', }
  ];

  showDeletePopup: boolean = false;
  barkod: string = ""; 
  barcodeInput: string = '';
  barkodlar: string[] = [];
  selectedUpdateEntity: string = '';
  dynamicEntities: Array<{ entityName: string; values: string[], valuesInput: string }> = [];


  entity: string = '';
  deger: string = '';
  updateMessage: string | null = null;
  isSuccess: boolean = false;

  entityOptions = [
    { value: 'ad', text: 'Ad' },
    { value: 'aciklama', text: 'Açıklama' },
    { value: 'kod', text: 'Kod' },
    { value: 'stok', text: 'Stok' },
    { value: 'fiyat', text: 'Fiyat' },
    { value: 'kategori', text: 'Kategori' },
    { value: 'img', text: 'Görsel' },
    { value: 'amper', text: 'Amper' },
    { value: 'aydinlatmaturu', text: 'Aydınlatma Türü' },
    { value: 'cerceve', text: 'Çerçeve' },
    { value: 'damarsayisi', text: 'Damar Sayısı' },
    { value: 'disKilifrengi', text: 'Dış Kılıf Rengi' },
    { value: 'duy', text: 'Duy' },
    { value: 'isikrengi', text: 'Işık Rengi' },
    { value: 'kablotipi', text: 'Kablo Tipi' },
    { value: 'kablouzunlugu', text: 'Kablo Uzunluğu' },
    { value: 'kanalboyutu', text: 'Kanal Boyutu' },
    { value: 'kanalozelligi', text: 'Kanal Özelliği' },
    { value: 'kanalrengi', text: 'Kanal Rengi' },
    { value: 'kasarengi', text: 'Kasa Rengi' },
    { value: 'kesit', text: 'Kesit' },
    { value: 'kesmekapasitesi', text: 'Kesme Kapasitesi' },
    { value: 'kullanimyeri', text: 'Kullanım Yeri' },
    { value: 'kutup', text: 'Kutup' },
    { value: 'marka', text: 'Marka' },
    { value: 'model', text: 'Model' },
    { value: 'prizsayisi', text: 'Priz Sayısı' },
    { value: 'renk', text: 'Renk' },
    { value: 'renksicakligikelvin', text: 'Renk Sıcaklığı (Kelvin)' },
    { value: 'sigortasayisi', text: 'Sigorta Sayısı' },
    { value: 'tip', text: 'Tip' },
    { value: 'tur', text: 'Tür' },
    { value: 'urunozelligi', text: 'Ürün Özelliği' },
    { value: 'uruntipi', text: 'Ürün Tipi' },
    { value: 'watt', text: 'Watt' },
    { value: 'indirim', text: 'İndirim (%)' }
  ];

  getEntityText(entityName: string): string {
    const entity = this.entityOptions.find(option => option.value === entityName);
    return entity ? entity.text : entityName; // Eğer eşleşme yoksa mevcut entityName'i döner
  }
  cleanEntityValues(index: number): void {
    this.dynamicEntities[index].values = this.dynamicEntities[index].values.map(value =>
      value.replace(/,/g, '') // Virgülleri tamamen kaldır
    );
  }
  
 // Barkod listesi güncellenirken virgül eklenmiyor
updateBarcodeList() {
  this.barkodlar = this.barcodeInput.split('\n').map(line => line.trim()).filter(line => line !== '');
  this.dynamicEntities.forEach(entity => {
    const diff = this.barkodlar.length - entity.values.length;
    if (diff > 0) {
      entity.values.push(...Array(diff).fill('')); // Varsayılan değer boş
    } else if (diff < 0) {
      entity.values.splice(diff);
    }
  });
}

// Entity değerleri güncellenirken virgül eklenmiyor
// Entity değerleri güncellenirken virgül tamamen kaldırılıyor
updateEntityValues(index: number) {
  const entity = this.dynamicEntities[index];
  entity.valuesInput = entity.valuesInput.replace(/,/g, ''); // Virgülleri tamamen kaldır
  entity.values = entity.valuesInput.split('\n').map(line => line.trim()).filter(line => line !== '');
}

// Yeni entity eklerken boş değerler yerleştiriliyor
addEntity() {
  if (!this.selectedUpdateEntity) return;

  if (this.dynamicEntities.some(entity => entity.entityName === this.selectedUpdateEntity)) {
    return; // Aynı entity zaten eklenmişse bir daha ekleme
  }

  this.dynamicEntities.push({
    entityName: this.selectedUpdateEntity,
    values: Array(this.barkodlar.length).fill(''), // Varsayılan değerler boş
    valuesInput: '' // Kullanıcı girdisi için başlangıç değeri boş
  });
  this.selectedUpdateEntity = ''; // Dropdown sıfırlanıyor
}

bulkDeleteProducts() {
  if (this.barkodlar.length === 0) {
    this.toastrService.error('Silinecek barkod listesi boş!', 'Hata');
    return;
  }

  const requests = this.barkodlar.map(barkod =>
    this.sendRequestWithHeadersPost(`Urun/Delete/${barkod}`, 'DELETE', null, {
      'Authorization': `Bearer ${this.getCookie("session_key")}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  );

  Promise.all(requests)
    .then(() => {
      this.toastrService.success('Barkodlar başarıyla silindi!', 'Başarılı');
      this.barkodlar = []; // Listeyi temizle
      this.barcodeInput = ''; // Input alanını temizle
    })
    .catch(err => {
      console.error('Silme işlemi sırasında bir hata oluştu:', err);
      this.toastrService.error('Bazı barkodlar silinemedi!', 'Hata');
    });
}

// Güncelleme işlemi
bulkUpdateProducts() {
  const allEntitiesMatch = this.dynamicEntities.every(entity => entity.values.length === this.barkodlar.length);

  if (!allEntitiesMatch) {
    this.toastrService.error('Barkod sayısı ile entity değer sayısı eşleşmiyor!', 'Hata');
    return;
  }

  const requests = this.barkodlar.flatMap((barkod, i) =>
    this.dynamicEntities.map(entity => {
      const payload = {
        barkod,
        entity: entity.entityName,
        deger: entity.values[i],
      };
      return this.sendRequestWithHeadersPost('Urun/UpdateWithEntityName', 'PUT', payload, {
        Authorization: `Bearer ${this.getCookie('session_key')}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      });
    })
  );

  Promise.all(requests)
    .then(() => this.toastrService.success('Tüm ürünler başarıyla güncellendi!', 'Başarılı'))
    .catch(err => this.toastrService.error('Güncelleme sırasında bir hata oluştu!', 'Hata'));
}

// Entity silme
removeEntity(index: number) {
  this.dynamicEntities.splice(index, 1);
}
  
  selectedEntity = this.entityOptions[0].value;
  onEntityChange(selectedValue: string) {
    this.selectedEntity = selectedValue;
  }
  ngOnInit(): void {
    this.fetchProducts();
    this.fetchMessages();

    
    this.filteredSiparisler = [...this.siparisler]; // Başlangıçta tüm siparişleri göster
    this.currentPage = 1; // İlk sayfa

    const token = this.getCookie("session_key");
    if (!token) {
        this.router.navigate(['/pages/login']); // Token yoksa login sayfasına yönlendir
    }
    this.getUserByToken();
    this.getKategoriListesi(); // Yeni kategori listesini çekme fonksiyonunu çağırın
    this.urunTurleriOptions = this.urunTurleri.map(tur => ({
      value: tur,
      text: tur
    }));
    // Ürün türü seçeneklerini ayarla
  this.urunTurleriOptions = this.urunTurleri.map(tur => ({
    value: tur,
    text: tur
  }));

  // İlk ürünü başlangıç değeri olarak ata
  if (this.urunTurleriOptions.length > 0) {
    this.urunTuru = this.urunTurleriOptions[0].value;
  }
    this.getOrders();

  }

  // Mesajları backend'den çekme
  fetchMessages(): void {
    this.sendRequest('Others/Get', 'GET')
      .then((response) => {
        this.messages = response; // Mesajları state'e atıyoruz
      })
      .catch((err) => {
        console.error('Mesajlar alınamadı:', err);
      });
  }

  // Mesajı güncelleme
  updateMarquee(message: { id: number; position: string; text: string }): void {
    const payload = {
      id: message.id,
      position: message.position, // Position değişmiyor
      text: message.text
    };
  
    this.sendRequestWithHeadersPost('Others/Change', 'PUT', payload, {
      Authorization: `Bearer ${this.getCookie('session_key')}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    })
      .then(() => {
        console.log('Mesaj başarıyla güncellendi:', message);
        alert('Mesaj başarıyla güncellendi!');
      })
      .catch((err) => {
        console.error('Mesaj güncellenirken hata oluştu:', err);
        alert('Mesaj güncellenirken bir hata oluştu.');
      });
  }

  fetchProducts(): void {
    this.sendRequest('Urun/GetAll', 'GET')
      .then(response => {
        this.products = response; // Tüm ürünler
        this.filteredProducts = [...this.products]; // İlk başta tüm ürünler gösteriliyor
        this.paginateProducts(); // İlk sayfalama işlemini yap
      })
      .catch(err => {
        console.error("Error fetching products:", err);
      });
  }
  
  paginateProducts(): void {
    const startIndex = (this.currentProductPage - 1) * this.itemsPerProductPage;
    const endIndex = startIndex + this.itemsPerProductPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  
    // Toplam sayfa sayısını hesapla
    this.totalProductPages = Math.ceil(this.filteredProducts.length / this.itemsPerProductPage);
  }
  
  nextPage(): void {
    if (this.currentProductPage < this.totalProductPages) {
      this.currentProductPage++;
      this.paginateProducts();
    }
  }
  
  previousPage(): void {
    if (this.currentProductPage > 1) {
      this.currentProductPage--;
      this.paginateProducts();
    }
  }
  
  filterProducts(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      Object.values(product).some(value =>
        value != null && typeof value !== 'object' && value.toString().toLowerCase().includes(query)
      )
    );
  
    // Sayfalamayı sıfırla
    this.currentProductPage = 1;
    this.paginateProducts();
  }



  updateProduct() {
    if (!this.barkod) {
      console.error("Barkod boş bırakılamaz");
      return;
    }

    const payload = {
      barkod: this.barkod,
      entity: this.selectedEntity,
      deger: this.deger || '' // Eğer deger boş bırakılmışsa, boş bir string gönderir
    };

    this.sendRequestWithHeadersPost('Urun/UpdateWithEntityName', 'PUT', payload, {
      'Authorization': `Bearer ${this.getCookie("session_key")}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
      .then(response => {
        console.log("Güncelleme başarılı:", response);
        this.isSuccess = true;
        this.updateMessage = "Ürün başarıyla güncellendi.";
        this.hideMessageAfterDelay();
      })
      .catch(err => {
        console.error("Error: " + err);
        this.isSuccess = false;
        this.updateMessage = "Ürün güncellenirken bir hata oluştu.";
        this.hideMessageAfterDelay();
      });
  }

  hideMessageAfterDelay() {
    setTimeout(() => {
      this.updateMessage = null;
    }, 3000); // 3 saniye sonra mesajı gizle
  }
  confirmDelete() {
    // Eğer barkod alanı boşsa popup açılmasın ve uyarı mesajı gösterilsin
    if (!this.barkod || this.barkod.trim() === "") {
      this.updateMessage = "Lütfen önce bir barkod girin.";
      this.isSuccess = false;
      this.hideMessageAfterDelay();
      return; // Popup açılmadan fonksiyondan çık
    }
  
    // Barkod girildiyse popup açılır
    const userConfirmed = confirm(`${this.barkod} numaralı ürünü silmek üzeresiniz. Emin misiniz?`);
    if (userConfirmed) {
      this.deleteProduct();
    }
  }
  
  cancelDelete() {
    this.showDeletePopup = false;
  }
  
  deleteProduct() {
    // Popup'ı kapatalım
    this.showDeletePopup = false;
  
    // API isteğini gönderelim
    this.sendRequestWithHeadersPost(`Urun/Delete/${this.barkod}`, 'DELETE', null, {
      'Authorization': `Bearer ${this.getCookie("session_key")}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
      .then(response => {
        alert(`${this.barkod} numaralı ürün başarıyla silindi.`);
        console.log(response);
      })
      .catch(err => {
        console.error("Error: " + err);
        alert('Ürün silinirken bir hata oluştu.');
      });
  }
  getUserByToken(){
    this.sendRequestWithHeaders('User/GetUser', 'GET', {
      'Authorization': `Bearer ${this.getCookie("session_key")}`
    })
    .then(response => {
      console.log("Response from API:", response);  // API'den gelen tam yanıtı göster
      this.myObject = response;
  
      // API yanıtında tcknvkn alanının var olup olmadığını kontrol edin
      if (response.tcknvkn) {
        this.myObject.tcknvkn = response.tcknvkn;
      } else {
        console.warn("API yanıtında tcknvkn alanı yok veya boş.");
      }
    })
    .catch(err => {
      console.log("User bilgileri alınamadı.");
      console.error("Error: " + err);
      //this.router.navigate(['/pages/login']);
    })
  }
  
  sendRequestWithHeaders(url: string, method: string, header?: any): Promise<any> {
    return fetch(`https://bycobackend.online:5001/api/${url}`, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: header,
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
      return response.json();
  })
  }

  deleteCategory() {
    if (!this.newCategory) {
      this.toastrService.error('Lütfen bir kategori adı girin.', 'Hata');
      return;
    }
  
    // Fetch all categories to find the matching one
    this.sendRequest('Kategori/GetAll', 'GET')
      .then((categories: any[]) => {
        // Find the category by name
        const matchingCategory = categories.find(
          (category) => category.ad.toLowerCase() === this.newCategory.toLowerCase()
        );
  
        if (!matchingCategory) {
          this.toastrService.error('Kategori bulunamadı.', 'Hata');
          return Promise.reject('Category not found');
        }
  
        const categoryId = matchingCategory.id;
  
        // Send the delete request with the id as an integer
        return this.sendRequestWithHeadersPost('Kategori/Delete', 'DELETE', categoryId, {
          'Authorization': `Bearer ${this.getCookie("session_key")}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        });
      })
      .then(() => {
        this.toastrService.success('Kategori başarıyla silindi.', 'Başarılı');
        this.newCategory = ''; // Reset input field
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
        this.toastrService.error('Kategori silinirken bir hata oluştu.', 'Hata');
      });
  }
  
  
  

  sendRequestWithHeadersPost(url: string, method: string, data?:any, header?: any): Promise<any> {
    console.log("requesin içi"+JSON.stringify(data));
    return fetch(`https://bycobackend.online:5001/api/${url}`, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: header,
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data), 
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
      return response.json();
  })
  }



  logout() {
    // Çerezdeki tokeni silme
    this.setCookie("session_key", "", -1); // Çerezin geçerlilik süresini sıfır yaparak siliyoruz.

    // Kullanıcıyı login sayfasına yönlendir
    this.router.navigate(['/pages/login']);
    console.log("Çıkış yapıldı ve token silindi.");
}

toggleDetails(siparisId: number): void {
  if (this.selectedSiparisId === siparisId) {
    this.selectedSiparisId = null; // Seçili id'yi kaldır
  } else {
    this.selectedSiparisId = siparisId; // Yeni id'yi seç
  }
}

  calculateTotal(urunler: any[]): number {
    return urunler.reduce((total, urun) => total + (urun.fiyat * urun.stok), 0);
  }
  // Durumları Türkçe etiketlerle döndürür
getStatusLabel(durum: string): string {
  switch (durum) {
    case 'Kargoya Verildi':
      return 'Kargoya Verildi';
    case 'Ödeme Alındı':
      return 'Ödeme Alındı';
    case 'Odeme Alindi':
      return 'Ödeme Alındı';
    case 'Teslim Edildi':
      return 'Teslim Edildi';
    case 'Ödemeye gönderildi':
      return 'Ödemeye gönderildi';
    default:
      return 'Bilinmeyen';
  }
}

// Duruma göre uygun bir CSS sınıfı döndürür
getStatusClass(durum: string): string {
  switch (durum) {
    case 'Kargoya Verildi':
      return 'status pending';
    case 'Ödeme Alındı':
      return 'status done';
    case 'Teslim Edildi':
      return 'status reply';
    default:
      return 'status hold';
  }
}

  getKategoriSecenek() {
    this.sendRequest('Kategori/GetAllValueText', 'GET')
      .then(response => {
        console.log(response);
        this.kategoriSec = response;


      })
      .catch(err => {
        console.error("Error: " + err);
        //this.router.navigate(['/pages/login']);
      })

  }
  getKategoriListesi() {
    this.sendLocalRequest('Kategori/GetAll', 'GET')
        .then((response: any) => {
            console.log("Gelen Kategori Listesi:", response); // Gelen veriyi kontrol edin
            this.kategoriSec = response.map((item: any) => ({
                value: item.id.toString(),
                text: `${item.urunturu} - ${item.ad}`
            }));
        })
        .catch(err => {
            console.error("Kategoriler alınırken hata oluştu:", err);
        });
}



  getMusteriler() {
    this.sendRequest('Satis/GetMusteriBilgileri', 'GET')
      .then(response => {
        console.log(response.data);
        this.musterilerDeneme = response.data;


      })
      .catch(err => {
        console.error("Error: " + err);
        //this.router.navigate(['/pages/login']);
      })
  }
  hasNewOrders: boolean = false; // Yeni sipariş olup olmadığını kontrol eden değişken

  getOrders() {
    this.sendRequestWithHeaders('Siparis/GetAll', 'GET', {
      'Authorization': `Bearer ${this.getCookie("session_key")}`
    })
      .then((response: any[]) => {
        console.log("Siparişler başarıyla alındı:", response);
  
        // Önceki sipariş ID'lerini al
        const previousOrderIds = JSON.parse(localStorage.getItem('orderIds') || '[]');
  
        // Yeni siparişleri kontrol et
        const newOrders = response.filter(order => !previousOrderIds.includes(order.siparis_id));
  
        this.siparisler = response;
        this.filteredSiparisler = [...this.siparisler];
  
        // Yeni sipariş varsa bildirimi göster
        this.hasNewOrders = newOrders.length > 0;
  
        // Yeni sipariş ID'lerini kaydet
        const currentOrderIds = response.map(order => order.siparis_id);
        localStorage.setItem('orderIds', JSON.stringify(currentOrderIds));
      })
      .catch(err => {
        console.error("Siparişler alınırken hata oluştu:", err);
      });
  }
  
  
  markOrdersAsRead() {
    console.log('Tab açıldı, bildirim kaldırılıyor...');
    this.hasNewOrders = false; // Kullanıcı tab'a tıkladığında bildirimi kaldırır
  }
  
  
  


  getIdFromSession() {
    console.log("sessionkey ===" + this.getCookie("session_key"))
    this.sendRequest('Sessions/Validate/' + this.getCookie("session_key"), 'GET')
      .then(response => {
        console.log(response);
        this.userid = response;
        this.getUserById();

      })
      .catch(err => {
        console.error("Error: " + err);
        this.router.navigate(['/pages/login']);
      })

  }

  getUserById() {
    this.sendRequest('User/GetResponseById/' + this.userid, 'GET')
      .then(response => {
        console.log(response.data);
        this.myObject = response.data;
        if (this.myObject.tip == 0) {
          this.getMusteriler();
        }


      })
      .catch(err => {
        console.error("Error: " + err);
        //this.router.navigate(['/pages/login']);
      })
  }


  sendRequest(url: string, method: string, data?: any): Promise<any> {

    return fetch(`https://bycobackend.online:5001/api/${url}`, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
  }
  sendLocalRequest(url: string, method: string, data?: any): Promise<any> {
    return fetch(`https://bycobackend.online:5001/api/${url}`, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      });
  }

  getCookie(name: string) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  setCookie(name: string, value: string, days: number) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  changeHandler(selectedOption: { value: string; text: string }) {
    console.log("Seçilen Kategori:", selectedOption); // Hangi kategori seçildiğini kontrol edin
    const selectedCategory = this.kategoriSec.find(item => item.value === selectedOption.value);
    if (selectedCategory) {
        this.urundeneme.kategori = selectedCategory.text; // Kategori doğru atandı
    } else {
        console.error("Kategori bulunamadı!");
    }
}


  urunTuruChangeHandler(selectedOption: { value: string; text: string }) {
    this.urunTuru = selectedOption.value;
  }
  entityChangeHandler(selectedEntity: any) {
    this.entity = selectedEntity; // Seçilen entity değerini modelde güncelle
  }
  
  updatePassword() {
    console.log('yeni =' + this.newPassword + ', eski =' + this.confirmPassword);
    if (this.newPassword === this.confirmPassword && this.confirmPassword.length > 7) {
      
      // Şifre güncelleme işlemi burada gerçekleştirilir
      this.sendRequestWithHeadersPost('User/UpdatePassword', 'PUT', this.confirmPassword,{
        'Authorization': `Bearer ${this.getCookie("session_key")}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
        .then(response => {
          console.log(response);
  
        })
        .catch(err => {
          console.error("Error: " + err);
          //this.router.navigate(['/pages/login']);
        })
      console.log('yeni =' + this.newPassword + ', eski =' + this.confirmPassword);
      console.log('Şifre güncellendi.');
      this.passwordUpdated = true;
      this.passwordMismatch = false;
      // Örneğin: AuthService aracılığıyla güncelleme işlemi yapılabilir
    } else {
      console.log('Yeni şifreler uyuşmuyor.');
      this.passwordMismatch = true;
      this.passwordUpdated = false;
    }
  }

  updateDiscount(id: string, index: number) {
    let indirimReq = {
      kullanici_id: id,
      indirim_miktari: this.indirimyeni[index]
    }
  }

  updateInfo() {
    console.log(this.myObject);
    this.sendRequestWithHeadersPost('User/Update', 'PUT', this.myObject,{
      'Authorization': `Bearer ${this.getCookie("session_key")}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
      .then(response => {
        console.log(response);

      })
      .catch(err => {
        console.error("Error: " + err);
        //this.router.navigate(['/pages/login']);
      })
  }

  addCategory() {
    if (!this.urunTuru) {
      this.toastrService.error('Ürün Türü seçilmedi.', 'Hata');
      return;
    }
  
    const kategori = {
      id: 0,
      ad: this.newCategory,
      urunturu: this.urunTuru
    };
  
    this.sendRequestWithHeadersPost('Kategori/Add', 'POST', kategori, {
      'Authorization': `Bearer ${this.getCookie("session_key")}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
      .then(response => {
        console.log('Kategori eklendi:', response);
        this.toastrService.success('Kategori başarıyla eklendi.', 'Başarılı');
        this.newCategory = '';
        this.urunTuru = '';
      })
      .catch(err => {
        console.error("Error adding category: ", err);
        this.toastrService.error('Kategori eklenirken bir hata oluştu.', 'Hata');
      });
  }
  



  addUrun() {
    console.log(this.urundeneme);
    this.gonderilecekUrun = {
      ad: this.urundeneme.ad,
      stok: Number(this.urundeneme.stok),
      aciklama: this.urundeneme.aciklama,
      img: this.urundeneme.img,
      fiyat: Number(this.urundeneme.fiyat),
      kategori: this.urundeneme.kategori,
      kod: this.urundeneme.kod,

      amper: this.urundeneme.amper,
      aydinlatmaTuru: this.urundeneme.aydinlatmaTuru,
      cerceve: this.urundeneme.cerceve,
      damarSayisi: this.urundeneme.damarSayisi,

      disKilifRengi: this.urundeneme.disKilifRengi,
      duy: this.urundeneme.duy,
      isikRengi: this.urundeneme.isikRengi,
      kabloTipi: this.urundeneme.kabloTipi,

      kabloUzunlugu: this.urundeneme.kabloUzunlugu,
      kanalBoyutu: this.urundeneme.kanalBoyutu,
      kanalOzelligi: this.urundeneme.kanalOzelligi,
      kanalRengi: this.urundeneme.kanalRengi,

      kasaRengi: this.urundeneme.kasaRengi,
      kesit: this.urundeneme.kesit,
      kesmeKapasitesi: this.urundeneme.kesmeKapasitesi,
      kullanimYeri: this.urundeneme.kullanimYeri,

      kutup: this.urundeneme.kutup,
      marka: this.urundeneme.marka,
      model: this.urundeneme.model,
      prizSayisi: this.urundeneme.prizSayisi,

      renk: this.urundeneme.renk,
      renkSicakligiKelvin: this.urundeneme.renkSicakligiKelvin,
      sigortaSayisi: this.urundeneme.sigortaSayisi,
      tip: this.urundeneme.tip,

      tur: this.urundeneme.tur,
      urun: this.urundeneme.urun,
      urunOzelligi: this.urundeneme.urunOzelligi,
      urunTipi: this.urundeneme.urunTipi,

      watt: this.urundeneme.watt,
      indirim: Number(this.urundeneme.indirim)

    }
    console.log("bue");
    console.log(this.gonderilecekUrun);
    this.sendRequestWithHeadersPost('Urun/Add', 'POST', this.gonderilecekUrun, {
      'Authorization': `Bearer ${this.getCookie("session_key")}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
      .then(response => {
        console.log('Ürün eklendi:', response);
        if(response.statusCode == 200){
          this.toastrService.success('Ürün başarıyla eklendi.', 'Başarılı');
        } else {
          this.toastrService.error(response.reasonString, 'Hata');

        }
        this.newCategory = '';
        this.urunTuru = '';
      })
      .catch(err => {
        console.error("Error adding product: ", err);
        this.toastrService.error('Ürün eklenirken bir hata oluştu.', 'Hata');
      });
  }
  clearInputs() {
    this.urundeneme = {
      ad: '',
      kategori: '', // kategori özelliğini de ekleyin
      img: '',
      kod: '',
      aciklama: '',
      urun: '',
      amper: '',
      aydinlatmaTuru: '',
      cerceve: '',
      damarSayisi: '',
      disKilifRengi: '',
      duy: '',
      isikRengi: '',
      kabloTipi: '',
      kabloUzunlugu: '',
      kanalBoyutu: '',
      kanalOzelligi: '',
      kanalRengi: '',
      kasaRengi: '',
      kesit: '',
      kesmeKapasitesi: '',
      kullanimYeri: '',
      kutup: '',
      marka: '',
      model: '',
      prizSayisi: '',
      renk: '',
      renkSicakligiKelvin: '',
      sigortaSayisi: '',
      tip: '',
      tur: '',
      urunOzelligi: '',
      urunTipi: '',
      watt: '',
      stok: '',
      fiyat: '',
      indirim: ''
    };
  }
  currentPage: number = 1;
  itemsPerPage: number = 10; // Her sayfada 10 sipariş gösterilecek

  get paginatedSiparisler() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredSiparisler
      .slice() // Diziyi kopyala
      .reverse() // Son siparişin en başta olması için ters çevir
      .slice(startIndex, endIndex); // Sayfa içeriğini al
  }

  changePage(page: number) {
    this.currentPage = page;
  }
  get totalPages(): number[] {
    return Array(Math.ceil(this.siparisler.length / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
  }
  sortColumn: string = ''; // Hangi sütunun sıralandığını tutar
sortOrder: boolean = true; // true: artan, false: azalan

statusPriority: { [key: string]: number } = {
  "Teslim Edildi": 1,
  "Kargoya Verildi": 2,
  "Ödeme Alındı": 3,
  "Bilinmeyen": 4
};

sortData(column: string) {
  if (this.sortColumn === column) {
    // Aynı sütuna tekrar basıldığında sıralama yönünü değiştir
    this.sortOrder = !this.sortOrder;
  } else {
    // Yeni bir sütuna basıldığında artan sıradan başla
    this.sortColumn = column;
    this.sortOrder = true;
  }

  this.filteredSiparisler.sort((a: any, b: any) => {
    let comparison = 0;

    if (column === 'tarih') {
      // Tarihi sıralarken Date nesnesini kullan
      comparison = new Date(a[column]).getTime() - new Date(b[column]).getTime();
    } else if (column === 'fiyat') {
      // Fiyatları sıralarken sayısal sıralama
      comparison = a[column] - b[column];
    } else if (column === 'durum') {
      // Durumları öncelik sırasına göre sıralama
      const priorityA = this.statusPriority[this.getStatusLabel(a[column])] || 99;
      const priorityB = this.statusPriority[this.getStatusLabel(b[column])] || 99;
      comparison = priorityA - priorityB;
    } else {
      // Diğer sütunlar için alfabetik sıralama
      comparison = a[column].localeCompare(b[column], 'tr', { sensitivity: 'base' });
    }

    return this.sortOrder ? comparison : -comparison; // Sıralama yönünü uygula
  });
}


getSortIcon(column: string): string {
  if (this.sortColumn !== column) {
    return ''; // Eğer sütun sıralanmıyorsa ikon gösterme
  }
  return this.sortOrder ? '▲' : '▼'; // Artan için yukarı ok, azalan için aşağı ok
}

searchText: string = ''; // Arama metni
filteredSiparisler: any[] = []; // Filtrelenmiş siparişler

filterSiparisler() {
  const search = this.searchText?.trim().toLowerCase();

  if (!search) {
    // Eğer arama metni boşsa tüm siparişleri göster
    this.filteredSiparisler = [...this.siparisler];
  } else {
    // Arama metni doluysa filtreleme yap
    this.filteredSiparisler = this.siparisler.filter(siparis => {
      return (
        siparis.siparisno.toString().toLowerCase().includes(search) || // Sipariş numarası kontrolü
        siparis.ad.toLowerCase().includes(search) || // Müşteri adı kontrolü
        this.getStatusLabel(siparis.durum).toLowerCase().includes(search) // Durum kontrolü
      );
    });
  }

  // Arama sonrası sayfalamayı sıfırla
  this.currentPage = 1;
}
orderInput: string = '';
trackingInput: string = '';
orderList: string[] = [];
trackingList: string[] = [];

// Sipariş No ve Kargo No Listesini Güncelle
updateOrderList(): void {
  this.orderList = this.orderInput.split('\n').map(line => line.trim()).filter(line => line !== '');
}

updateTrackingList(): void {
  this.trackingList = this.trackingInput.split('\n').map(line => line.trim()).filter(line => line !== '');
}

// Gönderim İşlemi
submitShippingEntries(): void {
  if (this.orderList.length !== this.trackingList.length) {
    this.toastrService.error('Sipariş ve Kargo numaralarının sayısı eşleşmiyor!', 'Hata');
    return;
  }

  const requests = this.orderList.map((order, index) => {
    const payload = {
      siparisno: order,
      kargono: this.trackingList[index],
    };
    

    return this.sendRequestWithHeadersPost('Siparis/SiparisKargoda', 'POST', payload, {
      'Authorization': `Bearer ${this.getCookie('session_key')}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
      .then(() => this.toastrService.success(`Başarıyla güncellendi: ${order}, ${this.trackingList[index]}`, 'Başarılı'))
      .catch(err => this.toastrService.error(`Hata oluştu: ${order}`, 'Hata'));
  });

  Promise.all(requests)
    .then(() => this.toastrService.success('Tüm gönderiler başarıyla kaydedildi!', 'Başarılı'))
    .catch(err => this.toastrService.error('Toplu giriş sırasında bir hata oluştu!', 'Hata'));
}

allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);
  if (charCode < 48 || charCode > 57) { // ASCII for 0-9
    event.preventDefault();
  }
}

}
