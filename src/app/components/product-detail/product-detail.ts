import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { productService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { CartControlsComponent } from '../../shared/cart-controls/cart-controls.component';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule, CartControlsComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  product: any;
  loading = false;
  cartMap: Map<number, number> = new Map();
  userId!: number;

  constructor(private route: ActivatedRoute, private productService: productService, private cartService: CartService) { }
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      this.userId = parsed?.id || 0;
    } else {
      console.warn('No se encontró información del usuario en localStorage.');
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;

          this.loadCartItems();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }

      })
    }

    this.cartService.cartUpdated$.subscribe(() => {
      this.onCartUpdated();
    });
  }

  loadCartItems(): void {
    if (!this.userId) return;

    this.cartService.getCartItems(this.userId).subscribe({
      next: (response: any) => {
        this.cartMap.clear();
        const items = response.items || response || [];
        for (const item of items) {
          this.cartMap.set(item.product.id, item.quantity);
        }
      },
      error: (err) => {
        console.error('Error loading cart:', err);
      }
    });
  }

  onCartUpdated(): void {
    this.loadCartItems();
  }
}
