import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '@/types/product-type';

const state = {
  cart_products: JSON.parse(localStorage['cart_products'] || '[]')
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public orderQuantity: number = 1;
  public isCartOpen: boolean = false;
  constructor(private toastrService: ToastrService) { }

  public getCartProducts(): IProduct[] {
    return state.cart_products;
  }

  handleOpenCartSidebar () {
    this.isCartOpen = !this.isCartOpen
  }

  // add_cart_product
  addCartProduct(payload: IProduct) {
    const isExist = state.cart_products.some((i: IProduct) => i.id === payload.id);
  
    if (payload.durum === 'tükendi' || payload.stok === 0) {
      this.toastrService.error(`Tükendi ${payload.ad}`);
      return; // Eğer stok yoksa işlemi durdur
    }
  
    if (!isExist) {
      const newItem = {
        ...payload,
        orderQuantity: this.orderQuantity, // Kullanıcı tarafından belirlenen miktar
      };
  
      state.cart_products.push(newItem);
      this.toastrService.success(`${this.orderQuantity} ${payload.ad} sepete eklendi`);
    } else {
      state.cart_products = state.cart_products.map((item: IProduct) => {
        if (item.id === payload.id) {
          // Varsayılan değerle item.orderQuantity'yi kontrol et
          const currentQuantity = item.orderQuantity || 0;
          const totalQuantity = currentQuantity + this.orderQuantity;
  
          if (payload.stok >= totalQuantity) {
            item.orderQuantity = totalQuantity; // Yeni miktarı güncelle
            this.toastrService.success(`${this.orderQuantity} ${item.ad} sepete eklendi`);
          } else {
            this.toastrService.error(`${payload.ad} için yeterli stok yok!`);
          }
        }
        return item;
      });
    }
  
    // Sepet bilgisini kaydet
    localStorage.setItem("cart_products", JSON.stringify(state.cart_products));
  
    // `orderQuantity` değerini sıfırla
    this.orderQuantity = 1;
  }
  
  

// total price quantity
  public totalPriceQuantity() {
    return state.cart_products.reduce(
      (cartTotal: { total: number; quantity: number }, cartItem: IProduct) => {
        const { fiyat, orderQuantity, indirim } = cartItem;
        if (typeof orderQuantity !== "undefined") {
          if (indirim && indirim > 0) {
            // Calculate the item total with discount
            const itemTotal = (fiyat - (fiyat * indirim) / 100) * orderQuantity;
            cartTotal.total += itemTotal;
          } else {
            // Calculate the item total without discount
            const itemTotal = fiyat * orderQuantity;
            cartTotal.total += itemTotal;
          }
          cartTotal.quantity += orderQuantity;
        }
        return cartTotal;
      },
      {
        total: 0,
        quantity: 0,
      }
    );
  };


  // quantity increment
  increment() {
    return this.orderQuantity += 1;
  }
  
  decrement() {
    return this.orderQuantity = this.orderQuantity > 1 ? this.orderQuantity - 1 : 1;
  }

  // quantityDecrement
  quantityDecrement(payload: IProduct) {
    state.cart_products.map((item: IProduct) => {
      if (item.id === payload.id) {
        if (typeof item.orderQuantity !== "undefined") {
          if (item.orderQuantity > 1) {
            item.orderQuantity = item.orderQuantity - 1;
            this.toastrService.info(`Decrement Quantity For ${item.ad}`);
          }
        }
      }
      return { ...item };
    });
    localStorage.setItem("cart_products", JSON.stringify(state.cart_products));
  };

  // remover_cart_products
  removeCartProduct(payload: IProduct) {
    state.cart_products = state.cart_products.filter(
      (p: IProduct) => p.id !== payload.id
    );
    this.toastrService.error(`${payload.ad} sepetten çıkarıldı`);
    localStorage.setItem("cart_products", JSON.stringify(state.cart_products));
  };

  // clear cart
  clear_cart() {
    const confirmMsg = window.confirm(
      "Tüm ürünleri silmek istediğinizden emin misiniz?"
    );
    if (confirmMsg) {
      state.cart_products = [];
    }
    localStorage.setItem("cart_products", JSON.stringify(state.cart_products));
  };
  // initialOrderQuantity
  initialOrderQuantity() {
    return this.orderQuantity = 1;
  };

  clear_cartp() {
    
      state.cart_products = [];
      localStorage.setItem("cart_products", JSON.stringify(state.cart_products));
    
  };
}
