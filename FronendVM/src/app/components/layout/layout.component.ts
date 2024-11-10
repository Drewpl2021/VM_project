import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  sidebarVisible: boolean = true;
  usuario: any = {};
  userRole: number | null = null;

  constructor(private router: Router,
              private authService: AuthService,) {}


  ngOnInit(): void {
    this.obtenerDatosUsuario(); // Asegúrate de llamar a este método aquí
  }
  // Método para alternar la visibilidad de la barra lateral
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // Método de cierre de sesión o ir a otra ruta
  goToSecondComponent() {
    if (window.confirm("Sesión cerrada correctamente")) {
      this.router.navigate(['/login']);}
  }
  logout(): void {
    this.authService.logout();
  }
  obtenerDatosUsuario(): void {
    this.authService.getAuthenticatedUser().subscribe(
      (userData) => {
        console.log('Datos del usuario autenticado:', userData); // Este log mostrará el nombre y apellido
        this.usuario = userData;
        this.userRole = userData.roles_id;
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }

}
