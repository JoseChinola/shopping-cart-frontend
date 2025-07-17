import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  items: any[] = [];
  totalPrice: number = 0;
  totalItems: number = 0;


  constructor(private cartservice: CartService, private router: Router, private toaster: ToastrService) { }


  ngOnInit(): void {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : null;
    if (userId) {
      this.cartservice.getCartItems(userId).subscribe({
        next: (res: any) => {
          this.cartservice.notifyCartUpdated();
          this.items = res.items;
          this.totalPrice = res.totalPrice;
          this.totalItems = res.totalItems;

        },
        error: (err) => {
          console.error('Error fetching cart items:', err);
        }
      });
    }
  }

  confirmOrder() {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : null;
    if (userId) {
      this.cartservice.checkoutCart(userId).subscribe({
        next: (res) => {
          this.toaster.success(res.message, 'Payment');

          // Limpia los datos locales del carrito
          this.items = [];
          this.totalItems = 0;
          this.totalPrice = 0;

          // Notifica a otros componentes que el carrito fue actualizado
          this.cartservice.notifyCartUpdated();
          this.cartservice.fetchCart(userId);
        },
        error: (err) => {
          this.toaster.error(err.message);
          console.log("Error confirming order:", err);
        }
      });
    }
  }
}
