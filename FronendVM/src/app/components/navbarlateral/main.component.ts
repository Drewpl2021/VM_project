import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  sidebarVisible = true;
  currentPageTitle = 'Bienvenido';
  pageContent = 'Bienvenido Cachimbo.';

  constructor(private router: Router) {
  }
  goToSecondComponent() {
    this.router.navigate(['']); // Navega al otro componente
    console.log('Sesión cerrada');
    alert('Sesión cerrada exitosamente');
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  navigateTo(page: string) {
    switch (page) {
      case 'proximos_eventos':
        this.currentPageTitle = 'Proximos eventos';
        this.pageContent = 'Bienvenido al Panel de Control.';
        break;
      case 'eventos_participados':
        this.currentPageTitle = 'Eventos Participados';
        this.pageContent = 'Aquí están nuestros servicios.';
        break;
      case 'gestion_eventos':
        this.currentPageTitle = 'Gestion Eventos';
        this.pageContent = 'Listado de nuestros clientes.';
        break;
      case 'importar_datos':
        this.currentPageTitle = 'Importar Datos';
        this.pageContent = 'Contáctanos para más información.';
        break;
      default:
        this.currentPageTitle = 'Bienvenido';
        this.pageContent = 'Bienvenido Cachimbo';
    }
  }




}
