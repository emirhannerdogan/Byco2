import { Component, HostListener, Input } from '@angular/core';
import { CartService } from '@/shared/services/cart.service';
import { WishlistService } from '@/shared/services/wishlist.service';
import { UtilsService } from '@/shared/services/utils.service';
import { Router } from '@angular/router';
import { IProduct } from '@/types/product-type';
import { ProductService } from '@/shared/services/product.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header-four',
  templateUrl: './header-four.component.html',
  styleUrls: ['./header-four.component.scss']
})

export class HeaderFourComponent {
  @Input() products: IProduct[] = []; // Ürünleri parent component'ten alır

  searchText: string = ''; // Arama metni
  filteredProducts: IProduct[] = []; // Filtrelenmiş ürünler
  showDropdown: boolean = false; // Dropdown açık mı kapalı mı
  userName: string = 'Giriş';
  isUserLogin: boolean = false;
  
  messages: string[] = []; // Array to store non-empty messages
  displayedMessage: string = ''; // Currently displayed message
  messageIndex: number = 0; // Index of the current message
  messageInterval: any; // Reference to the interval
  animationClass: string = 'message-enter'; // Animation class for the message

  constructor(
        public cartService: CartService,
        public wishlistService: WishlistService,
        public utilsService: UtilsService,
        public router: Router,
        private productService: ProductService,
      ) {}
    
      sticky : boolean = false;
      @HostListener('window:scroll',['$event']) onscroll () {
        if(window.scrollY > 80){
          this.sticky = true
        }
        else{
          this.sticky = false
        }
      }


      ngOnInit(): void {
        const sessionKey = this.getCookie('session_key'); // Fetch session key from cookies

        if (sessionKey) {
          this.sendRequestWithHeaders('User/GetUser', 'GET', {
            Authorization: `Bearer ${sessionKey}`,
          })
            .then((response) => {
              console.log('Response Data:', response);
    
              // Use `ad` and `soyad` from the response to set the user's name
              this.userName = `${response.ad} ${response.soyad}`;
              this.isUserLogin = true; // Update login status
            })
            .catch((err) => {
              console.error('Error:', err);
              this.userName = 'Giriş Yap'; // Fallback to default text
            });
        }

        this.productService.products.subscribe((data: IProduct[]) => {
          this.products = data; // Tüm ürünleri al
        });
        this.fetchMessages(); // Arama altı mesajını al
      }

      ngOnDestroy(): void {
        // Clear the interval when the component is destroyed
        if (this.messageInterval) {
          clearInterval(this.messageInterval);
        }
      }

      getCookie(name: string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
      }

      

      handleSearchSubmit() {
        if (this.searchText) {
          // Arama sorgusu ile belirli bir sayfaya yönlendir
          this.router.navigate(['/pages/search'], { queryParams: { searchText: this.searchText } });
        }
      }
      filterDropdownProducts(): void {
        if (this.searchText.trim() === '') {
          this.filteredProducts = []; // Arama metni boşsa, dropdown'u temizle
        } else {
          const lowerSearch = this.searchText.toLowerCase();
          this.filteredProducts = this.products.filter(
            (product) =>
              product.ad.toLowerCase().includes(lowerSearch) || // Ürün adı eşleşiyorsa
              product.kategori.toLowerCase().includes(lowerSearch) // Kategori eşleşiyorsa
          );
        }
      }
      selectProduct(product: IProduct): void {
        this.searchText = product.ad; // Seçilen ürünün adını arama çubuğuna yaz
        this.showDropdown = false; // Dropdown'u kapat
        // Yönlendirme veya başka bir işlem yapılabilir
      }
      
      hideDropdown(): void {
        setTimeout(() => {
          this.showDropdown = false;
        }, 200); // Küçük bir gecikme eklenerek seçim yapılmasına izin verilir
      }
      
      fetchMessages(): void {
        this.sendRequest('Others/Get', 'GET')
          .then((response) => {
            // Filter messages to only include non-empty text
            this.messages = response
              .filter((msg: any) => msg.text && msg.text.trim() !== '')
              .map((msg: any) => msg.text);
    
            if (this.messages.length > 0) {
              // Start the loop if there are messages
              this.startMessageLoop();
            }
          })
          .catch((err) => {
            console.error('Mesaj alınamadı:', err);
          });
      }
    
      startMessageLoop(): void {
        // Display the first message
        this.displayedMessage = this.messages[this.messageIndex];
        this.animationClass = 'message-enter'; // Start with slide-in animation
      
        // Start the interval for the transition
        this.messageInterval = setInterval(() => {
          // Trigger slide-out animation
          this.animationClass = 'message-leave';
      
          // Wait for the slide-out animation to finish before updating the message
          setTimeout(() => {
            // Move to the next message
            this.messageIndex = (this.messageIndex + 1) % this.messages.length;
      
            // Update the displayed message and trigger slide-in animation
            this.displayedMessage = this.messages[this.messageIndex];
            this.animationClass = 'message-enter';
          }, 2000); // Match the slide-out animation duration (2s)
        }, 10000); // Change message every 5 seconds
      }
      
      sendRequestWithHeaders(url: string, method: string, header?: any): Promise<any> {
        return fetch(`https://bycobackend.online:5001/api/${url}`, {
          method: method,
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: header,
          redirect: 'follow',
          referrerPolicy: 'no-referrer'
        })
        .then(response => {
          console.log("Full Response:", response);
      
          if (!response.ok) {
            return response.text().then(text => {
              throw new Error(`Error: ${response.status} - ${response.statusText} - ${text}`);
            });
          }
          
          return response.clone().json() // Klonlayarak `json` dönüşümü yapıyoruz
            .then(data => {
              console.log("Response JSON Data:", data);
              return data;
            })
            .catch(error => {
              console.error("JSON Parsing Error:", error);
              throw new Error("Yanıt JSON formatında değil");
            });
        })
        .catch(error => {
          console.error("Fetch Error:", error);
          throw error;
        });
      }
      
      sendRequest(url: string, method: string, data?: any): Promise<any> {
        return fetch(`https://bycobackend.online:5001/api/${url}`, {
          method: method,
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(data),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        });
      }
      
}
