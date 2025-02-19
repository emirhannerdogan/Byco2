import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { URL } from '@/shared/services/url';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {

  isShowPass = false;

  handleShowPass () {
    this.isShowPass = !this.isShowPass;
  }

  isShowTypeMessage = false;
  //benimUrl = this.urlhost.geturl();

  public registerForm!: FormGroup;
  public formSubmitted = false;
  public userType = "null";

  constructor(private toastrService: ToastrService, private router: Router) { }

  ngOnInit () {
    this.registerForm = new FormGroup({
      name:new FormControl(null,[Validators.required]),
      surname:new FormControl(null,[Validators.required]),
      email:new FormControl(null,[Validators.required,Validators.email]),
      tel:new FormControl(null,[Validators.required]),
      password:new FormControl(null,[Validators.required,Validators.minLength(6)]),
      type: new FormControl(null,Validators.compose([Validators.pattern("bireysel"), Validators.pattern("kurumsal")])),
      tcknvkn: new FormControl(null,[Validators.required,Validators.minLength(6)]),
      teslimatadresi: new FormControl(null,[Validators.required]),
      faturaadresi: new FormControl(null,[Validators.required]),
    })
  }

  onInput(event: any): void {
    const pattern = /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]*$/; // Sadece harf ve boşluk
    const inputChar = event.target.value;

    if (!pattern.test(inputChar)) {
      event.target.value = inputChar.replace(/[^a-zA-ZğüşöçıİĞÜŞÖÇ\s]/g, ''); // Geçersiz karakterleri sil
    }
  }


  kaydol(name:string,surname:string,email:string, tel:string, password:string, tcknvkn:string, teslimatadresi:string, faturaadresi:string){
    if(this.userType!="null") console.log("null");
    if(name.length>0&&surname.length>0&&email.length>0&&password.length>=6&&this.userType!="null"&&teslimatadresi.length>0&&faturaadresi.length>0){
        console.log(name +" " + surname + " " +email + " "+password+"  tip:"+this.userType)
        console.log("tcknvkn:"+tcknvkn+" teslimatadresi:"+teslimatadresi+" faturaadresi:"+faturaadresi);
        fetch(`https://bycobackend.online:5001/api/User/RegisterUser`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(
              {
                ad: name, 
                soyad: surname, 
                email: email, 
                password: password, 
                telefon: tel,
                tip: this.userType, 
                tcknvkn: tcknvkn,
                faturaadresi: faturaadresi,
                teslimatadresi: teslimatadresi
              }
            ), 
          }
        ).then(response => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            this.gec();
          }
        );
    }
    else if(this.userType!="null") this.isShowTypeMessage=true;
    const requestBody = {
      ad: name,
      soyad: surname,
      email: email,
      password: password,
      telefon: tel,
      tip: this.userType,
      tcknvkn: tcknvkn,
      faturaadresi: faturaadresi,
      teslimatadresi: teslimatadresi
  };
  console.log('Request Body:', requestBody);
  
  }

  updateAccountType(type: 'individual' | 'corporate') {
    if (type === 'individual') {
      this.userType = "1"; // Bireysel için 1
    } else {
      this.userType = "2"; // Kurumsal için 2
    }
  
    // Form üzerindeki 'type' kontrolünü güncelle
    this.registerForm.patchValue({ type: this.userType });
    console.log(this.userType);
  }
  
  

  gec(){
    this.router.navigate(['/pages/login']);
  }

  onSubmit() {
    this.formSubmitted = true;
    
    // Kullanıcı tipi seçilmediyse uyarı göster
    if (this.userType === "null") {
      this.isShowTypeMessage = true;
    } else {
      this.isShowTypeMessage = false;
    }
    
    if (this.registerForm.valid && this.userType !== "null") {
      console.log('register-form-value', this.registerForm.value);
      this.toastrService.success(`Message sent successfully`);
  
      // Formu sıfırlama
      this.registerForm.reset();
      this.formSubmitted = false; // Reset formSubmitted to false
    }
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) { // ASCII for 0-9
      event.preventDefault();
    }
  }

  get name() { return this.registerForm.get('name') }
  get surname() { return this.registerForm.get('surname') }
  get email() { return this.registerForm.get('email') }
  get tel() {return this.registerForm.get('tel')}
  get password() { return this.registerForm.get('password') }
  get tcknvkn() { return this.registerForm.get('tcknvkn') }
  get teslimatadresi() { return this.registerForm.get('teslimatadresi') }
  get faturaadresi() { return this.registerForm.get('faturaadresi') }
}
