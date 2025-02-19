import { Component,ElementRef,Renderer2,ViewChild } from '@angular/core';
import { IProduct } from '@/types/product-type';
import { ProductService } from '@/shared/services/product.service';

@Component({
  selector: 'app-beauty-all-products',
  templateUrl: './beauty-all-products.component.html',
  styleUrls: ['./beauty-all-products.component.scss']
})
export class BeautyAllProductsComponent {
  @ViewChild('navActive') navActive!: ElementRef;
  @ViewChild('productTabMarker') productTabMarker!: ElementRef;

  active_tab: string = 'All Collection';
  tabs: string[] = ['All Collection', 'Trending', 'Beauty', 'Cosmetics'];
  allProducts:IProduct[] = [];

  constructor(private renderer: Renderer2,public productService: ProductService) { }

  handleActiveMarker(event: Event, tab: string): void {
    this.active_tab = tab;
    const marker = document.getElementById("productTabMarker");
    if (marker && event.target) {
      marker.style.left = (event.target as HTMLButtonElement).offsetLeft + "px";
      marker.style.width = (event.target as HTMLButtonElement).offsetWidth + "px";
    }
  }

  get filteredProducts(): IProduct[] {
    switch (this.active_tab) {
      case 'All Collection':
        return this.allProducts.slice(0, 8);
      case 'Trending':
        return this.allProducts.slice(-4);
      default:
        return [];
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.setStyle(this.productTabMarker.nativeElement, 'left', this.navActive.nativeElement.offsetLeft + 'px');
      this.renderer.setStyle(this.productTabMarker.nativeElement, 'width', this.navActive.nativeElement.offsetWidth + 'px');
    }, 0);
  }

}
