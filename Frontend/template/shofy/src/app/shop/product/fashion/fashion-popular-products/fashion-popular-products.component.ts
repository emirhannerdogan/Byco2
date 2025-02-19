import { Component } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { CartService } from '@/shared/services/cart.service';
import { IProduct } from '@/types/product-type';
import { ProductService } from '@/shared/services/product.service';
import { Iproje } from '@/types/projelerimiz-type';
import { ProjeService } from '@/shared/services/proje.service';
import projeler_data from '@/data/projeler-data';
import { URL } from '@/shared/services/url';

@Component({
  selector: 'app-fashion-popular-products',
  templateUrl: './fashion-popular-products.component.html',
  styleUrls: ['./fashion-popular-products.component.scss'],
})


export class FashionPopularProductsComponent {


    
  //benimUrl = this.urlhost.geturl();
  // add to cart
  addToCart(product: IProduct) {
    this.cartService.addCartProduct(product);
  }

  // Function to check if an item is in the cart
  isItemInCart(item: IProduct): boolean {
    return this.cartService.getCartProducts().some((prd: IProduct) => prd.id === item.id);
  }


  public popular_prd: IProduct[] = [];
  public projeler:Iproje[] = [];
  public projeDevam: Iproje[] = [];
  public projeBiten: Iproje[] = [];

  constructor(public cartService: CartService, public productService: ProductService) {}


  ngOnInit(): void {
    this.GetAllProjects();
    for (let i = 0; i < projeler_data.length; i++) {
        if (projeler_data[i].tamamlanma === "devam") {
            this.projeDevam.push(projeler_data[i]);
        }
      }
      for (let i = 0; i < projeler_data.length; i++) {
        if (projeler_data[i].tamamlanma != "devam") {
            this.projeBiten.push(projeler_data[i]);
        }
      }
    new Swiper('.tp-category-slider-active-2', {
      slidesPerView: 5,
      spaceBetween: 20,
      loop: false,
      modules: [Pagination, Navigation, Scrollbar],
      pagination: {
        el: '.tp-category-slider-dot',
        clickable: true,
      },
      navigation: {
        nextEl: '.tp-category-slider-button-next',
        prevEl: '.tp-category-slider-button-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        dragClass: 'tp-swiper-scrollbar-drag',
        snapOnRelease: true,
      },
      breakpoints: {
        '1200': {
          slidesPerView: 5,
        },
        '992': {
          slidesPerView: 4,
        },
        '768': {
          slidesPerView: 3,
        },
        '576': {
          slidesPerView: 2,
        },
        '0': {
          slidesPerView: 1,
        },
      },
    });
  }

  GetAllProjects(){
    this.sendRequest('Project/GetAllProjects','GET')
    .then(response => {
        this.projeler = response;
      console.log(response);
    })
    .catch(err => {
      console.error("Error: " + err);
    })


  }

  sendRequest(url: string, method: string, data?:any): Promise<any> {
    
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
}
