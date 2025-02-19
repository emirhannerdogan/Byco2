import { ICategory } from "@/types/category-type";
import { HttpClient } from '@angular/common/http';
import { URL } from "../services/url";


// class CategoryService {
//     benimUrl = "https://bycobackend.online:5001/api";

//     kategori: ICategory[] = [];
//     okey = false;
  
//     constructor() {}

//     result():ICategory[]{
//         return this.kategori;
//     }

//     getKategoriler(){
//         this.sendRequest('Kategori/GetAll','GET')
//         .then(response => {
//             this.kategori = response;
//             this.okey=true;
//         })
//         .catch(err => {
//           console.error("Error: " + err);
//         })
//         this.okey=false;
//       }

//     private sendRequest(url: string, method: string, data?:any): Promise<any> {
    
//         return fetch(`${this.benimUrl}/${url}`, {
//           method: method,
//           mode: 'cors',
//           cache: 'no-cache',
//           credentials: 'same-origin',
//           headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//           },
//           redirect: 'follow',
//           referrerPolicy: 'no-referrer',
//           body: JSON.stringify(data), 
//       })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(response.statusText);
//         }
//           return response.json();
//       })
//       }
// }

class CategoryService {
    //benimUrl = this.urlhost.geturl();

    kategori: ICategory[] = [];
    okey = false;

    constructor() {}

    result(): ICategory[] {
        let donecek:ICategory[]=[];
        this.getKategoriler().then((kategoriler: ICategory[]) => {
            // Dönen kategorilerle işlem yapabilirsiniz
            for(let kat of kategoriler){
                let kati: ICategory = {
                    id: kat.id,
                    img: " ",
                    parent: kat.parent,
                    productType: kat.productType,
                    products: kat.products,
                    status: kat.status,
                }

                donecek.push(kati);
            }
        });
        return donecek;
    }

    async getKategoriler():Promise<ICategory[]> {
        try {
            const response = await this.sendRequest('Kategori/GetAll', 'GET');
            this.kategori = response;
            this.okey = true;
            return this.kategori;
        } catch (err) {
            console.error("Error: " + err);
            return [];
        }
        finally{
            this.okey = false;
        }
        
    }

    private async sendRequest(url: string, method: string, data?: any): Promise<any> {
        try {
            const response = await fetch(`https://bycobackend.online:5001/api/${url}`, {
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
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json();
        } catch (error) {
            throw new Error("Error in sendRequest: ");
        }
    }
}

   const categoryService = new CategoryService();

   const category_data:ICategory[] = new CategoryService().result()
  

  

// const category_data:ICategory[] = [
//   {
//     id: "1",
//     parent: "Diğer Kablolar",
//     productType: "electronics",
//     products: [],
//     status: "Show"
//   },
//   {
//     id: "2",
//     parent: "Koaksiyel Kablolar",
//     productType: "electronics",
//     products: [
//       "1",
//       "2",
//       "3",
//       "4"
//     ],
//     status: "Show"
//   },
//   {
//     id: "3",
//     parent: "Yangina Dayanikli Kablolar",
//     productType: "electronics",
//     products: [
//       "5",
//       "6",
//       "7",
//       "8"
//     ],
//     status: "Show"
//   },
//   {
//     id: "4",
//     parent: "Dahili Telefon Kablolari",
//     productType: "electronics",
//     products: [
//       "9",
//       "10",
//       "11",
//       "12"
//     ],
//     status: "Show"
//   }
// ]


export default category_data;

