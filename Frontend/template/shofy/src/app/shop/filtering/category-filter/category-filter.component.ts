import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
})
export class CategoryFilterComponent implements OnInit {
  public categoryData: any[] = []; // Kategoriler
  public filteredSubCategories: any[] = []; // Filtrelenmiş alt kategoriler
  activeQuery: string = '';
  isSubCategoryView: boolean = false;
  @Output() categorySelected = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller,
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchCategories(); // Kategorileri backend'den al
    this.route.queryParams.subscribe((queryParams) => {
      this.activeQuery = queryParams['category'];
      this.filterSubCategories(); // Seçilen ana kategoriye göre alt kategorileri filtrele
    });
  } 

  fetchCategories(): void {
    fetch('https://bycobackend.online:5001/api/Kategori/GetAll')
      .then(response => response.json())
      .then(data => {
        this.categoryData = data;
        this.filterSubCategories(); // Kategoriler geldikten sonra alt kategorileri filtrele
      })
      .catch(err => console.error('Error fetching categories:', err));
  }
  

  async filterSubCategories(): Promise<void> {
    if (this.categoryData.some(category => this.isSimilar(category.urunturu, this.activeQuery))) {
      // `urunturu` seviyesindeyiz, bu `urunturu`'ya ait tüm `ad`'ları göster
      this.filteredSubCategories = this.categoryData.filter(category =>
        this.isSimilar(category.urunturu, this.activeQuery)
      );
  
      // Alt kategorilere ürün sayısını ekle
      for (let subCategory of this.filteredSubCategories) {
        const products = await this.productService.getProductsByCategory(subCategory.ad);
        subCategory.productCount = products.length;
      }
  
      this.isSubCategoryView = false;
    } else {
      // `ad` seviyesindeyiz, alt kategoriler için `isSubCategoryView`'u `true` yap
      this.filteredSubCategories = this.categoryData.filter(category =>
        this.isSimilar(category.ad, this.activeQuery)
      );
  
      // `ad` seviyesindeki kategorinin ürün sayısını ekle
      for (let subCategory of this.filteredSubCategories) {
        const products = await this.productService.getProductsByCategory(subCategory.ad);
        subCategory.productCount = products.length;
      }
  
      this.isSubCategoryView = true;
    }
  }
  
isSimilar(str1: string, str2: string): boolean {
  // Normalize strings: remove spaces, convert to lowercase
  const normalizedStr1 = str1.replace(/\s+/g, '').toLowerCase();
  const normalizedStr2 = str2.replace(/\s+/g, '').toLowerCase();

  // Check if one string is a substring of the other
  return normalizedStr1.includes(normalizedStr2) || normalizedStr2.includes(normalizedStr1);
}


  

  handleCategoryRoute(value: string): void {
    this.categorySelected.emit(value); // Seçilen kategoriyi ilet

    this.isSubCategoryView = true; // Alt kategoriye girildiğini belirt
    this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: value },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
    }).finally(() => {
        this.activeQuery = value;
        this.filterSubCategories(); // Alt kategorileri filtrele
    });
  }

  goBackToMainCategory(): void {
    if (this.activeQuery) {
      // Ana kategoriyi bul
      const mainCategory = this.categoryData.find(category =>
        this.isSimilar(category.ad, this.activeQuery) || this.isSimilar(category.urunturu, this.activeQuery)
      )?.urunturu;
  
      if (mainCategory) {
        // Eğer mainCategory 'Şalt Malzemeler' ise 'Şalt Malzeme'ye yönlendir
        const adjustedCategory = mainCategory === 'Şalt Malzemeler' ? 'Şalt Malzeme' : mainCategory;
  
        // activeQuery'yi güncelle
        this.activeQuery = adjustedCategory;
        this.isSubCategoryView = false;
        this.filterSubCategories(); // Kategorileri filtrele
  
        // URL'yi güncelle
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { category: adjustedCategory },
          queryParamsHandling: 'merge',
          skipLocationChange: false,
        });
      }
    }
  }
  
  
  

}
