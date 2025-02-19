import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { IProduct } from '@/types/product-type';
import { ProductService } from '@/shared/services/product.service';

@Component({
  selector: 'app-fashion-new-trending-items',
  templateUrl: './fashion-new-trending-items.component.html',
  styleUrls: ['./fashion-new-trending-items.component.scss'],
})
export class FashionNewTrendingItemsComponent implements AfterViewInit{
  @ViewChild('pageBottom') pageBottom!: ElementRef<HTMLDivElement>;

  public product_items: IProduct[] = [];

  tamamlananProje=false;

  constructor(public productService: ProductService) { }

  smooth = 0;

  scrollToBottom(): void {
    setTimeout(() => {
      this.pageBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  ngAfterViewInit() {
    // ViewChild yüklenmesini garantilemek için ngAfterViewInit içinde kullanılır
  }

  getTamamlananProje():Boolean{
    return this.tamamlananProje;
  }

  setTamamlananProje(){
    this.tamamlananProje = true;
    this.scrollToBottom()
  }


  ngOnInit(): void {
    new Swiper('.tp-trending-slider-active', {
      slidesPerView: 2,
      spaceBetween: 24,
      loop: false,
      modules: [Navigation, Pagination],
      pagination: {
        el: ".tp-trending-slider-dot",
        clickable: true
      },
      navigation: {
        nextEl: ".tp-trending-slider-button-next",
        prevEl: ".tp-trending-slider-button-prev",
      },
      breakpoints: {
        '1200': {
          slidesPerView: 2,
        },
        '992': {
          slidesPerView: 2,
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
      }
    });
  }
}
