import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '@/types/product-type';
import { ProductService } from 'src/app/shared/services/product.service';
import { UtilsService } from '@/shared/services/utils.service';

@Component({
  selector: 'app-product-details-thumb',
  templateUrl: './product-details-thumb.component.html',
  styleUrls: ['./product-details-thumb.component.scss'],
})
export class ProductDetailsThumbComponent implements OnInit {
  @Input() product!: IProduct;
  imageList: string[] = []; // Resim listesi

  constructor(
    public productService: ProductService,
    public utilsService: UtilsService
  ) {}

  ngOnInit() {
    if (this.product && this.product.img) {
      console.log('Gelen IMG:', this.product.img); // Debug: Gelen img değerini kontrol et

      // `https://` gördüğünde böl ve diziye çevir
      this.imageList = this.product.img.split(/(?=https:\/\/)/g);

      console.log('Ayrıştırılmış Resimler:', this.imageList); // Debug: Ayrılan URL'leri göster

      if (this.imageList.length > 0) {
        this.productService.activeImg = this.imageList[0]; // İlk resmi varsayılan yap
      }
    }
  }

  handleImageClick(image: string) {
    console.log('Seçilen Resim:', image); // Debug için
    this.productService.activeImg = image; // Büyük resim alanında göster
  }
}
