import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { productService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  itemsPerPage: number = 8;
  currentPage: number = 1;
  products: Product[] = [];
  loading: boolean = true;
  cartItems: any[] = [];
  cartMap: Map<number, number> = new Map();
  userId!: number;

  constructor(
    private productservice: productService,
    private cartService: CartService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      this.userId = parsed?.id || 0;
    } else {
      console.warn('No se encontró información del usuario en localStorage.');
    }

    // Obtener productos
    this.productservice.fetchProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.currentPage = 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });

    if (user) {
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

    }

    if (user) {
      this.loadCartItems();
    }
  }


  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.products.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  loadCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe({
      next: (response: any) => {
        this.cartItems = response.items || [];
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

      next: (res) => {
        this.toastr.success(res.message, "Cart");
        this.cartMap.set(product.id, (this.cartMap.get(product.id) || 0) + 1);
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
      productId: productId,
      delta: 1
    };

    this.cartService.updateCartItem(payload).subscribe({
      next: (res) => {
        this.toastr.success(res.message, "Cart");
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
    const payload = {
      userId: this.userId,
      productId: productId,
      delta: -1
    };

    this.cartService.updateCartItem(payload).subscribe({
      next: (res) => {
        this.toastr.success(res.message, "Cart");
        if (current - 1 <= 0) {
          this.cartMap.delete(productId);
        } else {
          this.cartMap.set(productId, current - 1);
        }
        this.updateCartCount();
      },
      error: (err) => {
        console.error('Error decreasing quantity:', err);
      }
    });
  }

  updateCartCount(): void {
    let total = 0;
    this.cartMap.forEach(qty => total += qty);
    this.cartService.setCartCount(total);
  }


  // agregar servicios para el manejo de productos en cart.service.ts
}
