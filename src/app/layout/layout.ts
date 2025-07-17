import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "../components/sidebar/sidebar";
import { Header } from "../components/header/header";
import { Cart } from "../components/cart/cart";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, Header, Cart, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  sidebarOpen = true;
  isDesktop = window.innerWidth >= 768;
  cartOpen = false;


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isDesktop = (event.target as Window).innerWidth >= 768;
    if (this.isDesktop) {
      this.sidebarOpen = true; // Siempre mostrar en desktop
      this.cartOpen = false;
    }
  }


  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }

  closeCart() {
    this.cartOpen = false;
  }

}
