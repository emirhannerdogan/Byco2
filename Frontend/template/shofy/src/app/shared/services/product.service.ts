import { IProduct } from '@/types/product-type';
import { Injectable } from '@angular/core';
import { of, Observable, from, BehaviorSubject } from 'rxjs';
import  product_data from '@/data/product-data';
import { filter, map, switchMap } from 'rxjs/operators';
import { URL } from './url';

const all_products = product_data

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    //benimUrl = this.urlhost.geturl();
    public urunler: IProduct[] = [];
  public filter_offcanvas: boolean = false;
  private productsSubject = new BehaviorSubject<IProduct[]>([]); // BehaviorSubject ile ürünleri sakla
  public products$ = this.productsSubject.asObservable(); // Observable olarak sun
  private productsLoaded = new BehaviorSubject<boolean>(false);

  // Get Products
  public get products(): Observable<IProduct[]> {
    return of(this.GetAllProjects());
  }

  constructor() { 
    this.loadProducts(); // Servis oluşturulurken ürünleri yükle
  }

  activeImg: string | undefined;
  public getOptionCount(key: string, value: string): number {
    return this.urunler.filter(product => product[key] === value).length;
  }
  
  private loadProducts(): void {
    this.sendLocalRequest('Urun/GetAll', 'GET')
      .then((response: IProduct[]) => {
        console.log('Ürünler Yüklendi:', response);
        this.productsSubject.next(response);
        this.productsLoaded.next(true); // Ürünler yüklendiği sinyali
      })
      .catch((err) => {
        console.error('Ürünleri yüklerken hata oluştu:', err);
        this.productsLoaded.next(false); // Hata durumunda false
      });
  }
    // Observable olarak ürünleri alma
    public getProducts(): Observable<IProduct[]> {
      return this.products$;
    }
  
  handleImageActive(img: string) {
    this.activeImg = img;
  }
  public async getFilterOptions(): Promise<{ [key: string]: string[] }> {
    // Eğer ürünler zaten yüklüyse kullan, yoksa API'den çek
    const products = this.urunler.length > 0 ? this.urunler : await this.getAllProjects().toPromise() || [];
  
    // Filtre seçeneklerini saklamak için bir nesne oluşturuyoruz
    const filterOptions: { [key: string]: Set<string> } = {};
  
    // Her bir ürünün özelliklerine göre filtre seçeneklerini ayarla
    products.forEach(product => {
      Object.keys(product).forEach(key => {
        // `id`, `ad`, `kategori`, `fiyat` gibi temel alanları atla
        if (key !== 'id' && key !== 'ad' && key !== 'kategori' && key !== 'fiyat' && key !== 'stok') {
          if (!filterOptions[key]) {
            filterOptions[key] = new Set<string>(); // Yeni bir Set oluştur
          }
          if (product[key]) {
            filterOptions[key].add(product[key].toString()); // Set'e ekle
          }
        }
      });
    });
  
    // Set'leri diziye çevir ve döndür
    const filterOptionsArray: { [key: string]: string[] } = {};
    Object.keys(filterOptions).forEach(key => {
      filterOptionsArray[key] = Array.from(filterOptions[key]);
    });
  
    return filterOptionsArray;
  }
  
  // Get Products By id
  public getProductById(id: number): Observable<IProduct | undefined> {
    return this.productsLoaded.pipe(
      filter(loaded => loaded), // Sadece ürünler yüklendiğinde çalış
      switchMap(() => this.products$.pipe(
        map(products => products.find(p => p.id === id))
      ))
    );
  }
   // Get related Products
   public getRelatedProducts(productId: number,category:string): Observable<IProduct[]> {
    return this.products.pipe(map(items => {
      return items.filter(
        (p) =>
          p.kategori.toLowerCase() === category.toLowerCase() &&
          p.id !== productId
      )
    }));
  }
  // Get max price
