import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '@/types/product-type';


const state = {
  compare_items: JSON.parse(localStorage['compare_products'] || '[]')
}

@Injectable({
  providedIn: 'root'
})


export class CompareService {
  
  isMobile(): boolean {
    return window.innerWidth <= 768;  // Ekran genişliği 768px ve altıysa mobil olarak kabul et
  }
  public getCompareProducts () {
    return state.compare_items;
  }

  constructor(private toastrService: ToastrService) { }

  // add_compare_product
  add_compare_product (payload: IProduct) {

    if (this.isMobile() && state.compare_items.length >= 2) {
      this.toastrService.warning('Mobilde en fazla 2 ürün karşılaştırabilirsiniz.');
      return; // Yeni ürün eklemeyi engelle
    }
    
    const isAdded = state.compare_items.findIndex((p: IProduct) => p.id === payload.id);
    if (isAdded !== -1) {
      state.compare_items = state.compare_items.filter((p: IProduct) => p.id !== payload.id);
      this.toastrService.error(`${payload.ad} karşılaştıracak ürünlerden çıkarıldı`);
    } else {
      state.compare_items.push(payload);
      this.toastrService.success(`${payload.ad} karşılaştırılacak ürünlere eklendi`);
    }
    localStorage.setItem("compare_products", JSON.stringify(state.compare_items));
  };
  // remove compare
  removeCompare(payload: IProduct) {
    state.compare_items = state.compare_items.filter((p: IProduct) => p.id !== payload.id);
    this.toastrService.error(`${payload.ad} karşılaştıracak ürünlerden çıkarıldı`);
    localStorage.setItem("compare_products", JSON.stringify(state.compare_items));
  };
  clearCompare() {
    state.compare_items = [];
    localStorage.removeItem('compare_products');
    this.toastrService.info('Karşılaştırma listesi temizlendi.');
  }
}
