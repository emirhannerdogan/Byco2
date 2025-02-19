import { Component } from '@angular/core';
import { ProductService } from '@/shared/services/product.service';
import { IProduct } from '@/types/product-type';

@Component({
  selector: 'app-top-rated-products',
  templateUrl: './top-rated-products.component.html',
  styleUrls: ['./top-rated-products.component.scss']
})
export class TopRatedProductsComponent {

  public topRatedProducts: { product: IProduct; rating: number }[] = []

  constructor(public productService: ProductService) {}

}
