import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ToastrModule} from 'ngx-toastr';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ShopComponent} from './shop/pages/shop/shop.component';
import {ShopModule} from './shop/shop.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddressComponent} from './address/address.component';
import {PaymentErrorOccurredComponent} from './pages/payment-error-occurred/payment-error-occurred.component';
import {PaymentSuccessfulComponent} from './pages/payment-successful/payment-successful.component';
import {HashUrlRedirectionService} from "./httpservices/hash-url-redirection.service";
import {Router} from "@angular/router";
import {HomeModule} from "./home/home.module";
import {PagesModule} from "./pages/pages.module";
import { ShopMainPageComponent } from './shop/shop-main-page/shop-main-page.component';
import { ShopRoutingModule } from './shop/shop-routing.module';

export function initializeApp(hashUrlRedirectionService: HashUrlRedirectionService) {
  if (hashUrlRedirectionService.isHashUrl()) {
    return hashUrlRedirectionService.redirectHashUrl();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    AddressComponent,
    PaymentErrorOccurredComponent,
    PaymentSuccessfulComponent,
    ShopMainPageComponent,
    
  ],
  imports: [
    SharedModule,
    ShopModule,
    HomeModule,
    PagesModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: false,
      enableHtml: true,
      positionClass: 'toast-top-center'
    }),
    ReactiveFormsModule,
    ShopRoutingModule,
  ],
  exports: [
    ShopComponent,
  ],
  providers: [
    HashUrlRedirectionService,
    {
      provide: 'APP_INITIALIZER',
      useFactory: initializeApp,
      deps: [HashUrlRedirectionService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
