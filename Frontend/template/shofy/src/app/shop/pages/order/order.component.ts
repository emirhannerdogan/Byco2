import { Component } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  // Geçici sipariş verisi
  orders = [
    {
      orderId: 'ORD-1001',
      totalPrice: 370.00,
      status: 'Hazırlanıyor',
      isOpen: false,
      items: [
        {
          id: 1,
          title: 'Ürün 1',
          price: 120.00,
          orderQuantity: 2
        },
        {
          id: 2,
          title: 'Ürün 2',
          price: 250.00,
          orderQuantity: 1
        }
      ]
    },
    {
      orderId: 'ORD-1002',
      totalPrice: 250.00,
      status: 'Yolda',
      isOpen: false,
      items: [
        {
          id: 3,
          title: 'Ürün 3',
          price: 250.00,
          orderQuantity: 1
        }
      ]
    },
    {
      orderId: 'ORD-1003',
      totalPrice: 226.50,
      status: 'Teslim Edildi',
      isOpen: false,
      items: [
        {
          id: 4,
          title: 'Ürün 4',
          price: 75.50,
          orderQuantity: 3
        }
      ]
    }
  ];

  toggleOrder(order: any) {
    order.isOpen = !order.isOpen;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Hazırlanıyor':
        return 'status-preparing';
      case 'Yolda':
        return 'status-on-the-way';
      case 'Teslim Edildi':
        return 'status-delivered';
      default:
        return 'status-default';
    }
  }
}
