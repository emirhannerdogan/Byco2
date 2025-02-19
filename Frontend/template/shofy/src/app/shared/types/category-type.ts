// SubCategory ara yüzü
// SubCategory ara yüzü güncellenmiş hali
export interface SubCategory {
  name: string;
  products?: string[]; // Alt kategorideki ürünleri tutacak dizi
  thirdLevels?: string[]; // Üçüncü seviye kategoriler varsa
}

// ICategory güncellenmiş hali
export interface ICategory {
  id: string;
  img?: string;
  parent: string;
  children?: string[];
  productType: string;
  products: string[];
  status: string;
  showSubCategories?: boolean;
  subCategories?: SubCategory[]; // Bu özelliği ekliyoruz
}
