import { Component } from '@angular/core';
import { UtilsService } from '@/shared/services/utils.service';
import { CartService } from '@/shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-sidebar-new',
  templateUrl: './mobile-sidebar-new.component.html',
  styleUrls: ['./mobile-sidebar-new.component.scss']
})
export class MobileSidebarNewComponent {
  searchText: string = ''; // Arama kutusu için değişken

  constructor(
    public utilsService: UtilsService,
    public cartService: CartService,
    public router: Router
  ) {}

  handleOpenCart() {
    this.cartService.handleOpenCartSidebar();

  }

  navigateToProfile() {
    this.router.navigate(['/pages/profile']);
  }

  navigateToCompare() {
    this.router.navigate(['/compare']);
  }

  handleSearchSubmit() {
    if (this.searchText.trim()) {
      this.router.navigate(['/pages/search'], { queryParams: { searchText: this.searchText } });
    }
  }

  handleOpenCategories() {
    this.utilsService.handleOpenCategorySidebar(); // Kategoriler sidebar'ını aç
    this.utilsService.handleOpenMobileMenu(); // Mobile sidebar'ı kapat
  }
  
}
