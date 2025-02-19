import { CartService } from '@/shared/services/cart.service';
import { CompareService } from '@/shared/services/compare.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  isTabHidden: boolean = false;
  compareProducts: any[] = []; // Ürünleri saklamak için dizi

  filteredAttributes: string[] = [];

  attributeNames: { [key: string]: string } = {
    amper: "Amper",
    aydinlatmaturu: "Aydınlatma Türü",
    cerceve: "Çerçeve",
    damarsayisi: "Damar Sayısı",
    disKilifrengi: "Dış Kılıf Rengi",
    duy: "Duy",
    isikrengi: "Işık Rengi",
    kablotipi: "Kablo Tipi",
    kablouzunlugu: "Kablo Uzunluğu",
    kanalboyutu: "Kanal Boyutu",
    kanalozelligi: "Kanal Özelliği",
    kanalrengi: "Kanal Rengi",
    kasarengi: "Kasa Rengi",
    kesit: "Kesit",
    kesmekapasitesi: "Kesme Kapasitesi",
    kutup: "Kutup",
    marka: "Marka",
    model: "Model",
    prizsayisi: "Priz Sayısı",
    renk: "Renk",
    renksicakligikelvin: "Renk Sıcaklığı (Kelvin)",
    sigortasayisi: "Sigorta Sayısı",
    tip: "Tip",
    tur: "Tür",
    urunozelligi: "Ürün Özelliği",
    uruntipi: "Ürün Tipi",
    watt: "Watt"
  };

  constructor(public compareService: CompareService, public cartService: CartService) {}

  ngOnInit(): void {
    this.compareProducts = this.compareService.getCompareProducts() || []; 

    // En az bir üründe dolu olan özellikleri filtrele
    const allAttributes = Object.keys(this.attributeNames);
    this.filteredAttributes = allAttributes.filter(key =>
      this.compareProducts.some(item => item[key] && item[key].trim() !== '')
      
    );

    // filteredAttributes listesini oluştururken "fiyat"ı dahil etme
    this.filteredAttributes = allAttributes.filter(key =>
      key !== "fiyat" && this.compareProducts.some(item => item[key] && item[key].trim() !== '')
    );

  }

  toggleTab() {
    this.isTabHidden = !this.isTabHidden;
  }

  goBack() {
    window.history.back();
  }
}
