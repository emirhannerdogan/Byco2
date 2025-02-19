import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeautyComponent } from './beauty/beauty.component';
import { FashionComponent } from './fashion/fashion.component';
import { ElectronicsComponent } from './electronics/electronics.component';
import { JewelryComponent } from './jewelry/jewelry.component';
import {LocationStrategy, PathLocationStrategy} from "@angular/common";

const routes: Routes = [
  // {
  //   path:'electronic',
  //   component:ElectronicsComponent,
  //   title:'Shofy - Multipurpose eCommerce Angular Template'
  // },
 {
     path:'projeler',
     component:FashionComponent,
     title:'Projeler'
  },
  {
    path:'',
    component:BeautyComponent,
    title:'BYCO'
  },
  {
    path:'teklif/:id',
    component:JewelryComponent,
    title:'Teklif Al'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class HomeRoutingModule { }
