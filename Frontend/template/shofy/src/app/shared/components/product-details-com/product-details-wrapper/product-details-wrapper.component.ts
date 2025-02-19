import { Component, Input } from '@angular/core';
import { IProduct } from '@/types/product-type';
import { ProductService } from 'src/app/shared/services/product.service';
import { CartService } from '@/shared/services/cart.service';
import { URL } from '@/shared/services/url';
import { CompareService } from '@/shared/services/compare.service';

@Component({
  selector: 'app-product-details-wrapper',
  templateUrl: './product-details-wrapper.component.html',
  styleUrls: ['./product-details-wrapper.component.scss'],
})
export class ProductDetailsWrapperComponent {
  @Input() product!: IProduct;
  @Input() isShowBottom: boolean = true;

  textMore = false;
  yeniFiyat: string = "";
  userid: number = -1;
  benimUrl = "";

  isTabHidden: boolean = false;

  handleTextToggle() {
    this.textMore = !this.textMore;
  }
  toggleTab() {
    this.isTabHidden = !this.isTabHidden;
  }
  constructor(
    public productService: ProductService,
    public cartService: CartService,
    public compareService: CompareService,
    
  ) {}

//   handleIsColorVariant(product: IProduct) {
//     if (product.img.some((item) => item?.color && item?.color?.name)) {
//       return true;
//     } else {
//       return false;
//     }
//   }

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

  ngOnInit() {
    //this.getIdFromSession();
    this.getUserByToken();
  }

  // getIdFromSession(){
  //   console.log("sessionkey ===" + this.getCookie("session_key"))
  //   this.sendRequest('Sessions/Validate/'+ this.getCookie("session_key"),'GET')
  //   .then(response => {
  //     console.log(response);
  //     this.userid=response;
  //     this.getUserById();
      
  //   })
  //   .catch(err => {
  //     console.error("Error: " + err);
  //   })

  // }

  addToCompare(product: IProduct) {
    this.compareService.add_compare_product(product);
  }
  isItemInCompare(item: IProduct): boolean {
    return this.compareService.getCompareProducts().some((prd: IProduct) => prd.id === item.id);
  }
  getCookie(name:string) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  sendRequest(url: string, method: string, data?:any, header?: any): Promise<any> {
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

  getUserByToken() {
    const token = this.getCookie("session_key");
    if (!token) {
        // Kullanıcı giriş yapmamışsa tip değerini 3 olarak ata
        this.myObject.tip = 3;
        return;
    }

    // Giriş yapılmışsa kullanıcı verilerini al
    this.sendRequestWithHeaders('User/GetUser', 'GET', {
        'Authorization': `Bearer ${token}`
    })
    .then(response => {
        console.log("getUser başarılı");
        this.myObject = response;
    })
    .catch(err => {
        console.error("getUser başarısız:", err);
        this.myObject.tip = 3; // Hata durumunda da tip değerini 3 olarak ata
    });
}

  
  urunuSil(product:IProduct){
    this.sendRequest('Urun/Delete/'+ product.id,'DELETE')
    .then(response => {
      console.log(response.data);
    })
    .catch(err => {
      console.error("Error: " + err);
    })

  }

  fiyatGuncelle(){
    console.log(this.yeniFiyat);

  }
  formatPrice(price: number): string {
    return price
      .toFixed(2) // İki ondalık haneye yuvarla
      .replace('.', ',') // Ondalık ayracı olarak virgül kullan
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Binlik ayrımlar için nokta ekle
  }
}
