import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '@/types/product-type';
import { ProductService } from 'src/app/shared/services/product.service';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dynamic-product-details',
  templateUrl: './dynamic-product-details.component.html',
  styleUrls: ['./dynamic-product-details.component.scss']
})
export class DynamicProductDetailsComponent implements OnInit {
  public product: IProduct | null | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(productId)) {
      console.error("Geçersiz ID:", productId);
      this.router.navigate(['/not-found']);
      return;
    }
  
    this.productService.getProductById(productId).subscribe(
      product => {
        if (!product) {
          console.warn("Product not found, redirecting to /shop");
          this.router.navigate(['/shop']);
        } else {
          this.product = product;
          console.log("Product loaded:", this.product);
        }
      },
      err => {
        console.error("API çağrısında hata:", err);
        this.router.navigate(['/shop']);
      }
    );
  }
  
  
}
