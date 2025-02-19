import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { CartService } from '@/shared/services/cart.service';

@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.scss']
})
export class PaymentSuccessfulComponent {

    

    constructor(private router: Router,public cartService : CartService) {}

    orderId: string = '';
    protected remainingTime = 60;
    private intervalId: any;
  
    ngOnInit() {
      this.SendMessage();
      this.countDown();
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

      countDown() {
        this.intervalId = setInterval(() => {
          if (this.remainingTime <= 0) {
            clearInterval(this.intervalId);
            this.router.navigate(['/pages/shop']).then(r => console.log(r));
          }
          this.remainingTime--;
        }, 1000);
      }
  
    
      SendMessage(){
        this.sendRequest('Siparis/SiparisOdemeTamam','POST',{
            "siparisno": this.getCookie("sonsiparisno"),
        })
        .then(response => {
          localStorage.setItem("cart_products", JSON.stringify([]));
          console.log(response);
        })
        .catch(err => {
          console.error("Error: " + err);
        })
    
      }
      
      

      sendRequest(url: string, method: string, data?:any): Promise<any> {
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
      
      
}
