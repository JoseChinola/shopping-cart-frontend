import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})

export class Cart implements OnInit {
  items: any[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;
  loading: boolean = true;
  @Output() close = new EventEmitter<void>();

  constructor(private cartService: CartService, private router: Router, private toaster: ToastrService) { }

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


  checkout() {
    if (this.totalItems > 0) {
      this.close.emit();
      this.router.navigate(['/checkout']);
    } else {
      this.toaster.warning('Your cart is empty');
    }
  }

  closeCart() {
    this.close.emit();
  }
}
