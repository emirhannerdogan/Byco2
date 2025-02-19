type IReview = {
  user?:string;
  name:string;
  email:string;
  rating:number;
  review:string;
  date:string;
}

export interface IProduct{

    [key: string]: any; // Dinamik anahtarlar için index signature

    id:number,
    ad: string,
    kategori: string,
    img: string,
    kod: string,
    aciklama: string,

    amper: string,
    aydinlatmaturu: string,
    cerceve: string,
    damarsayisi: string,

    disKilifrengi: string,
    duy: string,
    isikrengi: string,
    kablotipi: string,

    kablouzunlugu: string,
    kanalboyutu: string,
    kanalozelligi: string,
    kanalrengi: string,

    kasarengi: string,
    kesit: string,
    kesmekapasitesi: string,
    kullanimyeri: string,

    kutup: string,
    marka: string,
    model: string,
    prizsayisi: string,

    renk: string,
    renksicakligikelvin: string,
    sigortasayisi: string,
    tip: string,

    tur: string,
    urun: string,
    urunozelligi: string,
    uruntipi: string,

    watt: string,
    stok: number,
    fiyat: number,
    indirim: number,
    orderQuantity?: number
    durum?: string,
    parent?: string,
    children?: string,
}

// export interface IProduct {
//   id: string;
//   sku: string;
//   img: string;
//   title: string;
//   slug: string;
//   unit: string;
//   imageURLs: {
//     color?: {
//       name: string;
//       clrCode: string;
//     };
//     img: string;
//   }[];
//   parent: string;
//   children: string;
//   price: number;
//   discount: number;
//   quantity: number;
//   brand: {
//     name: string;
//   };
//   category: {
//     name: string;
//   };
//   status: string;
//   reviews?: IReview[];
//   productType: string;
//   description: string;
//   orderQuantity?: number;
//   additionalInformation: {
//     key: string;
//     value: string;
//   }[];
//   featured?: boolean;
//   sellCount: number;
//   offerDate?:{
//     startDate:string;
//     endDate:string;
//   }
//   tags?: string[];
//   videoId?:string;
//   sizes?:string[];
// }