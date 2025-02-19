import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { URL } from '@/shared/services/url';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  public contactForm!: FormGroup;
  public formSubmitted = false;

  //benimUrl = this.urlhost.geturl();
  constructor(private toastrService: ToastrService) { }


  ngOnInit () {
    this.contactForm = new FormGroup({
      name:new FormControl(null,Validators.required),
      email:new FormControl(null,[Validators.required,Validators.email]),
      subject:new FormControl(null,Validators.required),
      message:new FormControl(null,Validators.required),
    })
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.contactForm.valid) {
      console.log('contact-form-value', this.contactForm.value);
      this.toastrService.success(`Message sent successfully`);
      this.SendMessage();

      // Reset the form
      this.contactForm.reset();
      this.formSubmitted = false; // Reset formSubmitted to false
    }
    console.log('contact-form', this.contactForm);
  }

  SendMessage(){
    this.sendRequest('Mail/iletisim','POST',{
        "isim": this.contactForm.get("name")?.value,
        "email": this.contactForm.get("email")?.value,
        "konu": this.contactForm.get("subject")?.value,
        "mesaj": this.contactForm.get("message")?.value,
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.error("Error: " + err);
    })



  }

  sendRequest(url: string, method: string, data?:any): Promise<any> {
    console.log("requesin içi"+JSON.stringify(data));
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

  get name() { return this.contactForm.get('name') }
  get email() { return this.contactForm.get('email') }
  get subject() { return this.contactForm.get('subject') }
  get message() { return this.contactForm.get('message') }
}
