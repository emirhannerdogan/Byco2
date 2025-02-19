import { Component, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  public forgotForm!: FormGroup;
  public formSubmitted = false;
  public showConfirmation = false; // Popup görünürlüğü için değişken

  constructor(private toastrService: ToastrService, private renderer: Renderer2) { }

  ngOnInit() {
    this.forgotForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  openConfirmationPopup() {
    this.showConfirmation = true; // Popup’ı açar
    this.renderer.addClass(document.body, 'modal-open');

  }

  closeConfirmationPopup() {
    this.showConfirmation = false; // Popup’ı kapatır
    this.renderer.removeClass(document.body, 'modal-open');

  }

  confirmResetPassword() {
    this.formSubmitted = true;
    
    if (this.forgotForm.valid) {
      this.showConfirmation = false; // İşlem sonrası popup’ı kapatır

      const emailData = { mail: this.forgotForm.value.email };
      console.log('Sending email data to API:', emailData);

      this.sendRequest('User/SifremiUnuttum', 'POST', emailData)
        .then(response => {
          console.log('API response:', response);
          if (response.statusCode === 200) {
            this.toastrService.success('Şifre sıfırlama e-postası gönderildi');
            this.forgotForm.reset();
            this.formSubmitted = false;
          } else {
            this.toastrService.error(response.reasonString || 'İstek başarısız oldu');
          }
        })
        .catch(error => {
          console.error('API error:', error);
          this.toastrService.error('İstek başarısız oldu');
        });
    }
    this.closeConfirmationPopup();

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
      console.log('Raw response:', response);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }

  get email() { return this.forgotForm.get('email'); }
}
