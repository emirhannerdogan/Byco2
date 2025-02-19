import { ProductService } from '@/shared/services/product.service';
import { IProduct } from '@/types/product-type';
import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import Swiper from 'swiper';




interface Slide {
  image: string;
  title: string;
  link: string;
}


@Component({
  selector: 'app-shop-main-page',
  templateUrl: './shop-main-page.component.html',
  styleUrls: ['./shop-main-page.component.scss']
})
export class ShopMainPageComponent {
  products: IProduct[] = []; // Array to hold products for "Fırsat Ürünleri"
  featuredProducts: IProduct[] = []; // Array to hold products for "Öne Çıkanlar"
  displayedProducts: IProduct[] = []; // Array to display up to 10 products
  activeProductIndex: number = 0; // Track the active product index
  isDragging = false;
  startX = 0;
  scrollLeft = 0;
  public searchText: string = ''; // Arama metni
  @ViewChild('marquee') marquee!: ElementRef;

  messages: Array<{ id: number; position: string; text: string }> = [];

  @ViewChild('swiperEl') swiperEl!: ElementRef & { swiper: Swiper };

  ngAfterViewInit() {
    // Swiper nesnesine erişim burada yapılabilir
    if (this.swiperEl && this.swiperEl.nativeElement.swiper) {
      console.log('Swiper instance initialized:', this.swiperEl.nativeElement.swiper);
    }
    if (this.customSwiperEl?.nativeElement.swiper) {
      console.log('Custom Swiper initialized:', this.customSwiperEl.nativeElement.swiper);
    }
  }

  nextProduct() {
    this.swiperEl.nativeElement.swiper?.slideNext();
  }

  previousProduct() {
    this.swiperEl.nativeElement.swiper?.slidePrev();
  }
  


  constructor(private productService: ProductService,private router: Router,private renderer: Renderer2) {}

  ngOnInit() {
    this.productService.getAllProjects().subscribe((data: IProduct[]) => {
      this.allProducts = data.filter(product => product.ad !== 'Kargo');
      this.updateDisplayedProducts();
      this.displayFeaturedProducts();
    });

  }

 

