import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from 'src/app/shared/services/product.service';
import { IProduct } from '@/types/product-type';
import { CompareService } from '@/shared/services/compare.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shop-area',
  templateUrl: './shop-area.component.html',
  styleUrls: ['./shop-area.component.scss']
})


export class ShopAreaComponent {
  @Input() listStyle: boolean = false;
  @Input() full_width: boolean = false;
  @Input() shop_1600: boolean = false;
  @Input() shop_right_side: boolean = false;
  @Input() shop_no_side: boolean = false;

  public products: IProduct[] = [];
  public minPrice: number = 0;
  public niceSelectOptions = this.productService.filterSelect;
  public brands: string[] = [];
  public tags: string[] = [];
  public category: string | null = null;
  public subcategory: string | null = null;
  public status: string | null = null;
  public brand: string | null = null;
  public pageNo: number = 1;
  public pageSize: number = 12;
  public paginate: any = {}; // Pagination use only
  public sortBy: string = 'asc'; // Sorting Order
  public mobileSidebar: boolean = false;
  public filteredProducts: IProduct[] = [];
  productFilterOptions: { [key: string]: Set<string> } = {};
  selectedCategory: string = '';
  isTabHidden: boolean = false;
  selectedFilters: string[] = [];
  public resetSelectedFilters: string[] = [];

  categories: any[] = [];
  breadcrumbCategory: string | null = null; // Ana Kategori
  breadcrumbSubcategory: string | null = null; // Alt Kategori
  
  public minPriceValue: number = 0;
  public maxPriceValue: number = 0;
  public selectedMinPrice: number = 0;
  public selectedMaxPrice: number = 0;
  public initialMinPrice: number = 0;
  public initialMaxPrice: number = 0;

  
  activeTab: string = this.listStyle ? 'list' : 'grid';
  handleActiveTab(tab: string) {
    this.activeTab = tab;
  }
  navigateWithCategory(categoryName: string): void {
    this.router.navigate(['/shop/shop-list'], {
      queryParams: { category: categoryName },
    });
  }
  
  navigateWithSubcategory(categoryName: string, subcategoryName: string): void {
    this.router.navigate(['/shop/shop-list'], {
      queryParams: { category: categoryName, subcategory: subcategoryName },
    });
  }
  
  
  

