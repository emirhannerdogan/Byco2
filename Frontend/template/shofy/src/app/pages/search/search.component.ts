import { Component } from '@angular/core';
import { ProductService } from '@/shared/services/product.service';
import { IProduct } from '@/types/product-type';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  public products: IProduct[] = [];
  public filteredProducts: IProduct[] = [];
  public searchText: string = '';
  public productType: string = '';
  public selectVal: string = '';
  public perView: number = 9;
  public sortBy: string = '';

  // shop changeFilterSelect
  changeFilterSelect(selectedOption: { value: string; text: string }) {
    this.sortByFilter(selectedOption.value);
  }
  // select option
  public selectOptions = [
    { value: 'ascending', text: 'Varsayılan Sıralama' },
    { value: 'low-to-high', text: 'Önce düşük fiyatlı' },
    { value: 'high-to-low', text: 'Önce yüksek fiyatlı' },
    { value: 'new-added', text: 'New Added' },
    { value: 'on-sale', text: 'On Sale' },
  ];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller
  ) {
    this.route.queryParams.subscribe((params) => {
      this.searchText = params['searchText'] || '';
      this.productType = params['productType'] || '';
      this.selectVal = params['selectVal'] || '';
      this.sortBy = params['sortBy'] || '';

      this.productService.products.subscribe((productData) => {
        this.products = productData;

        switch (this.sortBy) {
          case 'ascending':
            this.products = this.products.sort((a, b) => {
              if (a.ad < b.ad) {
                return -1;
              } else if (a.ad > b.ad) {
                return 1;
              }
              return 0;
            })
            break;

          case 'low-to-high':
            this.products = this.products.sort(
              (a, b) => Number(a.fiyat) - Number(b.fiyat)
            );
            break;

          case 'high-to-low':
            this.products = this.products.sort(
              (a, b) => Number(b.fiyat) - Number(a.fiyat)
            );
            break;

          case 'new-added':
            this.products = this.products.slice(-8);
            break;

          case 'on-sale':
            this.products = this.products.filter((p) => p.indirim > 0);
            break;

          default:
            this.products = productData;
            break;
        }

        if (this.searchText && !this.productType) {
          const searchTerms = this.searchText.toLowerCase().split(' '); // searchText'i boşluklara göre böl
          const lastTerm = searchTerms[searchTerms.length - 1]; // Son kelimeyi al
        
          // Önce son yazılan kelimeyi kontrol et
          let matchedProducts = productData.filter((prd) =>
            prd.ad.toLowerCase().includes(lastTerm) ||
            prd.kategori?.toLowerCase().includes(lastTerm) ||
            prd.model?.toLowerCase().includes(lastTerm) ||
            prd.marka?.toLowerCase().includes(lastTerm) ||
            prd.tip?.toLowerCase().includes(lastTerm) ||
            prd.kod?.toLowerCase().includes(lastTerm)
          );
        
          // Eğer son kelimeye göre eşleşme bulunamazsa, tüm kelimelere bak
          if (matchedProducts.length === 0) {
            matchedProducts = productData.filter((prd) =>
              searchTerms.some(
                (term) =>
                  prd.ad.toLowerCase().includes(term) ||
                  prd.kategori?.toLowerCase().includes(term) ||
                  prd.model?.toLowerCase().includes(term) ||
                  prd.marka?.toLowerCase().includes(term) ||
                  prd.tip?.toLowerCase().includes(term) ||
                  prd.kod?.toLowerCase().includes(term)
              )
            );
          }
        
          this.products = matchedProducts; // Eşleşen ürünleri ata
        }
        

        if (this.productType && !this.searchText) {
          this.products = productData.filter(
            (prd) =>
              prd.kategori.toLowerCase() === this.productType.toLowerCase()
          );
        }

        if (this.productType && this.searchText) {
          this.products = productData
            .filter(
              (prd) =>
                prd.kategori.toLowerCase() === this.productType.toLowerCase()
            )
            .filter((p) =>
              p.ad.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }
      });
    });
  }

  ngOnInit(): void {}

  handlePerView(): void {
    this.perView += 3;
  }

  // SortBy Filter
  sortByFilter(value: string) {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { sortBy: value ? value : null },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
      })
      .finally(() => {
        this.viewScroller.setOffset([120, 120]);
        this.viewScroller.scrollToAnchor('products');
      });
  }
}
