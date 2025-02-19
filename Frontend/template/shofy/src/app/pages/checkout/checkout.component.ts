import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CartService} from '@/shared/services/cart.service';
import {ToastrService} from 'ngx-toastr';
import {IProduct} from '@/types/product-type';
import {checkk} from '@/types/checkt-type';
import {ICity} from '@/types/cities-type';
import cities_data from '@/data/city-data';
import vergiDaireleri from "@/data/vergi-daireleri";
import {Router} from "@angular/router";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {


  //benimUrl = this.urlhost.geturl();

  public checkouts: checkk = {};

  public urunler: IProduct[] = [];

  isOpenLogin = false;
  isOpenCoupon = false;
  isUserLogin = false;
  isTermAccepted = false;

  infoUpdated: boolean = false;
  shipCost: number = 0; // Kargo ücreti varsayılan olarak 100 TL
  couponCode: string = '';
  payment_name: string = '';
  userid: number = -1;
  discount: number = 0;
  objCities: ICity[] = [];

  searchTerm: string = ''; // Kullanıcının arama inputu
  filteredVergiDaireleri: any[] = []; // Filtrelenmiş vergi daireleri
  showDropdown: boolean = false; // Dropdown aç/kapa kontrolü
  
  paymentInfoUpdated: boolean = false;

  personalPlaceholders: string[] = ['Adınız Soyadınız', 'E-posta Adresiniz', 'TC Kimlik Numaranız', '05555555555',
    'Ev Adresiniz'];
  companyPlaceholders: string[] = ['Şirket Adı', 'E-posta Adresiniz', 'Vergi Kimlik Numaranız', '05555555555',
    'Şirket Adresiniz'];
  placeholderType: string[] = this.personalPlaceholders;

  currentStep: number = 0;
  titles: string[] = ['Kişisel ve Adres Bilgilerim', 'Ödeme Bilgilerim'];
  title: string = this.titles[0];
  subtitle: string = this.titles[0];
  nextButtonText: string = 'Ödeme Bilgilerini Tamamla';
  previousButtonText: string = 'Önceki Adım';

  myUserObject = {
    user_id: "",
    ad: '',
    soyad: '',
    email: '',
    tcknvkn: '',
    vkno: '',
    vergi_dairesi: '',
    tip: '1',
    telefon: '',
    adres: '',
    teslimatadresi: '',
    indirim: 0,
    ccn: '',
    cardholder: '',
    validity: '',
    cvv: '',
    faturaadresi: '',
    select: '',
    selectstate: '',
    zip: '',
  };

  savedCards: any[] = [];  // LocalStorage'dan gelen kartlar
  selectedCardIndex: number = -1; // Seçili kartın indexi
  showNewCardForm: boolean = false; // Yeni kart formunu aç/kapat

  protected selectedShippingCity: number = 0;
  protected selectedShippingDistrict: number = 0;
  protected selectedBillingCity: number = 0;
  protected selectedBillingDistrict: number = 0;
  protected customerType: number = 0;

  constructor(public cartService: CartService, private toastrService: ToastrService, private router: Router, private formBuilder: FormBuilder) {
  }

  showPolicyModal: boolean = false;
  showPaymentModal: boolean = false;
  
  get fullName(): string {
    // Eğer ad ve soyad ikisi de boşsa boş bir string döndür
    if (!this.myUserObject.ad && !this.myUserObject.soyad) {
      return '';
    }
    return `${this.myUserObject.ad} ${this.myUserObject.soyad}`.trim();
  }
  
  set fullName(value: string) {
    // Girilen değerdeki baştaki ve sondaki boşlukları temizle
    const trimmedValue = value.trim();
    
    if (trimmedValue) {
      const [ad, ...soyadParts] = trimmedValue.split(' ');
      this.myUserObject.ad = ad || '';
      this.myUserObject.soyad = soyadParts.join(' ') || '';
    } else {
      // Eğer tamamen boş bir string girildiyse, ad ve soyadı boş yap
      this.myUserObject.ad = '';
      this.myUserObject.soyad = '';
    }
  }
  
  togglePolicyModal(): void {
    this.showPolicyModal = !this.showPolicyModal;
  }

  togglePaymentModal(): void {
    this.showPaymentModal = !this.showPaymentModal;
  }

  handleOpenLogin() {
    this.isOpenLogin = !this.isOpenLogin;
  }

  handleOpenCoupon() {
    this.isOpenCoupon = !this.isOpenCoupon;
  }

  handleShippingCost(value: number | string) {
    let sayi = Number(value)
    this.discount = (this.cartService.totalPriceQuantity().total * sayi) / 100;
    // if (value === 'free') {
    //   this.shipCost = 0;
    // } else {
    //   this.shipCost = value as number;
    // }
  }

  onCheckboxClick(event: any): void {
    this.isTermAccepted = event.target.checked;
    console.log('Tıklandı', this.isTermAccepted);
    this.checkoutForm.patchValue({
      usePolicy: this.isTermAccepted
    });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) { // ASCII for 0-9
      event.preventDefault();
    }
  }
  // Dropdown'u gizle
