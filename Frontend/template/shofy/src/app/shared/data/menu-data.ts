import { IMenuItem, IMobileType } from "@/types/menu-d-type";

export const menu_data:IMenuItem[] = [
  {
    id:1,
    link:'/anasayfa',
    title:'ANASAYFA',
    mega_menu:false,
  },
  {
    id:2,
    link:'/pages/hizmetler',
    title:'HİZMETLERİMİZ',
    mega_menu:false,
  },
  {
    id:3,
    link:'/anasayfa/projeler',
    title:'PROJELER',
  },
  {
    id:4,
    link:'/pages/hakkimizda',
    title:'HAKKIMIZDA'
  },
  {
    id:5,
    link:'/pages/contact',
    title:'İLETİŞİM',
  },
//   {
//     id:6,
//     link:'/shop',
//     title:'MAĞAZA'
//   }
]

// mobile menu data
export const mobile_menu:IMobileType[] = [
  {
    id:1,
    link:'/anasayfa',
    title:'ANASAYFA'
  },
  {
    id:2,
    link:'/pages/hizmetler',
    title:'HİZMETLERİMİZ'
  },
  {
    id:3,
    link:'/anasayfa/projeler',
    title:'PROJELER',
  },
  {
    id:4,
    link:'/pages/hakkimizda',
    title:'HAKKIMIZDA'
  },
  {
    id:5,
    link:'/pages/contact',
    title:'İLETİŞİM',
  },
//   {
//     id:6,
//     link:'/shop',
//     title:'MAĞAZA'
//   }
]
