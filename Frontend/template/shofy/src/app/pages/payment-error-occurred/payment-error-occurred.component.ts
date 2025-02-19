import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment-error-occurred',
  templateUrl: './payment-error-occurred.component.html',
  styleUrls: ['./payment-error-occurred.component.scss']
})
export class PaymentErrorOccurredComponent {

  protected remainingTime = 30;
  private intervalId: any;

  constructor(private router: Router) {
    this.countDown();
  }

  countDown() {
    this.intervalId = setInterval(() => {
      if (this.remainingTime <= 0) {
        clearInterval(this.intervalId);
        this.router.navigate(['/pages/cart']).then(r => console.log(r));
      }
      this.remainingTime--;
    }, 1000);
  }
}
