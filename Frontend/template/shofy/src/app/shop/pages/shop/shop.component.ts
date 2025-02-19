import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from 'src/app/shared/services/product.service';
import { IProduct } from '@/types/product-type';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent {
  @Input() listStyle: boolean = false;

  public products: IProduct[] = [];
  public minPrice: number = 0;
  //public maxPrice: number = this.productService.maxPrice;
  public niceSelectOptions = this.productService.filterSelect;
  public brands: string[] = [];
  public tags: string[] = [];
  public category: string | null = null;
  public status: string | null = null;
  public brand: string | null = null;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string = 'asc'; // Sorting Order
  public mobileSidebar: boolean = false;


  activeTab: string = this.listStyle ? 'list' : 'grid';
  handleActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // shop changeFilterSelect
  changeFilterSelect(selectedOption: { value: string, text: string }) {
    this.sortByFilter(selectedOption.value)
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller,
    public productService: ProductService
  ) {
    // Get Query params..
    this.route.queryParams.subscribe((params) => {
      console.log('params', params);
      this.minPrice = params['minPrice'] ? params['minPrice'] : this.minPrice;
      //this.maxPrice = params['maxPrice'] ? params['maxPrice'] : this.maxPrice;
      this.brand = params['brand']
        ? params['brand'].toLowerCase().split(' ').join('-') : null;

      this.category = params['category']
        ? params['category'].toLowerCase().split(' ').join('-') : null;
      this.status = params['status']
        ? params['status'].toLowerCase().split(' ').join('-') : null;
      this.pageNo = params['page'] ? params['page'] : this.pageNo;
      this.sortBy = params['sortBy'] ? params['sortBy'] : 'asc';

      // Get Filtered Products..
      this.productService.filterProducts().subscribe((response) => {
        // console.log('res', response);
        // Sorting Filter
        this.products = this.productService.sortProducts(response, this.sortBy);

        // Category Filter
        if (this.category){
          this.products = this.products.filter(
            (p) => p.kategori.toLowerCase().split(' ').join('-') === this.category
          );
        }
        // status Filter
        if (this.status) {
          if (this.status === 'on-sale') {
            this.products = this.products.filter((p) => p.indirim > 0);
          } else if (this.status === 'in-stock') {
            this.products = this.products.filter((p) => p.durum === 'in-stock');
          }
          else if (this.status === 'out-of-stock') {
            this.products = this.products.filter((p) => p.durum === 'out-of-stock');
          }
        }
        // brand filtering
        if (this.brand) {
          this.products = this.products.filter((p) => p.marka.toLowerCase() === this.brand);
        }

        
        // Paginate Products
        this.paginate = this.productService.getPager(this.products.length,Number(+this.pageNo));
        this.products = this.products.slice(this.paginate.startIndex,this.paginate.endIndex + 1);
      });
    });
  }
  ngOnInit() {
    // console.log('pagination',this.paginate)
  }

  // Append filter value to Url
  updateFilter(tags: any) {
    console.log('tags', tags);
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
    this.router.navigate(['shop']);
  }
}
