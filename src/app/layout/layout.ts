import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "../components/sidebar/sidebar";
import { Header } from "../components/header/header";


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  sidebarOpen = true;
  isDesktop = window.innerWidth >= 768;


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isDesktop = (event.target as Window).innerWidth >= 768;
    if (this.isDesktop) {
      this.sidebarOpen = true; // Siempre mostrar en desktop
    }
  }


  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
