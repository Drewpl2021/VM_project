import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  sidebarVisible: boolean = true;

  constructor(private router: Router) {}

  // Método para alternar la visibilidad de la barra lateral
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // Método de cierre de sesión o ir a otra ruta
  goToSecondComponent() {
    if (window.confirm("Sesión cerrada correctamente")) {
      this.router.navigate(['/login']);}
  }
}
