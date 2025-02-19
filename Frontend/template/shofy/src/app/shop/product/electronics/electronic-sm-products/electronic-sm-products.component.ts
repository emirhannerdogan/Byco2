import { ProductService } from '@/shared/services/product.service';
import { IProduct } from '@/types/product-type';
import { Component } from '@angular/core';

@Component({
  selector: 'app-electronic-sm-products',
  templateUrl: './electronic-sm-products.component.html',
  styleUrls: ['./electronic-sm-products.component.scss']
})
export class ElectronicSmProductsComponent {
  // electronic prd
  public electronic_prd:IProduct[] = [];

  // discount_products
  public discount_products:IProduct[] = [];
  // featured_products
  public featured_products:IProduct[] = [];
  // featured_products
  public selling_products:IProduct[] = [];

    constructor(public productService: ProductService) {}
}
