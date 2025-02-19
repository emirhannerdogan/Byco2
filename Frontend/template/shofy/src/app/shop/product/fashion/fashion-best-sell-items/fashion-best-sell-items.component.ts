import { Component } from '@angular/core';
import { ProductService } from '@/shared/services/product.service';
import { IProduct } from '@/types/product-type';

@Component({
  selector: 'app-fashion-best-sell-items',
  templateUrl: './fashion-best-sell-items.component.html',
  styleUrls: ['./fashion-best-sell-items.component.scss']
})
export class FashionBestSellItemsComponent {

    public products:IProduct[] = [];

    constructor(public productService: ProductService) {}
}
