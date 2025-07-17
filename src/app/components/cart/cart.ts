import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})

export class Cart implements OnInit, OnDestroy {
  private cartSub!: Subscription;
  items: any[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;
  loading: boolean = true;
  userId!: number;
  @Output() close = new EventEmitter<void>();

  constructor(private cartService: CartService, private router: Router, private toaster: ToastrService) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id;

      this.cartSub = this.cartService.cartCount$.subscribe(() => {
        this.loadCart();
      });
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

  removeItem(productId: number) {
    this.cartService.removeItem(productId, this.userId).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.loadCart();
        this.cartService.notifyCartUpdated();
      },
      error: (err) => {
        console.log('Error removing item from cart:', err);
        this.toaster.error('Failed to remove item from cart');
      },
    })
  }

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
  }

  loadCart() {
    this.cartService.getCartItems(this.userId).subscribe({
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
    });
  }



}
