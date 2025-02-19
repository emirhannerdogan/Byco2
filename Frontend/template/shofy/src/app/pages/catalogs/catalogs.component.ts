import { Component } from '@angular/core';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss']
})
export class CatalogsComponent {
  catalogs = [
    { name: 'Ack', description: 'Ack 2024 Kataloğu', image: '/assets/catalogs/imgs/ack2024.jpg', url: '/assets/catalogs/pdfs/ack2024.pdf' },
    { name: 'Cata', description: 'Cata 2025 Kataloğu', image: '/assets/catalogs/imgs/cata2025.jpg', url: '/assets/catalogs/pdfs/cata2025.pdf' },
    { name: 'Entes', description: 'Entes 2024 Kataloğu', image: '/assets/catalogs/imgs/entes2024.jpg', url: '/assets/catalogs/pdfs/entes2024.pdf' },
    { name: 'Erse', description: 'Erse 2023 Kataloğu', image: '/assets/catalogs/imgs/erse2023.jpg', url: '/assets/catalogs/pdfs/Erse2023.pdf' },
    { name: 'Bemis', description: 'Bemis 2024-2 E-V Sarj Cihazları Fiyat Listesi', image: '/assets/catalogs/imgs/bemis2024.jpg', url: '/assets/catalogs/pdfs/bemis2024.pdf' },
    { name: 'AG', description: 'AG Kasım 2024 Fiyat Listesi', image: '/assets/catalogs/imgs/ag2024.jpg', url: '/assets/catalogs/pdfs/ag2024.xlsx' },
    { name: 'Econ', description: 'Econ Ekim 2023 Kataloğu', image: '/assets/catalogs/imgs/econ2023.jpg', url: '/assets/catalogs/pdfs/econ2023.pdf' },
    { name: 'ETKS', description: 'ETKS 2024 Fiyat Listesi', image: '/assets/catalogs/imgs/ag2024.jpg', url: '/assets/catalogs/pdfs/etks2024.xlsx' },
    { name: 'Goldsun', description: 'Goldsun Ağustos 2024 Kataloğu', image: '/assets/catalogs/imgs/goldsun2024.jpg', url: '/assets/catalogs/pdfs/goldsun2024.pdf' },
    { name: 'Güven', description: 'Güven Ocak 2025 Kataloğu', image: '/assets/catalogs/imgs/guven2025.jpg', url: '/assets/catalogs/pdfs/guven2025.pdf' },
    { name: 'HES', description: 'HES 2024 Kataloğu', image: '/assets/catalogs/imgs/hes2024.jpg', url: '/assets/catalogs/pdfs/hes2024.pdf' },
    { name: 'Mutlusan Electric', description: 'Mutlusan Electric 2024-2 Kataloğu', image: '/assets/catalogs/imgs/mutlusan2024.jpg', url: '/assets/catalogs/pdfs/mutlusan2024.pdf' },
    { name: 'Nexans', description: 'Nexans Ocak 2023 Kataloğu', image: '/assets/catalogs/imgs/nexans2023.jpg', url: '/assets/catalogs/pdfs/nexans2023.pdf' },
    { name: 'Panasonic', description: 'Panasonic 2025-1 Kataloğu', image: '/assets/catalogs/imgs/panasonic2025.jpg', url: '/assets/catalogs/pdfs/panasonic2025.pdf' },
    { name: 'Poweşarj', description: 'Powerşarj Kataloğu', image: '/assets/catalogs/imgs/powersarj.jpg', url: '/assets/catalogs/pdfs/powersarj.pdf' },

  ];

  downloadCatalog(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.substring(url.lastIndexOf('/') + 1); // Dosya adını ayıkla
    link.click();
  }
}
