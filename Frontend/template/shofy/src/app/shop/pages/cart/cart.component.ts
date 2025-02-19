import { CartService } from '@/shared/services/cart.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  showPopup = false;

  couponCode: string = '';
  shipCost: number = 0; // Kargo ücreti varsayılan olarak 100 TL

  constructor (public cartService:CartService
    , private router: Router
  ) {}
  ngOnInit() {
    this.fetchShippingCost();
  }
  handleCouponSubmit() {
    console.log(this.couponCode);
    // Add coupon code handling logic here
    if(this.couponCode){
      // logic here

      // when submitted the from than empty will be coupon code
      this.couponCode = ''
    }
  }

  handleShippingCost(value: number | string) {
    if (value === 'free') {
      this.shipCost = 0;
    } else {
      this.shipCost = value as number;
    }
  }

  checkTokenAndRedirect() {
    const token = this.getCookie("session_key");

    if (token) {
      // Token varsa, checkout sayfasına yönlendir
      this.router.navigate(['/pages/checkout']);
    } else {
      // Token yoksa, popup'ı göster
      this.showPopup = true;
    }
  }
  getTokenFromCookies(): string | null {
    // Cookie'den token'ı al, burada basit bir örnekle çerez okuma işlemi var
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
  redirectToLogin() {
    // Üye Ol butonuna basıldığında login sayfasına yönlendirme
    this.showPopup = false;
    this.router.navigate(['/pages/login']);
  }

  continueWithoutAccount() {
    // Üye Olmadan Devam Et butonuna basıldığında checkout sayfasına yönlendirme
    this.showPopup = false;
    this.router.navigate(['/pages/checkout']);
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
  fetchShippingCost() {
    this.sendLocalRequest('Urun/GetById/16', 'GET')
      .then(response => {
        // Assuming `fiyat` is the price from the product data
        if (response && response.fiyat != null) {
          this.shipCost = response.fiyat;
          console.log('Shipping cost set to:', this.shipCost);
        } else {
          console.error('Failed to fetch shipping cost: invalid response format');
        }
      })
      .catch(err => {
        console.error('Error fetching shipping cost:', err);
      });
  }
  sendLocalRequest(url: string, method: string, data?: any): Promise<any> {
    console.log("Request Data:", JSON.stringify(data, null, 2));
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
      .then(async response => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error Text:", errorText);
          throw new Error(`Status: ${response.status}, Message: ${errorText}`);
        }
        return response.json();
      });
  }
}
