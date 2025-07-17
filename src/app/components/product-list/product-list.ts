import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { productService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {

  products: Product[] = [];
  loading: boolean = true;
  cartItems: any[] = [];
  cartMap: Map<number, number> = new Map(); // productId => quantity
  userId!: number;

  constructor(
    private productservice: productService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      this.userId = parsed?.id || 0;
    } else {
      console.warn('No se encontró información del usuario en localStorage.');
      return;
    }

    // Obtener productos
    this.productservice.fetchProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });

    // Obtener productos del carrito del usuario
    this.cartService.getCartItems(this.userId).subscribe({
      next: (response: any) => {
        this.cartItems = response || [];
        this.cartMap.clear();

        for (const item of this.cartItems) {
          this.cartMap.set(item.product.id, item.quantity);
        }
      },
      error: (err) => {
        console.error('Error loading cart:', err);
      }
    });

    this.loadCartItems();
  }


  loadCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe({
      next: (response: any) => {
        this.cartItems = response || [];
        this.cartMap.clear();

        for (const item of this.cartItems) {
          this.cartMap.set(item.product.id, item.quantity);
        }

        this.updateCartCount();
      },
      error: (err) => {
        console.error('Error loading cart:', err);
      }
    });
  }

  getCartQuantity(productId: number): number {
    return this.cartMap.get(productId) || 0;
  }

  isInCart(productId: number): boolean {
    return this.cartMap.has(productId);
  }

  addToCart(product: Product): void {
    const payload = {
      userId: this.userId,
      productId: product.id,
      quantity: 1
    };

    this.cartService.addToCart(payload).subscribe({
      next: () => {
        this.cartMap.set(product.id, 1);
        this.updateCartCount();
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      }
    });
  }

  increaseQuantity(productId: number): void {
    const current = this.getCartQuantity(productId);
    const payload = {
      userId: this.userId,
      productId,
      quantity: current + 1
    };

    this.cartService.updateCartItem(payload).subscribe({
      next: () => {
        this.cartMap.set(productId, current + 1);
        this.updateCartCount();
      },
      error: (err) => {
        console.error('Error increasing quantity:', err);
      }
    });
  }

  decreaseQuantity(productId: number): void {
    const current = this.getCartQuantity(productId);

    if (current <= 1) {
      // Eliminar del carrito si llega a 0
      this.cartService.removeFromCart(this.userId, productId).subscribe({
        next: () => {
          this.cartMap.delete(productId);
          this.updateCartCount();
        },
        error: (err) => {
          console.error('Error removing item:', err);
        }
      });
    } else {
      const payload = {
        userId: this.userId,
        productId,
        quantity: current - 1
      };

      this.cartService.updateCartItem(payload).subscribe({
        next: () => {
          this.cartMap.set(productId, current - 1);
          this.updateCartCount();
        },
        error: (err) => {
          console.error('Error decreasing quantity:', err);
        }
      });
    }
  }

  updateCartCount(): void {
    let total = 0;
    this.cartMap.forEach(qty => total += qty);
    this.cartService.setCartCount(total);
  }


  // agregar servicios para el manejo de productos en cart.service.ts
}
