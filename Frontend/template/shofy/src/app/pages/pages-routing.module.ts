import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { BlogGridComponent } from './blog/blog-grid/blog-grid.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
import { DynamicBlogDetailsComponent } from './blog/dynamic-blog-details/dynamic-blog-details.component';
import { CouponComponent } from './coupon/coupon.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import {PaymentErrorOccurredComponent} from "./payment-error-occurred/payment-error-occurred.component";
import {PaymentSuccessfulComponent} from "./payment-successful/payment-successful.component";
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import { CatalogsComponent } from './catalogs/catalogs.component';

const routes: Routes = [
  {
    path:'contact',
    component:ContactComponent,
    title:'Iletişim'
  },
  {
    path:'hakkimizda',
    component:BlogComponent,
    title:'Hakkımızda'
  },
  /*
  {
    path:'blog-grid',
    component:BlogGridComponent,
    title:'Blog Grid Page'
  },
  */
  {
    path:'hizmetler',
    component:BlogListComponent,
    title:'Hizmetlerimiz'
  },
  {
    path:'biten-projeler/:category',
    component:BlogDetailsComponent,
    title:'Biten Projeler'
  },
  {
    path:'privacy/:type',
    component:DynamicBlogDetailsComponent,
    title:'Gizlilik Politikası'
  },
  {
    path:'coupons',
    component:CouponComponent,
    title:'Kupon Ekranı'
  },
  {
    path:'about',
    component:AboutComponent,
    title:'Hakkımızda'
  },
  {
    path:'login',
    component:LoginComponent,
    title:'Giriş'
  },
  {
    path:'register',
    component:RegisterComponent,
    title:'Kaydol'
  },
  {
    path:'forgot',
    component:ForgotPasswordComponent,
    title:'Şifre Yenileme'
  },
  {
    path:'checkout',
    component:CheckoutComponent,
    title:'Ödeme Sayfası'
  },
  {
    path:'catalogs',
    component:CatalogsComponent,
    title:'Kataloglar'
  },
  {
    path:'profile',
    component:ProfileComponent,
    title:'Profil'
  },
  {
    path:'search',
    component:SearchComponent,
    title:'Arama Sayfası'
  },
  {
    path:'payment-error-occurred',
    component:PaymentErrorOccurredComponent,
    title:'Ödeme Hatası'
  },
  {
    path:"payment-successful",
    component:PaymentSuccessfulComponent,
    title:'Ödeme Başarılı'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class PagesRoutingModule { }
