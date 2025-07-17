import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})

export class Cart implements OnInit {
  items: any[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;
  loading: boolean = true;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      const userId = parsedUser.id;

      this.cartService.getCartItems(userId).subscribe({
        next: (res: any) => {
          this.items = res.items;
          this.totalItems = res.totalItems;
          this.totalPrice = res.totalPrice;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching cart:', err);
          this.loading = false;
        }
      })
    }
  }
}
