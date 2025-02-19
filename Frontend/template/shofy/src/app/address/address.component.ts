import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {


  public addressForm!: FormGroup;
  public addressFormSubmitted = false

  ngOnInit() {
  }



}
