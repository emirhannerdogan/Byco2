import { Component } from '@angular/core';
import blogData from '@/data/blog-data';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { ProductService } from '@/shared/services/product.service';
import { IProduct } from '@/types/product-type';
import projeler_data from '@/data/projeler-data';
import { Iproje } from '@/types/projelerimiz-type';
import { CartService } from '@/shared/services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { URL } from '@/shared/services/url';


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent {


  public popular_prd: IProduct[] = [];
  public projeler: Iproje[] = [];
  public projeDevam: Iproje[] = [];
  public getParam = "";

  public swiper: any;

  constructor(public cartService: CartService, public productService: ProductService, private route: ActivatedRoute) {}
  paramEqulizer(gelen: any): void {
    this.getParam = gelen;
    console.log(this.getParam);
  }


  ngOnInit(): void {
    this.paramEqulizer(this.route.snapshot.paramMap.get('category'));
    for (let i = 0; i < projeler_data.length; i++) {
      if (projeler_data[i].aciklama === this.getParam) {
        this.projeDevam.push(projeler_data[i]);
      }
    }
    this.swiper = new Swiper('.tp-category-slider-active-2', {
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
          slidesPerView: 3,
        },
        '768': {
          slidesPerView: 2,
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


  goNext() {
    this.swiper.slideNext();
  }
  goPrev() {
    this.swiper.slidePrev();
  }
}
