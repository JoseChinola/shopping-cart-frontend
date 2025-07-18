import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { count } from 'rxjs';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openCart = new EventEmitter<void>()
  isLoggedIn = false;
  cartCount = 0;
  userId!: number;

  fullName: string = '';
  initials: string = '';

  constructor(private cartService: CartService, private authService: AuthService) { }


  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.isLoggedIn = true;

      const parsedUser = JSON.parse(user);

      this.userId = parsedUser.id;

      this.fullName = parsedUser.name
      this.initials = parsedUser.name
        .split(' ')
        .map((n: string) => n.charAt(0).toUpperCase())
        .join('');

      this.cartService.fetchCart(this.userId);

      this.cartService.cartCount$.subscribe(count => {
        console.log('Número de artículos en el carrito:', count);
        this.cartCount = count || 0;
      })
    }

    if (!user) {
      console.warn('Usuario no logueado, no se puede cargar el carrito');
      return;
    }
  }

  onCartClick() {
    this.openCart.emit();
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.cartCount = 0;
    this.cartService.clearCart();
  }

  
}