  startMarquee(): void {
    const marqueeElement = this.marquee.nativeElement;
    const containerWidth = marqueeElement.parentElement.offsetWidth;
    const textWidth = marqueeElement.offsetWidth;
  
    // Başlangıç konumu
    let currentPosition = containerWidth;
  
    const animate = () => {
      // Eğer yazının tamamı ekran dışına çıktıysa
      if (currentPosition <= -textWidth) {
        currentPosition = containerWidth; // Sağdan tekrar başla
      } else {
        // Yazıyı sola doğru kaydır
        currentPosition -= 1; // Kayma hızı (daha yavaş için 0.5 deneyebilirsiniz)
      }
  
      // Pozisyonu güncelle
      this.renderer.setStyle(marqueeElement, 'left', `${currentPosition}px`);
  
      // Animasyonu devam ettir
      requestAnimationFrame(animate);
    };
  
    // Animasyonu başlat
    animate();
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


  selectTab(tab: string) {
    this.activeTab = tab;
    this.updateDisplayedProducts();
  }

  handleSearchSubmit() {
    if (this.searchText) {
      // Arama sorgusu ile belirli bir sayfaya yönlendir
      this.router.navigate(['/pages/search'], { queryParams: { searchText: this.searchText } });
    }
  }

  // Arama kutusunu kapatma işlevi
  closeSearch() {
    this.searchText = ''; // Arama kutusunu temizle
  }

  loadProducts() {
    this.productService.products.subscribe((data: IProduct[]) => {
        this.allProducts = data; // Tüm ürünleri al ve kaydet
        this.updateDisplayedProducts(); // Sekmeye göre görüntülenecek ürünleri ayarla
    });
}

  


  // Scroll to a specific product in the carousel
  scrollToProduct(index: number) {
    const carousel = document.querySelector('.product-carousel');
    const productElement = carousel?.children[index] as HTMLElement;
    productElement?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }

  // Method to handle mouse scroll for horizontal scrolling
  onMouseScroll(event: WheelEvent) {
    const carousel = document.querySelector('.product-carousel') as HTMLElement;
    carousel.scrollLeft += event.deltaY; // Scroll horizontally based on vertical scroll direction
    event.preventDefault(); // Prevent default vertical scroll
  }
  //Banner section
  activeSlideIndex: number = 0;
  intervalId: any;
  
  ngOnDestroy() {
    this.clearAutoSlide();
  }



  clearAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  getTransform() {
    return `translateX(-${this.activeSlideIndex * 100}%)`;
  }
  categories = [
    {
      image: 'assets/cables.jpeg',
      title: 'Araç Şarj Cihazları',
      link: '/shop/shop-list?category=Araç%20Şarj%20Cihazları'
    },
    {
      image: 'assets/power-cables.jpeg',
      title: 'Enerji Kabloları',
      link: '/shop/shop-list?category=Enerji%20Kabloları'
    },
    {
      image: 'assets/lighting.jpeg',
      title: 'Aydınlatma',
      link: '/shop/shop-list?category=Aydınlatma'
    }
  ];
  
  breakpointsConfig = {
    768: { // Masaüstü
      slidesPerView: 3,
    },
    0: { // Mobil
      slidesPerView: 1,
      spaceBetween: 10, // Ürünler arası boşluk

    }
  };
  

  // Method to set the active slide when clicking a thumbnail
  setActiveSlide(index: number) {
    this.activeSlideIndex = index;
  }
  //<!-- Sizin İçin Seçtiklerimiz,Çok Satanlar,İndirimli Ürünler section -->
  activeTab: string = 'recommended';
  allProducts: IProduct[] = [];

displayFeaturedProducts() {
  // Filter out "Kargo" products
  const filteredProducts = this.allProducts.filter(product => product.ad !== 'Kargo');

  // Separate BEMIS brand products
  const bemisProducts = filteredProducts.filter(product => product.marka === 'Bemis');

  // Get the remaining products after prioritizing BEMIS
  const otherProducts = filteredProducts.filter(product => product.marka == 'POWER ŞARJ');

  // Combine BEMIS products first, then fill with other products up to 10 items
  this.featuredProducts = [...bemisProducts, ...otherProducts].slice(0, 10);
}


updateDisplayedProducts() {
  if (this.allProducts.length === 0) {
    return; // Ürünler henüz yüklenmediyse çık
  }

  const filteredProducts = this.allProducts.filter(product => product.ad !== 'Kargo');

  // Separate BEMIS brand products
  const bemisProducts = filteredProducts.filter(product => product.marka === 'Bemis');

  // Get the remaining products after prioritizing BEMIS
  const otherProducts = filteredProducts.filter(product => product.marka == 'POWER ŞARJ');

  switch (this.activeTab) {
    case 'recommended':
      this.displayedProducts = [...bemisProducts, ...otherProducts, ...filteredProducts].slice(0, 10); // İlk 10 ürünü al
      break;
    case 'bestSellers':
      this.displayedProducts = [...bemisProducts, ...otherProducts, ...filteredProducts].slice(4, 14); // Çok satanlar listesi
      break;
    case 'discounted':
      // 20. üründen sonraki indirimli ürünleri filtrele ve ilk 10 tanesini al
      this.displayedProducts = filteredProducts
        .slice(20) // 20. üründen sonraki ürünleri al
        .filter(product => product.indirim > 0) // İndirimli ürünler
        .slice(0, 10); // İlk 10 tanesi
      break;
  }
}



 // Çeşitli Elektrik Ürünleri section 
  electricProducts = [
    { image: 'assets/armatur.jpeg', title: 'Armatür', link: '/shop/shop-list?category=Armatür' },
    { image: 'assets/switchgear.jpeg', title: 'Şalt Malzeme', link: '/shop/shop-list?category=Şalt%20Malzeme' },
    // Diğer ürünleri burada ekleyin
  ];

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - (event.target as HTMLElement).scrollLeft;
    this.scrollLeft = (event.target as HTMLElement).scrollLeft;
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    const x = event.pageX - (event.target as HTMLElement).offsetLeft;
    const walk = (x - this.startX) * 1; // Sürükleme hızını ayarlamak için çarpan (daha az veya fazla yapabilirsiniz)
    (event.target as HTMLElement).scrollLeft = this.scrollLeft - walk;
    event.preventDefault();
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseLeave() {
    this.isDragging = false;
  }


  @ViewChild('customSwiperEl') customSwiperEl!: ElementRef & { swiper: Swiper };

  customCategories = [
    { image: 'assets/custom/viko-karre.jpeg', title: 'Viko Karre', link: 'Viko' },
    { image: 'assets/custom/schneider.jpeg', title: 'Schneider', link: 'Schneider' },
    { image: 'assets/custom/ttr.jpg', title: 'TTR Kablolar', link: 'TTR' },
    { image: 'assets/custom/armatur.jpeg', title: 'Armatür', link: 'Armatür' },
    { image: 'assets/custom/bemis.jpg', title: 'Taşınabilir Şarj', link: 'Taşınılabilir Şarj Cihazı' },
    { image: 'assets/custom/powersarj.jpg', title: 'Powerşarj', link: 'Sabit Araç Şarj Cihazı' },
    { image: 'assets/custom/aksesuar.jpg', title: 'Aksesuarlar', link: 'Elektrikli Araç Aksesuarları' },
    { image: 'assets/custom/nyanyaf.jpg', title: 'NYA ve NYAF', link: 'NYA' },
    { image: 'assets/custom/antenethernet.jpg', title: 'Kablolar', link: 'Anten Ethernet ve Sinyal Kabloları' },
    { image: 'assets/custom/sarfmalzeme.jpg', title: 'Sarf Malzeme', link: 'Sarf Malzeme' },
    { image: 'assets/custom/sigorta.jpg', title: 'Sigorta', link: 'Sigorta' },
    { image: 'assets/custom/panoprizi.jpg', title: 'Pano Prizleri', link: 'Pano Prizleri' },
  ];

  customBreakpointsConfig = {
    768: { slidesPerView: 11 },
    0: { slidesPerView: 6 },
  };

  
  navigateWithCategory(categoryName: string): void {
    console.log('Navigating to category:', categoryName);
    // Eski router mantığı geri geldi
    this.router.navigate(['/shop/shop-list'], {
      queryParams: { category: categoryName },
    });
  }

  customPreviousSlide(): void {
    this.customSwiperEl.nativeElement.swiper?.slidePrev();
  }

  customNextSlide(): void {
    this.customSwiperEl.nativeElement.swiper?.slideNext();
  }
  
}  