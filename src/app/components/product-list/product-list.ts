import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { productService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { CartControlsComponent } from "../../shared/cart-controls/cart-controls.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CartControlsComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit, OnDestroy {
  private cartUpdateSub!: Subscription;
  itemsPerPage: number = 8;
  currentPage: number = 1;
  products: Product[] = [];
  cartMap: Map<number, number> = new Map();
  loading: boolean = true;
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

    this.cartUpdateSub = this.cartService.cartUpdated$.subscribe(() => {
      this.loadCartItems();
    });

    if (user) {
      this.loadCartItems();
    }
  }

  ngOnDestroy() {
    this.cartUpdateSub?.unsubscribe();
  }

  loadCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe({
      next: (response: any) => {
        const items = response.items || response || [];
        this.cartMap.clear();

        for (const item of items) {
          this.cartMap.set(item.product.id, item.quantity);
        }
      },
      error: (err) => {
        console.error('Error loading cart:', err);
      }
    });
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.products.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

}