//   public get maxPrice(): number {
//     const max_price = all_products.reduce((max, product) => {
//       return product.price > max ? product.price : max;
//     }, 0);
//     return 250;
//   }
// shop filterSelect
  public filterSelect = [
    { value: 'asc', text: 'Varsayılan Sıralama' },
    { value: 'low', text: 'Önce düşük fiyatlı' },
    { value: 'high', text: 'Önce yüksek fiyatlı' },
    { value: 'on-sale', text: 'İndirimde' },
  ];

    //Get Product Filter
    public filterProducts(filter: any= []): Observable<IProduct[]> {
      return this.products.pipe(map(product =>
        product.filter((item: IProduct) => {
          if (!filter.length) return true
          const Tags = filter.some((prev: any) => {
            if (item.kategori) {
              if (item.kategori.includes(prev)) {
                return prev;
              }
            }
          });
          return Tags
        })
      ));
    }
    // In ProductService
    public filterProductsByFeature(products: IProduct[], selectedFilters: { [key: string]: string[] }): IProduct[] {
      return products.filter(product => {
          return Object.keys(selectedFilters).every(key => {
              if (selectedFilters[key].length === 0) return true; // Bu özellik için filtre yoksa tüm ürünleri döndür
              return selectedFilters[key].includes(product[key]?.toString());
          });
      });
  }
  



      // Sorting Filter
  public sortProducts(products: IProduct[], payload: string): any {

    if(payload === 'asc') {
      return products.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'on-sale') {
      return products.filter((p) => p.indirim > 0)
    } else if (payload === 'low') {
      return products.sort((a, b) => {
        if (a.fiyat < b.fiyat) {
          return -1;
        } else if (a.fiyat > b.fiyat) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'high') {
      return products.sort((a, b) => {
        if (a.fiyat > b.fiyat) {
          return -1;
        } else if (a.fiyat < b.fiyat) {
          return 1;
        }
        return 0;
      })
    }
  }

  /*
    ---------------------------------------------
    ------------- Product Pagination  -----------
    ---------------------------------------------
  */
  public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 9) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // Paginate Range
    let paginateRange = 3;

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if(currentPage < paginateRange - 1){
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 1;
      endPage =  currentPage + 1;
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  GetAllProjects():IProduct[]{

    this.sendLocalRequest('Urun/GetAll','GET')
    .then(response => {
        this.urunler = response;
    })
    .catch(err => {
      console.error("Error: " + err);
    })

    return this.urunler;
  }

  public getAllProjects(): Observable<IProduct[]> {
    // If data is already fetched, return it as Observable.
    if (this.urunler.length > 0) {
      return of(this.urunler);
    } else {
      // Otherwise, fetch data and store it in urunler array.
      return from(this.sendLocalRequest('Urun/GetAll', 'GET')).pipe(
        map((response: IProduct[]) => {
          this.urunler = response; // Cache the response
          return response;
        })
      );
    }
  }
  public getProductsByCategory(category: string): Promise<IProduct[]> {
    console.log("Seçilen Kategori:", category); // Kategoriyi loglayın
    const processedCategory = category.split('/')[0];
  
    const url = `Urun/GetProductByCategory/${processedCategory}`;
    return this.sendLocalRequest(url, 'GET').then((products: any[]) => {
        console.log("API'den Dönen Kategori Ürünleri:", products); // API yanıtını loglayın
        return products.map(product => ({
            ...product,
            title: product.ad,
            category: { name: product.kategori },
            price: product.fiyat,
            discount: product.indirim || 0,
            img: product.img
        }));
    });
}

  
  
  
  
  sendLocalRequest(url: string, method: string, data?: any): Promise<any> {
    console.log("İstek URL'si:", `https://bycobackend.online:5001/api/${url}`);
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
      body: data ? JSON.stringify(data) : null,
    })
      .then(response => {
        if (!response.ok) {
          console.error("API isteği başarısız:", response.statusText);
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .catch(error => {
        console.error("API çağrısında hata:", error);
        throw error;
      });
  }
  
  

  sendRequest(url: string, method: string, data?:any): Promise<any> {

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
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
      return response.json();
  })
  }
}
// Removed incorrect from function definition

