  import { UtilsService } from '@/shared/services/utils.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
  import { ActivatedRoute, Router, Params } from '@angular/router';

  interface ThirdLevelCategory {
    name: string;
  }

  interface SubCategory {
    name: string;
    thirdLevels: ThirdLevelCategory[];
  }

  interface Category {
    name: string;
    subCategories: SubCategory[];
    open: boolean;
  }

  @Component({
    selector: 'app-shared-nav',
    templateUrl: './shared-nav.component.html',
    styleUrls: ['./shared-nav.component.scss']
  })
  export class SharedNavComponent implements OnInit, OnDestroy {
    isSubMenuVisible = false;
    selectedCategory: Category | null = null;
    hideTimeout: any;
    isMobile = false; // Mobil cihaz kontrolü 

    categories: Category[] = [
      {
        name: 'Aydınlatma',
        subCategories: [],
        open: false,
      },
      {
        name: 'Anahtar Priz',
        subCategories: [],
        open: false,
      },
      {
        name: 'Enerji Kabloları',
        subCategories: [],
        open: false,
      },
      {
        name: 'Zayıf Akım Kabloları',
        subCategories: [],
        open: false,
      },
      {
        name: 'Şalt Malzeme',
        subCategories: [],
        open: false,
      },
      {
        name: 'Elektrik Tesisat Ürünleri',
        subCategories: [],
        open: false,
      },
      {
        name: 'Grup Priz/Fiş',
        subCategories: [],
        open: false,
      },
      {
        name: 'Araç Şarj Cihazları',
        subCategories: [],
        open: false,
      },
      {
        name: 'Kataloglar',
        subCategories: [],
        open: false,
      }
    ];
    isSideMenuOpen = false;

    toggleSideMenu() {
      this.isSideMenuOpen = !this.isSideMenuOpen;
      const body = document.body;
      if (this.isSideMenuOpen) {
        body.style.overflow = 'hidden'; // Kaydırmayı devre dışı bırak
        body.style.position = 'fixed'; // Sayfayı sabitle
        body.style.width = '100%'; // Görünümü koru
      } else {
        body.style.overflow = ''; // Kaydırmayı etkinleştir
        body.style.position = ''; // Sabitlemeyi kaldır
        body.style.width = ''; // Görünümü sıfırla
      }
    }
    
  
    toggleSubcategories(category: any) {
      category.open = !category.open;
      this.categories = [...this.categories]; // Angular'ın değişikliği algılaması için array'i güncelle
    }
    
    
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      public utilsService: UtilsService
    ) {}

    ngOnInit() {
      this.fetchCategories();
      this.handleInitialPosition();
      this.checkIfMobile();
    }

    ngOnDestroy() {
    }

    handleInitialPosition() {
      const subCategoryContainer = document.querySelector('.sub-category-container');
      if (subCategoryContainer) {
        if (window.scrollY > 100) {
          subCategoryContainer.setAttribute('style', 'top: 110px !important;');
        } else {
          subCategoryContainer.setAttribute('style', 'top: 170px !important;');
        }
      }
    }


    
   
    @HostListener('window:resize')
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768; // Mobil cihaz genişliği
    }
    
    fetchCategories() {
      this.sendLocalRequest('Kategori/GetAll', 'GET')
        .then((response: any) => {
          // Backend'den gelen yapıyı organize et
          this.organizeCategories(response);
        })
        .catch(err => {
          console.error("Error fetching categories: ", err);
        });
    }

    organizeCategories(backendCategories: any[]) {
      backendCategories.forEach(category => {
        if (category.urunturu && category.ad) {
          // Find the main category using fuzzy matching
          const mainCategory = this.categories.find(cat => this.isSimilar(cat.name, category.urunturu));
    
          if (mainCategory) {
            // Check if the subcategory already exists
            let subCategory = mainCategory.subCategories?.find(subCat => this.isSimilar(subCat.name, category.ad));
    
            if (!subCategory) {
              // Create a new subcategory if it doesn't exist
              subCategory = { name: category.ad, thirdLevels: [] };
              mainCategory.subCategories = mainCategory.subCategories || [];
              mainCategory.subCategories.push(subCategory);
            }
          }
        }
      });
    }
    // Utility function to check if two strings are similar
    isSimilar(str1: string, str2: string): boolean {
      // Normalize strings: remove spaces, convert to lowercase
      const normalizedStr1 = str1.replace(/\s+/g, '').toLowerCase();
      const normalizedStr2 = str2.replace(/\s+/g, '').toLowerCase();

      // Check if one string is a substring of the other
      return normalizedStr1.includes(normalizedStr2) || normalizedStr2.includes(normalizedStr1);
    }
    showSubMenu(category: Category | null) {
      if (category?.subCategories?.length) {
        clearTimeout(this.hideTimeout);
        this.isSubMenuVisible = true;
        this.selectedCategory = category; // Ensure the category is selected
      }
    }
    
    hideSubMenu() {
      this.hideTimeout = setTimeout(() => {
        this.isSubMenuVisible = false;
        this.selectedCategory = null;
      }, 200); // Add a delay for smoother transitions
    }
    
    

    navigateWithCategory(categoryName: string) {
      const queryParams: Params = { category: categoryName };
    
      if (categoryName === 'Kataloglar') {
        // Kataloglar başlığı için farklı bir rotaya yönlendir
        this.router.navigate(['/pages/catalogs']).then(() => {
          window.location.reload(); // Sayfayı sıfırla
        });
      } else {
        this.router.navigate(['/shop/shop-list'], {
          queryParams,
          queryParamsHandling: 'merge',
          skipLocationChange: false,
        }).then(() => {
          window.location.reload(); // Sayfayı sıfırla
        });
      }
    }
    
    
    
    sendLocalRequest(url: string, method: string, data?: any): Promise<any> {
      return fetch(`https://bycobackend.online:5001/api/${url}`, {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data ? JSON.stringify(data) : undefined,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      });
    }
    getChunkedCategories(subCategories: any[], chunkSize: number): any[][] {
      const chunkedArray = [];
      for (let i = 0; i < subCategories.length; i += chunkSize) {
        chunkedArray.push(subCategories.slice(i, i + chunkSize));
      }
      return chunkedArray;
    }
    
    toggleMobileNav() {
      this.isSideMenuOpen = !this.isSideMenuOpen;
    }
    
    
  }
