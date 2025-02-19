import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { URL } from '@/shared/services/url';

@Component({
  selector: 'app-blog-reply-form',
  templateUrl: './blog-reply-form.component.html',
  styleUrls: ['./blog-reply-form.component.scss']
})
export class BlogReplyFormComponent {

    //benimUrl = this.urlhost.geturl();
  public blogReplyForm!: FormGroup;
  public formSubmitted = false;

  constructor(private toastrService: ToastrService) { }

  ngOnInit () {
    this.blogReplyForm = new FormGroup({
      ad:new FormControl(null,Validators.required),
      lokasyon:new FormControl(null,Validators.required),
      tamamlanma:new FormControl(null,Validators.required),
      alan:new FormControl(null,Validators.required),
      isveren:new FormControl(null,Validators.required),
      aciklama:new FormControl(null,Validators.required),
      img:new FormControl(null,Validators.required)
      
    })
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.blogReplyForm.valid) {
      console.log('blog-reply-form-value', this.blogReplyForm.value);
      this.toastrService.success(`Message sent successfully`);
      this.ProjeYukle();
      // Reset the form
      this.blogReplyForm.reset();
      this.formSubmitted = false; // Reset formSubmitted to false
    }
    console.log('contact-form', this.blogReplyForm);
  }

  ProjeYukle(){
    this.sendRequest('Satis/MakePurchase','POST',{
        "ad": this.blogReplyForm.get("ad")?.value,
        "lokasyon": this.blogReplyForm.get("lokasyon")?.value,
        "tamamlanma": this.blogReplyForm.get("tamamlanma")?.value,
        "alan": this.blogReplyForm.get("alan")?.value,
        "isveren": this.blogReplyForm.get("isveren")?.value,
        "aciklama": this.blogReplyForm.get("aciklama")?.value,
        "img": this.blogReplyForm.get("img")?.value
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

  get ad() { return this.blogReplyForm.get('ad') }
  get lokasyon() { return this.blogReplyForm.get('lokasyon') }
  get tamamlanma() { return this.blogReplyForm.get('tamamlanma') }
  get alan() { return this.blogReplyForm.get('alan') }
  get isveren() { return this.blogReplyForm.get('isveren') }
  get aciklama() { return this.blogReplyForm.get('aciklama') }
  get img() { return this.blogReplyForm.get('img') }
}