hideDropdown(): void {
  // Küçük bir gecikme ekleyerek kullanıcı seçim yaparken dropdown'ı kapatıyoruz
  setTimeout(() => {
    this.showDropdown = false;
  }, 200);
}

  filterVergiDaireleri() {
    console.log('Arama terimi:', this.searchTerm); // Kullanıcının girdiği değeri kontrol edin
    const term = this.searchTerm.toLowerCase(); // Küçük harfe çevir
    this.filteredVergiDaireleri = this.vergiDaireleri.filter(item =>
      (item.il + ' ' + item.ilce + ' ' + item.muhasebe_birimi_kodu + ' ' + item.vergi_dairesi)
        .toLowerCase()
        .includes(term)
    );
    console.log('Filtrelenen sonuçlar:', this.filteredVergiDaireleri); // Sonuçları konsolda kontrol edin
  }
  
  selectVergiDairesi(item: any) {
    // Vergi dairesinin tam değerini oluştur
    const fullValue = `${item.il} ${item.ilce} ${item.muhasebe_birimi_kodu} ${item.vergi_dairesi}`;
    
    // myUserObject içine tam değeri ata
    this.myUserObject.vergi_dairesi = fullValue;
  
    // Arama kutusunu güncelle
    this.searchTerm = fullValue;
  
    // Dropdown'ı kapat
    this.filteredVergiDaireleri = [];
    
    console.log("Seçilen Vergi Dairesi:", fullValue); // Debug için log ekleyin
  }
  
  
  
  
  public countrySelectOptions = [
    {value: 'select-country', text: 'Select Country'},
    {value: 'avrupa', text: 'Avrupa'},
    {value: 'asya', text: 'Asya'},
    {value: 'afrika', text: 'Afrika'},
    {value: 'amerika', text: 'Amerika'},
  ];

  assignShippingDistricts(event: Event) {
    this.selectedShippingCity = (event.target as HTMLSelectElement).selectedIndex;
    this.fnIlceler(this.selectedShippingCity, false);
  }

  assignBillingDistricts(event: Event) {
    this.selectedBillingCity = (event.target as HTMLSelectElement).selectedIndex;
    this.fnIlceler(this.selectedBillingCity, true);
  }

  shippingDistrictChangeHandler($event: Event) {
    this.selectedShippingDistrict = ($event.target as HTMLSelectElement).selectedIndex;
  }

  billingDistrictChangeHandler($event: Event) {
    this.selectedBillingDistrict = ($event.target as HTMLSelectElement).selectedIndex;
  }

  shippingCityChangeHandler(city: number) {
    // Update the 'city' form control with the selected option's value
    this.selectedShippingCity = city;
  }

  billingCityChangeHandler(city: number) {
    // Update the 'city' form control with the selected option's value
    this.selectedBillingCity = city;
  }

  handleCouponSubmit() {
    console.log(this.couponCode);
    // Add coupon code handling logic here
    if (this.couponCode) {
      // logic here

      // when submitted the from than empty will be coupon code
      this.couponCode = ''
    }
  }

  // handle payment item
  handlePayment(value: string) {
    this.payment_name = value
  }

  public checkoutForm!: FormGroup;
  public formSubmitted = false;

  public paymentForm!: FormGroup;
  public paymentFormSubmitted = false;

  public billingAddressForm!: FormGroup;
  public addressFormSubmitted = false
  isPersonalInfoCompleted: boolean = false;

  isBillingAddressSame: boolean = false;
  public shippingAddressForm!: FormGroup;

  ngOnInit() {
    this.checkoutForm = new FormGroup({
      persontype: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      id: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{11}$/) // 11 haneli olmalı, sadece rakam içermeli
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{11}$/) // 11 haneli olmalı, sadece rakam içermeli
      ]),
      email: new FormControl(null, Validators.required),
      usePolicy: new FormControl(null, Validators.requiredTrue),
    })
    this.urunler = this.cartService.getCartProducts();
    this.getUserById();
    this.fetchShippingCost();  // Call this function to set the shipping cost

    this.objCities = cities_data;
    
    this.filteredVergiDaireleri = this.vergiDaireleri;

    this.paymentForm = new FormGroup({
      ccn: new FormControl(null, [Validators.required]),
      cardholder: new FormControl(null, [Validators.required]),
      validity: new FormControl(null, [Validators.required]),
      cvv: new FormControl(null, [Validators.required, ]),
    })

    this.loadSavedCards(); // Kayıtlı kartları yükle

    this.shippingAddressForm = this.formBuilder.group({
      shippingaddress: ['', Validators.required],  // Visible input field
      shippingselect: 'Istanbul',  // Hidden static field, no validators
      shippingselectstate: 'Kadıköy',  // Hidden static field, no validators
      shippingzip: '34848',  // Hidden static field, no validators
      billingCheckbox: [false]
    });

    // Initialize billingAddressForm with static values for hidden fields
    this.billingAddressForm = this.formBuilder.group({
      billingaddress: ['', Validators.required],  // Visible input field
      select: 'Ankara',  // Hidden static field, no validators
      selectstate: 'Çankaya',  // Hidden static field, no validators
      zip: '06500'  // Hidden static field, no validators
    });
    
  }
  get idInvalid() {
    return this.checkoutForm.get('id')?.invalid && this.checkoutForm.get('id')?.touched;
  }

  get phoneInvalid() {
    return this.checkoutForm.get('phone')?.invalid && this.checkoutForm.get('phone')?.touched;
  }
  updateInfo() {
    console.log(this.myUserObject);
  
  
  
    this.infoUpdated = true;
  }
  
  

  updatePaymentInfo() {
    console.log(this.myUserObject);

    this.paymentInfoUpdated = true;
  }

  checkoutDoldur() {
    console.log("checkdoldur");
    this.checkouts.session_key = String(this.getCookie("session_key"));

    this.checkouts.satilan_urunler = [];


    for (let product of this.urunler) {
      let ikili: string[] = []
      ikili?.push(product.id.toString());
      ikili?.push(product.orderQuantity!.toString());
      this.checkouts.satilan_urunler?.push(ikili);
    }

  }

  GetPostChechout(checkout: checkk) {
    this.sendRequest('Satis/MakePurchase', 'POST', checkout)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.error("Error: " + err);
      })

  }

  fetchShippingCost() {
    this.sendLocalRequest('Urun/GetById/940', 'GET')
      .then(response => {
        // Assuming `fiyat` is the price from the product data
        if (response && response.fiyat != null) {
          this.shipCost = response.fiyat;
          console.log('Shipping cost set to:', this.shipCost);
        } else {
          console.error('Failed to fetch shipping cost: invalid response format');
        }
      })
      .catch(err => {
        console.error('Error fetching shipping cost:', err);
      });
  }
  

  getUserById() {
    this.sendRequestWithHeaders('User/GetUser', 'GET', {
      'Authorization': `Bearer ${this.getCookie("session_key")}`
    })
      .then(response => {
        console.log("Response Data:", response); // Tüm yanıtı burada görün
  
        // Yanıtın `data` yerine doğrudan kullanılmasını kontrol edin
        this.myUserObject = response; // Eğer `data` yoksa `response` nesnesini kullanın
        this.isUserLogin = true;
        this.calculateDisc();
        this.shippingAddressForm.get('shippingaddress')?.setValue(this.myUserObject.teslimatadresi);
        this.billingAddressForm.get('billingaddress')?.setValue(this.myUserObject.faturaadresi);
      })
      .catch(err => {
        console.error("Error: " + err);
        //this.router.navigate(['/pages/login']);
      });
  }
  

  calculateDisc() {

    let sayi = Number(this.myUserObject.indirim)
    this.discount = (this.cartService.totalPriceQuantity().total * sayi) / 100;
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
  
  sendLocalRequest(url: string, method: string, data?: any): Promise<any> {
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
  // 1️⃣ LocalStorage'dan Kartları Yükle
loadSavedCards() {
  const storedCards = localStorage.getItem('savedCards');
  this.savedCards = storedCards ? JSON.parse(storedCards) : [];
}

// 2️⃣ Yeni Kart Ekleme veya Düzenleme
saveCard() {
  const newCard = {
    cardholder: this.paymentForm.value.cardholder,
    last4Digits: this.paymentForm.value.ccn.slice(-4),
    validity: this.paymentForm.value.validity,
    cvv: this.paymentForm.value.cvv
  };

  if (this.selectedCardIndex !== -1) {
    // Eğer bir kart düzenleniyorsa, mevcut kartı güncelle
    this.savedCards[this.selectedCardIndex] = newCard;
  } else {
    // Yeni kart ekle
    this.savedCards.push(newCard);
  }

  localStorage.setItem('savedCards', JSON.stringify(this.savedCards));

  this.paymentForm.reset();
  this.showNewCardForm = false;
  this.selectedCardIndex = -1;
}

// 3️⃣ Kart Seçme İşlemi
selectCard(index: number) {
  this.selectedCardIndex = index;
}

// 4️⃣ Kart Düzenleme
editCard(index: number) {
  const cardToEdit = this.savedCards[index];

  this.paymentForm.patchValue({
    cardholder: cardToEdit.cardholder,
    ccn: '', // Güvenlik nedeniyle tam numara gösterilmez
    validity: cardToEdit.validity,
    cvv: '' // CVV güvenlik nedeniyle boş bırakılmalı
  });

  this.selectedCardIndex = index;
  this.showNewCardForm = true;
}
  odemeYap() {

    if (this.currentStep != 1)
      return;

    if (this.checkoutForm.invalid || this.paymentForm.invalid || this.billingAddressForm.invalid || this.shippingAddressForm.invalid) {
      this.toastrService.error('Lütfen tüm alanları doldurunuz.', 'Hata');
      //return;
    }

    let [expMonth, expYear] = this.myUserObject.validity.split("/");


    // List<Entity>
    const newCartProducts = this.cartService.getCartProducts().map(product => {
      return {
        name: product.aciklama,
        price: product.fiyat,
        orderQuantity: product.orderQuantity
      }
    });
    const concatAddress = this.billingAddressForm.get('billingaddress')?.value + " " + this.billingAddressForm.get('zip')?.value;
    const concatShippingAddress = this.shippingAddressForm.get('shippingaddress')?.value + " " + this.shippingAddressForm.get('shippingzip')?.value;

    const totalPrice = Math.round((this.cartService.totalPriceQuantity().total + this.shipCost) * 100);

    console.log("ad : " + this.myUserObject.ad);
    console.log("vkno : " + this.myUserObject.vkno);
    console.log("telefon : " + this.myUserObject.telefon);
    console.log("bireysel_kurumsal : " + this.myUserObject.tip);
    console.log("adres : " + concatAddress);
    console.log("shippingaddress : " + concatShippingAddress);
    console.log("vergi dairesi : " + this.myUserObject.vergi_dairesi);
    // Obje basıyor
    console.log("products : " + newCartProducts);
    // Obje basıyor
    console.log("cart: " + this.cartService.getCartProducts());
    // ÜRünleri basıyor
    this.cartService.getCartProducts().forEach(product => {
      console.log("product: " + product.ad + " " + product.fiyat + " " + product.orderQuantity);
    });

    console.log("email : " + this.myUserObject.email);
    // TODO IP?

    console.log("price: " + this.cartService.totalPriceQuantity().total);
    console.log("shippingCost: " + this.shipCost);
    console.log("totalPrice: " + totalPrice);

    //console.log("discount : " + this.myUserObject.discount);

    console.log("cardholder : " + this.cardholder?.value);
    console.log("ccn : " + this.myUserObject.ccn);
    console.log("validityDateMonth : " + expMonth);
    console.log("validityDateYear : " + expYear);
    console.log("cvv : " + this.myUserObject.cvv);
    const adsoyad= this.myUserObject.ad + "" + this.myUserObject.soyad
    // POST isteği için gerekli ödeme bilgileri
    const paymentData = {
      aliciAdi: adsoyad,
      tcknvkn: this.customerType === 1 ? `${this.myUserObject.vkno}${this.myUserObject.vergi_dairesi}` : this.myUserObject.tcknvkn,
      gecicino: this.generatId(),
      telefon: this.myUserObject.telefon,
      bireysel_kurumsal: this.myUserObject.tip.toString(),
      teslimatAdresi: `${this.shippingAddressForm.get('shippingaddress')?.value}}`,
      faturaAdresi: `${this.billingAddressForm.get('billingaddress')?.value}}`,
      urunler: this.cartService.getCartProducts().map(product => ({
        id: product.id,
        ad: product.aciklama,
        fiyat: Math.round(product.fiyat * 100), // Convert to integer in cents (8.8 TL -> 880 kuruş)
        adet: product.orderQuantity
      })),
      customerEmailAddress: this.myUserObject.email,
      customerIpAddress: '190.268.0',
      txnAmount: totalPrice, // Total in cents as well
      cardHolderName: this.cardholder?.value,
      cardNumber: String(this.ccn?.value),
      cardExpireDateMonth: expMonth,
      cardExpireDateYear: expYear,
      cardCvv2: String(this.cvv?.value)
    };
    
    console.log("Payment Data:", JSON.stringify(paymentData, null, 2));
    console.log("Billing Address:", this.billingAddressForm.value);
    console.log("Shipping Address:", this.shippingAddressForm.value);

    

    this.sendLocalRequest('Payment/SiparisVer', 'POST', paymentData)
  .then(response => {
    // Assume the response contains the HTML as a string
    const htmlContent = response; // Adjust this if needed, based on your actual response data

    // Create a Blob from the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Open the URL in a new tab
    const newWindow = window.open(url, '_blank');
    // Reset the relevant data after successful payment
    this.paymentForm.reset();
    this.checkoutForm.reset();
 

    // Optional: Clean up the URL after the tab is opened
    newWindow?.addEventListener('load', () => URL.revokeObjectURL(url));
  })
  .catch(err => {
    console.error("Error:", err);
  });

  }

  generatId():string{
    let siparisnoLocal:string = Date.now().toString();
    this.setCookie("sonsiparisno",siparisnoLocal,30);

    return siparisnoLocal;


  };

  setCookie(name: string, value: string, days: number) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  previousStep() {
    this.currentStep = 0;
    this.nextButtonText = 'Ödeme Bilgilerini Tamamla';
    this.title = this.titles[0];
    this.subtitle = this.titles[0];
  }
  
  nextStep() {
    try {
        this.checkInputValidity();

        // Eğer currentStep 0 ise, sadece adımı ilerlet
        if (this.currentStep === 0) {
            this.currentStep++;
            this.updateUI();
        }
        // Eğer currentStep 1 ise, ödeme modalını aç
        else if (this.currentStep === 1) {
            this.togglePaymentModal();
        }
    } catch (error) {
        console.error("An error occurred in nextStep:", error);
    }
}

  
  updateUI() {
    if (this.currentStep > 0) {
      this.nextButtonText = 'Ödemeyi Onayla';
      this.title = 'Ödeme Bilgilerim';
      this.subtitle = 'Lütfen ödeme bilgilerinizi girin';
    } else {
      this.currentStep = 0; // Sayfa yenilendiğinde başa döner
      this.nextButtonText = 'Ödeme Bilgilerini Tamamla';
      this.title = 'Kişisel ve Adres Bilgilerim';
      this.subtitle = 'Lütfen kişisel ve adres bilgilerinizi girin';
    }
  } 
  
  checkInputValidity() {
    if (this.checkoutForm.invalid) {
      //this.toastrService.error('Lütfen tüm alanları doldurunuz.', 'Hata');
      this.toastrService.error('Lütfen tüm bilgileri giriniz.', 'Hata');
      if (!this.isTermAccepted) {
        this.toastrService.error('Lütfen kullanım koşullarını kabul edin.', 'Hata');
      }
      throw new Error("Form is invalid");
    } else if (this.currentStep == 0 &&
      (this.shippingAddressForm.invalid || this.billingAddressForm.invalid && !this.isBillingAddressSame)) {
      console.log(this.shippingAddressForm);
      console.log(this.billingAddressForm);
      console.log(this.isBillingAddressSame);
      this.toastrService.error('Lütfen tüm alanları doldurunuz.', 'Hata');
      throw new Error("Form is invalid");
    }
  }

  setAsPersonal() {
    this.customerType = 0;
    this.placeholderType = this.personalPlaceholders;
    this.checkoutForm.get('id')?.setValidators([
      Validators.required,
      Validators.pattern(/^\d{11}$/) // Vergi numarası için 10 rakam
    ]);
    this.checkoutForm.get('id')?.updateValueAndValidity();
  }

  setAsCompany() {
    this.customerType = 1;
    this.placeholderType = this.companyPlaceholders;
    this.checkoutForm.get('id')?.setValidators([
      Validators.required,
      Validators.pattern(/^\d{10}$/) // Vergi numarası için 10 rakam
    ]);
    this.checkoutForm.get('id')?.updateValueAndValidity();
  }

  onBillingCheckboxClick() {

    this.billingAddressForm.patchValue({
      billingaddress: this.shippingAddressForm.get('shippingaddress')?.value,
      select: this.shippingAddressForm.get('shippingselect')?.value,
      selectstate: this.shippingAddressForm.get('shippingselectstate')?.value,
      zip: this.shippingAddressForm.get('shippingzip')?.value,
    });

    this.selectedBillingCity = this.selectedShippingCity;
    this.selectedBillingDistrict = this.selectedShippingDistrict;

    this.isBillingAddressSame = !this.isBillingAddressSame;

    /* else {
    this.billingAddressForm.patchValue({
      billingaddress: '',
      select: '',
      selectstate: '',
      zip: '',
    });
  }
  */
  }

  siparisGonder() {

    if (this.isTermAccepted) {
      this.togglePaymentModal();
    } else {
      this.toastrService.error('Lütfen ödeme koşullarını kabul edin.', 'Hata');
    }

    /*
    try {
      const cardNumber = document.getElementById("card-number") as HTMLInputElement;
      const cardNameInput = document.getElementById("card-name-input") as HTMLInputElement;
      const validity = document.getElementById("validit y-input") as HTMLInputElement;
      const cvvInput = document.getElementById("cvv") as HTMLInputElement;

      //Reflip card
      document.addEventListener("click", () => {

      });

      window.onload = () => {
        cvvInput.value = "";
        validity.value = "";
        cardNameInput.value = "";
        cardNumber.value = "";
      };
    } catch (error) {
      console.error("Err");
    }
      */
  }

  onNumberChange() {
    const cardNumber = document.getElementById("ccn") as HTMLInputElement;
    const cardNumberDisplay = document.querySelectorAll(".card-number-display");
    let currentSpanIndex = 0;

    const inputNumber = cardNumber.value.replace(/\D/g, "");
    cardNumber.value = cardNumber.value.slice(0, 16).replace(/\D/g, "");
    this.myUserObject.ccn = cardNumber.value;

    for (let i = 0; i < cardNumberDisplay.length; i++) {
      if (i < inputNumber.length) {
        cardNumberDisplay[i].textContent = inputNumber[i];
      } else {
        cardNumberDisplay[i].textContent = "_";
      }
    }

    if (inputNumber.length <= cardNumberDisplay.length) {
      currentSpanIndex = inputNumber.length;
    } else {
      currentSpanIndex = cardNumberDisplay.length;
    }
  }

  onCardNameChange() {
    const cardHolderName = document.getElementById("card-holder-name") as HTMLInputElement;
    const cardNameInput = document.getElementById("cardholder") as HTMLInputElement;
    cardHolderName.innerText = cardNameInput.value;

    if (cardNameInput.value.length < 1) {
      cardHolderName.innerText = "Your Name Here";
    } else if (cardNameInput.value.length > 30) {
      cardNameInput.value = cardNameInput.value.slice(0, 30);
    } else {
      cardHolderName.innerText = cardNameInput.value;
    }
  }

  validateExpiryDate() {
    const displayValidity = document.getElementById("displayvalidity") as HTMLInputElement;
    const validity = document.getElementById("validity") as HTMLInputElement;

    const inputString = validity.value;
    let formattedString = "";

    if (inputString.length < 1 || inputString.length > 5) {
      formattedString = "";
      displayValidity.innerText = formattedString;
      validity.value = formattedString;
      this.myUserObject.validity = formattedString;
    }
    //const parts = inputString.split("-");
    //const year = parts[0].slice(2);
    //const month = parts[1];

    formattedString = inputString;
    validity.value = formattedString;
    displayValidity.innerText = formattedString;
    this.myUserObject.validity = formattedString;

    if (inputString.length == 3 && inputString[2] != "/") {
      formattedString = inputString.slice(0, 2) + "/" + inputString.slice(2, 3);
    } else if (inputString.length == 3 && inputString[2] == "/") {
      formattedString = inputString.slice(0, 2);
    } else if (inputString.length > 3) {
      formattedString = inputString.slice(0, 2) + "/" + inputString.slice(3, 5);
    }

    if (parseInt(inputString.slice(0, 2)) > 12 || parseInt(inputString.slice(0, 2)) < 0) {
      formattedString = "0" + inputString.slice(0, 1) + "/" + "25";
    }
    validity.value = formattedString;
    displayValidity.innerText = formattedString;
    this.myUserObject.validity = formattedString;
  }

  onCVVChange() {
    const cvvInput = document.getElementById("cvv") as HTMLInputElement;
    const cvvDisplay = document.getElementById("cvv-display") as HTMLInputElement;
    cvvDisplay.innerText = cvvInput.value;

    const userInput = cvvInput.value;
    const sanitizedInput = userInput.slice(0, 4);
    const numericInput = sanitizedInput.replace(/\D/g, "");
    cvvInput.value = numericInput;
    cvvDisplay.innerText = numericInput;
    this.myUserObject.cvv = numericInput;
  }

  onCVVclick() {
    document.getElementById("card")!.style.transform = "rotateY(180deg)";
  }

  onCVVnotfocused() {
    if (document.activeElement!.id != "cvv") {
      document.getElementById("card")!.style.transform = "rotateY(0deg)";
    }
  }

  onAddressChange() {
    const addressInput = document.getElementById("billing-address") as HTMLInputElement;
    addressInput.innerText = addressInput.value;

    if (addressInput.value.length < 1) {
      addressInput.innerText = "Your Address Here";
    } else if (addressInput.value.length > 50) {
      addressInput.value = addressInput.value.slice(0, 50);
    } else {
      addressInput.innerText = addressInput.value;
    }
  }


  /*
    checkccn() {

      let ccnElement = document.querySelector("#ccn") as HTMLInputElement;
      if (ccnElement) {
        var ccn = ccnElement.value;
        if (ccn.length >= 16) {
          ccnElement.value = ccn.substring(0, 4) + " " + ccn.substring(4, 8) + " " + ccn.substring(8, 12) + " " + ccn.substring(12, 16);
        } else {
          //ccnElement.value = "";
        }
      }
      else {
        console.error("ccn element not found");
      }
    }

    checkexpiry() {
      let expiryElement = document.querySelector("#validity") as HTMLInputElement;
      if (expiryElement) {
        var expiry = expiryElement.value;
        if (expiry.length >= 5) {
          expiryElement.value = expiry.substring(0, 2) + "/" + expiry.substring(2, 4);
          if (parseInt(expiryElement.value.substring(0, 2)) > 12
            || parseInt(expiryElement.value.substring(0, 2)) < 1) {
            expiryElement.value = "12" + "/" + expiry.substring(2, 4);
          }
        } else {
          expiryElement.value = "";
        }
      }
      else {
        console.error("expiry element not found");
      }
    }

    checkcvc() {
      let cvcElement = document.querySelector("#cvv") as HTMLInputElement;
      if (cvcElement) {
        var cvc = cvcElement.value;
        if (cvc.length >= 3) {
          cvcElement.value = cvc.substring(0, 3);
        } else {
          cvcElement.value = "";
        }
      }
      else {
        console.error("cvc element not found");
      }
    }
  */
  checkzip() {
    let zipElement = document.querySelector("#zip") as HTMLInputElement;
    let zipElement2 = document.querySelector("#shippingzip") as HTMLInputElement;
    if (zipElement) {
      var zip = zipElement.value;
      if (zip.length >= 5) {
        zipElement.value = zip.substring(0, 5);
      }
    } else {
      console.error("zip element not found");
    }
    if (zipElement2) {
      var zip = zipElement2.value;
      if (zip.length >= 5) {
        zipElement2.value = zip.substring(0, 5);
      }
    } else {
      console.error("zip element not found");
    }
  }


  // Define fnIlceler first
  fnIlceler(strSehir_ID: number, isShipping: boolean = false) {
    try {
      if (isShipping) {
        let objIlceler = document.querySelector("#selectstate") as HTMLSelectElement;
        if (!objIlceler) throw new Error("Select element not found");

        while (objIlceler.options.length > 0) {
          objIlceler.remove(0);
        }
        let option = document.createElement("option");
        if (!option) throw new Error("Option element not created");

        for (let i = 0; i < cities_data[strSehir_ID].districts.length; i++) {

          option = document.createElement("option");
          if (!option) throw new Error("Option element not created");

          option.text = cities_data[strSehir_ID].districts[i].text;
          option.value = cities_data[strSehir_ID].districts[i].value.toString();
          objIlceler.appendChild(option);

        }
      } else {
        let objIlceler2 = document.querySelector("#shippingselectstate") as HTMLSelectElement;
        if (!objIlceler2) throw new Error("Select element not found");
        while (objIlceler2.options.length > 0) {
          objIlceler2.remove(0);
        }
        let option = document.createElement("option");
        if (!option) throw new Error("Option element not created");

        for (let i = 0; i < cities_data[strSehir_ID].districts.length; i++) {

          option = document.createElement("option");
          if (!option) throw new Error("Option element not created");

          option.text = cities_data[strSehir_ID].districts[i].text;
          option.value = cities_data[strSehir_ID].districts[i].value.toString();
          objIlceler2.appendChild(option);
        }
      }

    } catch (error) {
      console.error("An error occurred in fnIlceler:", error);
      // Handle the error or report it to the user here
    }
  }


  // Define fnSehirler next
  fnSehirler() {

    let objSehirler: HTMLSelectElement | null = document.querySelector("#select");
    let objSehirler2: HTMLSelectElement | null = document.querySelector("#shippingselect");
    let option: HTMLOptionElement | null = document.createElement("option");

    try {
      //if (!objSehirler) throw new Error("Select element not found");
      if (!objSehirler2) return;

      for (let i = 0; i < this.objCities.length; i++) {
        option = document.createElement("option");
        if (!option) throw new Error("Option element not created");

        option.text = this.objCities[i].text;
        option.value = this.objCities[i].value.toString();
        objSehirler2.appendChild(option.cloneNode(true));
        if (!objSehirler) continue;
        objSehirler?.appendChild(option);
      }

      objSehirler2.addEventListener("click", (event) => {
        if (!objSehirler2) return;
        let strSehir_ID2 = objSehirler2.selectedIndex;
        this.fnIlceler(strSehir_ID2 - 1, false);
      });

      if (!objSehirler) return;

      objSehirler?.addEventListener("click", (event) => {
        if (!objSehirler) return;
        let strSehir_ID = objSehirler?.selectedIndex;
        this.fnIlceler(strSehir_ID - 1, true);
      });

    } catch (error) {
      console.error("An error occurred in fnSehirler:", error);
      // Handle the error or report it to the user here
    }
  }

  get firstName() {
    return this.checkoutForm.get('firstName')
  }

  get lastName() {
    return this.checkoutForm.get('lastName')
  }

  get address() {
    return this.checkoutForm.get('address')
  }

  get phone() {
    return this.checkoutForm.get('phone')
  }

  get email() {
    return this.checkoutForm.get('email')
  }

  get ccn() {
    return this.paymentForm.get('ccn')
  }

  get cardholder() {
    return this.paymentForm.get('cardholder')
  }

  get validity() {
    return this.paymentForm.get('validity')
  }

  get cvv() {
    return this.paymentForm.get('cvv')
  }

  get billingaddress() {
    return this.billingAddressForm.get('billingaddress')
  }

  get select() {
    return this.billingAddressForm.get('select')
  }

  get selectstate() {
    return this.billingAddressForm.get('selectstate')
  }

  get zip() {
    return this.billingAddressForm.get('zip')
  }


  protected readonly cities_data = cities_data;
  protected readonly vergiDaireleri = vergiDaireleri;
}