  // shop changeFilterSelect
  changeFilterSelect(selectedOption: { value: string, text: string }) {
    this.sortByFilter(selectedOption.value)
  }
  onCategorySelected(category: string) {
    this.selectedCategory = category;
    this.onFilterApplied({}); // Filtreyi güncelle
  }
 // Filtre uygulandığında kategori ekleme
  onFilterApplied(selectedFilters: { [key: string]: string[] }): void {
    this.selectedFilters = Object.keys(selectedFilters).reduce((acc: string[], key) => {
      return acc.concat(selectedFilters[key]);
    }, []);

    if (this.selectedCategory) {
      this.productService.getProductsByCategory(this.selectedCategory).then((categoryFilteredProducts) => {
        this.filteredProducts = this.productService.filterProductsByFeature(categoryFilteredProducts, selectedFilters);
        this.productFilterOptions = this.getAvailableFeatures(categoryFilteredProducts);

        // Update the price range
        this.initialMinPrice = Math.min(...this.filteredProducts.map(p => p.fiyat || 0));
        this.initialMaxPrice = Math.max(...this.filteredProducts.map(p => p.fiyat || 0));
        this.selectedMinPrice = this.initialMinPrice;
        this.selectedMaxPrice = this.initialMaxPrice;
      });
    }
  }




// Seçili bir kategoriyi kaldırma
removeCategory(category: string): void {
  this.selectedFilters = this.selectedFilters.filter((c) => c !== category);
  
  // Filtreyi tekrar uygula
  this.onFilterApplied({});

  // ProductFilterComponent'e reset komutu gönder
  this.resetSelectedFilters = [category];
}

  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private viewScroller: ViewportScroller,
    public compareService:CompareService,
    private titleService: Title, 
    private metaService: Meta
  ) {
    // Get Query params..
    this.route.queryParams.subscribe((params) => {
      // console.log('params', params);
      this.minPrice = params['minPrice'] ? params['minPrice'] : this.minPrice;
      this.brand = params['brand']
        ? params['brand'].toLowerCase().split(' ').join('-') : null;

      this.category = params['category']
        ? params['category'].toLowerCase().split(' ').join('-') : null;
      this.subcategory = params['subcategory']
        ? params['subcategory'].toLowerCase().split(' ').join('-') : null;
      this.status = params['status']
        ? params['status'].toLowerCase().split(' ').join('-') : null;
      this.pageNo = params['page'] ? params['page'] : this.pageNo;
      this.sortBy = params['sortBy'] ? params['sortBy'] : 'asc';

      //console.log('products', this.productService.urunler);

      // Get Filtered Products..
      this.productService.filterProducts().subscribe((response) => {
        // Sorting Filter
        this.products = this.productService.sortProducts(response, this.sortBy);
        // Category Filter
        if (this.category) {
            this.products = this.products.filter(
              (p) => (p.parent?.toLowerCase() ?? '').split(' ').join('-') === this.category
            );
          }
          
          if (this.subcategory) {
            this.products = this.products.filter(
              (p) => (p.children?.toLowerCase() ?? '').replace("&", "").split(" ").join("-") === this.subcategory
            );
          }
        // status Filter
        if (this.status) {
          if (this.status === 'i̇ndirimde') {
            this.products = this.products.filter((p) => p.indirim > 0);
          } else if (this.status === 'stokta') {
            this.products = this.products.filter((p) => p.durum === 'stokta');
          }
          else if (this.status === 'tükendi') {
            this.products = this.products.filter((p) => p.durum === 'tükendi' || p.stok === 0);
          }
        }
        // brand filtering
        if (this.brand) {
          this.products = this.products.filter((p) => p.marka.toLowerCase() === this.brand);
        }

        // Price Filter
        
        // Paginate Products
        this.paginate = this.productService.getPager(this.products.length,Number(+this.pageNo),this.pageSize);
        this.products = this.products.slice(this.paginate.startIndex,this.paginate.endIndex + 1);
      });
    });
  }

  sortingByFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target?.value || '';
  
    if (value === 'asc') {
      this.filteredProducts.sort((a, b) => a.fiyat - b.fiyat);
    } else if (value === 'desc') {
      this.filteredProducts.sort((a, b) => b.fiyat - a.fiyat);
    } else {
      // Varsayılan sıralama seçildiğinde filtreleri tekrar uygula
      this.onFilterApplied({});
  
      // filteredProducts dizisini yeniden oluştur
      this.filteredProducts = [...this.filteredProducts];
    }
  }

  formatPrice(price: number): string {
    // Format fiyatı Türk Lirası olarak biçimlendir
    const formattedPrice = price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${formattedPrice} TL`; // 'TL' birimini sağ tarafa ekle
  }
  
  
  updatePriceRange() {
    if (this.initialMinPrice === 0 && this.initialMaxPrice === 0 && this.filteredProducts.length > 0) {
      // İlk fiyat aralığını belirle
      this.initialMinPrice = Math.min(...this.filteredProducts.map(product => product.fiyat || 0));
      this.initialMaxPrice = Math.max(...this.filteredProducts.map(product => product.fiyat || 0));
      this.minPriceValue = this.initialMinPrice;
      this.maxPriceValue = this.initialMaxPrice;
      this.selectedMaxPrice = this.initialMaxPrice;
    }
  }
  
  onMinPriceChange(): void {
    if (this.selectedMinPrice >= this.selectedMaxPrice) {
      this.selectedMinPrice = this.selectedMaxPrice - 1; // Min fiyat, max fiyatı geçemez
    }
    this.selectedMinPrice = Math.floor(this.selectedMinPrice);
    this.updateVisibleProducts();
  }

  onMaxPriceChange(): void {
    if (this.selectedMaxPrice <= this.selectedMinPrice) {
      this.selectedMaxPrice = this.selectedMinPrice + 1; // Max fiyat, min fiyatın altına inemez
    }
    this.selectedMaxPrice = Math.ceil(this.selectedMaxPrice);
    this.updateVisibleProducts();
  }
  
  
  updateVisibleProducts(): void {
    // Update visibility of products based on the price range
    this.filteredProducts.forEach((product) => {
      product['visible'] =
        product.fiyat >= this.selectedMinPrice &&
        product.fiyat <= this.selectedMaxPrice;
    });
  }
  
  
  
  ngOnInit() {
    this.activeTab = this.listStyle ? 'list' : 'grid';

    // Query parametrelerini dinliyoruz
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params); // Gelen parametreleri kontrol edin
  
      const category = params['category'] || 'Tüm Ürünler';
      if (category) {
        this.selectedCategory = category;
        this.updateBreadcrumb(); // Breadcrumb'ı güncelle
        this.onFilterApplied({}); // Kategoriyi seçince filtreyi uygula
      }

      this.titleService.setTitle(`${this.category} | İndirimli Fiyatlarla Satın Al`);
      this.metaService.updateTag({
        name: 'description',
        content: `${this.category} ürünlerini en uygun fiyatlarla keşfedin! Hemen sipariş verin.`
      });
    });
  
    this.filteredProducts = [...this.products]; // Default to all products initially
    console.log('Populated Products:', this.filteredProducts);

    // Kategorileri backend'den çekiyoruz
    this.sendRequest('Kategori/GetAll', 'GET').then((response) => {
      this.categories = response;
      console.log('Fetched Categories:', this.categories); // Gelen kategorileri kontrol edin
      this.updateBreadcrumb(); // Kategoriler geldikten sonra breadcrumb'ı güncelle
    });

  }
  
  toggleTab() {
    this.isTabHidden = !this.isTabHidden;
  }
  compareProducts() {
    console.log('Karşılaştırma işlemi başlatıldı!');
    // Burada karşılaştırma sayfasına yönlendirme yapılabilir
  }
  getAvailableFeatures(categoryFilteredProducts: IProduct[]): { [key: string]: Set<string> } {
    const availableFeatures: { [key: string]: Set<string> } = {};
  
    categoryFilteredProducts.forEach(product => {
      Object.keys(product).forEach(key => {
        if (key !== 'id' && key !== 'ad' && key !== 'kategori' && key !== 'fiyat' && key !== 'stok') {
          if (!availableFeatures[key]) {
            availableFeatures[key] = new Set<string>();
          }
          if (product[key]) {
            availableFeatures[key].add(product[key].toString());
          }
        }
      });
    });
  
    return availableFeatures;
  }
  
  updateBreadcrumb(): void {
    if (this.selectedCategory && this.categories.length > 0) {
      // selectedCategory için eşleşen kategori arıyoruz
      let matchedCategory = this.categories.find(
        (item) => item.ad === this.selectedCategory || item.urunturu === this.selectedCategory
      );
  
      // Eğer "Şalt Malzeme" seçilmişse backend uyumu için dönüştür
      if (!matchedCategory && this.selectedCategory === 'Şalt Malzeme') {
        matchedCategory = this.categories.find((item) => item.urunturu === 'Şalt Malzemeler');
      }
  
      if (matchedCategory) {
        if (matchedCategory.urunturu === 'Şalt Malzemeler' && this.selectedCategory === 'Şalt Malzeme') {
          // "Şalt Malzemeler" backend değerini "Şalt Malzeme" olarak breadcrumb'da göster
          this.breadcrumbCategory = 'Şalt Malzeme';
          this.breadcrumbSubcategory = null; // Alt kategori yok
        } else if (matchedCategory.ad === this.selectedCategory) {
          // Alt kategori seçildiyse
          this.breadcrumbCategory = matchedCategory.urunturu === 'Şalt Malzemeler' ? 'Şalt Malzeme' : matchedCategory.urunturu;
          this.breadcrumbSubcategory = matchedCategory.ad; // Alt kategori ismini göster
        } else {
          // Ana kategori için
          this.breadcrumbCategory = matchedCategory.urunturu;
          this.breadcrumbSubcategory = null;
        }
      } else {
        // Hiçbir eşleşme yoksa breadcrumb'ı sıfırla
        this.breadcrumbCategory = null;
        this.breadcrumbSubcategory = null;
      }
  
      console.log('Breadcrumb Category:', this.breadcrumbCategory);
      console.log('Breadcrumb Subcategory:', this.breadcrumbSubcategory);
    }
  }
  
  

  fetchProductsByCategory(category: string) {
    console.log("Gönderilen Kategori:", category);  // Kontrol için kategori yazdır
  
    this.productService.getProductsByCategory(category).then(
      (response: IProduct[]) => {
        this.products = response;
        console.log('API Yanıtı:', response);  // Yanıtı konsolda göster
        if (this.products.length === 0) {
          console.warn("API'den ürün gelmedi.");
        }
      },
      error => {
        console.error('Ürünler çekilirken hata oluştu:', error);
      }
    );
  }
  
  
  
  // Append filter value to Url
  updateFilter(tags: any) {
    tags.page = null; // Reset Pagination
  }

  // SortBy Filter
  sortByFilter(value:string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sortBy: value ? value : null},
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // product Pagination
  setPage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  handleResetFilter () {
    this.minPrice = 0;
    this.pageNo = 1;
    this.router.navigate(['shop']);
  }

  sendRequest(url: string, method: string, data?: any): Promise<any> {
    console.log("Request Data:", JSON.stringify(data, null, 2));
    return fetch(`https://bycobackend.online:5001/api/${url}`, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    })
      .then(async response => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error Text:", errorText);
          throw new Error(`Status: ${response.status}, Message: ${errorText}`);
        }
        return response.json();
      });
  }
}
