import { Component } from '@angular/core';
import { CartService } from '@/shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.scss']
})
export class CartSidebarComponent {
  showPopup = false;

  constructor(public cartService:CartService, private router: Router){}
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
}
