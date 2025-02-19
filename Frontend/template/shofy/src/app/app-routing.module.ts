import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {LocationStrategy, PathLocationStrategy} from "@angular/common";

const routes: Routes = [
  { path: 'robots.txt', redirectTo: '/assets/robots.txt', pathMatch: 'full' },
  { path: 'sitemap.xml', redirectTo: '/assets/sitemap.xml', pathMatch: 'full' },

  {
    path: 'anasayfa',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    pathMatch: "prefix"
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
    pathMatch: "prefix"
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    pathMatch: "prefix"
  },
  {
    path: '',
    redirectTo: '/anasayfa',
    pathMatch: 'full'
  },
  {
    path: '**',
    component:NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    useHash: false,
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class AppRoutingModule {

}
