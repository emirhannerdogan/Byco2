import { Component } from '@angular/core';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import { ProductService } from '@/shared/services/product.service';
import { IProduct } from '@/types/product-type';

@Component({
  selector: 'app-electronic-offer-products',
  templateUrl: './electronic-offer-products.component.html',
  styleUrls: ['./electronic-offer-products.component.scss']
})

export class ElectronicOfferProductsComponent {
  // electronic prd
  public electronic_prd:IProduct[] = [];
  // product offer
  public offer_products:IProduct[] = []

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    new Swiper('.tp-product-offer-slider-active', {
      slidesPerView: 4,
      spaceBetween: 30,
      loop: false,
      modules: [Pagination],
      pagination: {
        el: ".tp-deals-slider-dot",
        clickable: true,
      },
      breakpoints: {
        '1200': {
          slidesPerView: 3,
        },
        '992': {
          slidesPerView: 2,
        },
        '768': {
          slidesPerView: 2,
        },
        '576': {
          slidesPerView: 1,
        },
        '0': {
          slidesPerView: 1,
        },
      }
    });
  }
}
