import { IProduct } from '@/types/product-type';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})

export class ProductFilterComponent implements OnInit, OnChanges {
  @Input() selectedCategory: string = ''; // Kategori değişikliği için
  @Input() categoryFilteredProducts: IProduct[] = []; // ShopAreaComponent'ten gelen filtrelenmiş ürünler
  @Input() resetSelectedFilters: string[] = [];

  public filterOptions: { [key: string]: string[] } = {};
  public selectedFilters: { [key: string]: string[] } = {};
  public filteredOptions: { [key: string]: string[] } = {};
  public isFilterOpen: { [key: string]: boolean } = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadFilterOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategory']) {
      // Kategori değiştiğinde filtre seçeneklerini güncelle
      this.loadFilterOptions();
    }
    if (changes['resetSelectedFilters'] && changes['resetSelectedFilters'].currentValue) {
      this.resetFilters(changes['resetSelectedFilters'].currentValue);
    }
  }

  private async loadFilterOptions() {
    if (this.selectedCategory) {
        // Kategoriye göre filtreleri güncelle
        const categoryFilteredProducts = await this.productService.getProductsByCategory(this.selectedCategory);
        const availableFeatures = this.getAvailableFeatures(categoryFilteredProducts);

        // Boş olmayan özellikleri `filterOptions` ve `filteredOptions` içine ekleyin
        this.filterOptions = {};
        this.filteredOptions = {};

        Object.keys(availableFeatures).forEach((key) => {
            if (availableFeatures[key].length > 0) { // Sadece boş olmayan özellikleri dahil ediyoruz
                this.filterOptions[key] = availableFeatures[key];
                this.filteredOptions[key] = [...availableFeatures[key]];
                this.isFilterOpen[key] = false;
            }
        });

        console.log("Güncellenmiş Filtre Seçenekleri:", this.filterOptions);
    }
}

resetFilters(selectedCategories: string[]): void {
  // Seçili filtrelerden kaldırılanları kontrol edip temizle
  Object.keys(this.selectedFilters).forEach((key) => {
    this.selectedFilters[key] = this.selectedFilters[key].filter(
      (value) => !selectedCategories.includes(value)
    );

    // Eğer bir key boş kalırsa tamamen kaldır
    if (this.selectedFilters[key].length === 0) {
      delete this.selectedFilters[key];
    }
  });

  this.applyFilters(); // Filtreyi yeniden uygula
}

private getAvailableFeatures(categoryFilteredProducts: any[]): { [key: string]: string[] } {
  const availableFeatures: { [key: string]: Set<string> } = {};

  // Kaldırmak istediğiniz anahtarları burada belirtiyoruz
  const excludedKeys = ['aciklama', 'category', 'discount', 'indirim', 'tur', 'urun', 'img', 'kod', 'price', 'title'];

  categoryFilteredProducts.forEach(product => {
    Object.keys(product).forEach(key => {
      // Eğer anahtar excludedKeys içinde yer alıyorsa işlem yapma
      if (!excludedKeys.includes(key) && key !== 'id' && key !== 'ad' && key !== 'kategori' && key !== 'fiyat' && key !== 'stok') {
        if (!availableFeatures[key]) {
          availableFeatures[key] = new Set();
        }
        if (product[key]) {
          availableFeatures[key].add(product[key].toString());
        }
      }
    });
  });

  // Set'i diziye çeviriyoruz
  const availableFeaturesArray: { [key: string]: string[] } = {};
  Object.keys(availableFeatures).forEach(key => {
    availableFeaturesArray[key] = Array.from(availableFeatures[key]);
  });

  return availableFeaturesArray;
}

private titleMappings: { [key: string]: string } = {
  cerceve: 'Çerçeve',
  damarsayisi: 'Damar Sayısı',
  'dis kilifrengi': 'Dış Kılıf Rengi',
  duy: 'Duy',
  isikrengi: 'Işık Rengi',
  kablotipi: 'Kablo Tipi',
  kablouzunlugu: 'Kablo Uzunluğu',
  kabloboyutu: 'Kablo Boyutu',
  kanalozelligi: 'Kanal Özelliği',
  kanalrengi: 'Kanal Rengi',
  kasarengi: 'Kasa Rengi',
  kesit: 'Kesit',
  kesmekapasitesi: 'Kesme Kapasitesi',
  kullanimyeri: 'Kullanım Yeri',
  kutup: 'Kutup',
  marka: 'Marka',
  model: 'Model',
  prizsayisi: 'Priz Sayısı',
  renk: 'Renk',
  renksicakligikelvin: 'Renk Sıcaklığı (Kelvin)',
  sigortasayisi: 'Sigorta Sayısı',
  tip: 'Tip',
  urunozelligi: 'Ürün Özelliği',
  watt: 'Watt',
  aydinlatmaturu: 'Aydınlatma Türü'
};

formatTitle(key: string): string {
  // Eğer başlık eşleme nesnesinde varsa, düzenlenmiş halini kullan
  if (this.titleMappings[key.toLowerCase()]) {
    return this.titleMappings[key.toLowerCase()];
  }

  // Eşleme nesnesinde yoksa, baş harflerini büyük yap ve Türkçe karakterleri düzenle
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Camel case ayırma
    .replace(/(\b\w)/g, char => char.toUpperCase()) // İlk harfi büyük yap
    .replace(/i/g, 'ı') // "i" harfini "ı" ile değiştir (isteğe bağlı)
    .replace(/([A-Z])/g, ' $1') // Büyük harften önce boşluk ekle
    .trim();
}

  
onFilterChange(filterKey: string, option: string) {
  if (!this.selectedFilters[filterKey]) {
    this.selectedFilters[filterKey] = [];
  }

  const index = this.selectedFilters[filterKey].indexOf(option);
  if (index === -1) {
    this.selectedFilters[filterKey].push(option);
  } else {
    this.selectedFilters[filterKey].splice(index, 1);
    // Filtre boşsa anahtarını da kaldır
    if (this.selectedFilters[filterKey].length === 0) {
      delete this.selectedFilters[filterKey];
    }
  }

  this.applyFilters();
}


  @Output() filterApplied = new EventEmitter<{ [key: string]: string[] }>();

  applyFilters() {
      this.filterApplied.emit(this.selectedFilters);
  }

  onSearch(event: any, filterKey: string) {
    const query = event.target.value.toLowerCase();
    this.filteredOptions[filterKey] = this.filterOptions[filterKey].filter((option) =>
      option.toLowerCase().includes(query)
    );
  }

  getOptionCount(key: string, value: string): number {
    return this.categoryFilteredProducts.filter(product => product[key] === value).length;
  }

  toggleFilter(key: string) {
    this.isFilterOpen[key] = !this.isFilterOpen[key];
  }
}
