import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  sidebarVisible: boolean = true;
  usuario: any = {};
  userRole: number | null = null;
  mostrarContenidoInicial = true; // Mostrar contenido inicial por defecto

  nombre: string = '';
  eventos: any[] = [];
  eventosActivos: any[] = [];
  query: string = ''; // Un único campo para búsqueda
  resultado: any = null;
  error: string = '';


  constructor(private router: Router,
              private authService: AuthService,
              private backendService: BackendService,) {}


  ngOnInit(): void {
    this.obtenerDatosUsuario(); // Asegúrate de llamar a este método aquí
    this.usuario = this.authService.getAuthenticatedUserData();

    this.backendService.getEventos().subscribe(
      (data) => {
        console.log('Eventos cargados:', data);
        this.eventos = data;

        // Filtramos los eventos que están en estado 'Activo'
        this.eventosActivos = this.eventos.filter(evento => evento.status === 'Activo');
      },
      (error) => {
        console.error('Error al cargar los eventos:', error);
      }
    );
    const usuarioAutenticado = false; // Simulación de autenticación


  }

  // Este método se activa cuando se carga un componente en el router-outlet
  onActivate() {
    this.mostrarContenidoInicial = false; // Oculta el contenido inicial
  }
  // Este método se activa cuando se carga un componente en el router-outlet
  onDesactivate() {
    this.mostrarContenidoInicial = true; // Oculta el contenido inicial
  }

  irAUpeu(): void {
    window.location.href = 'https://upeu.edu.pe/';
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













  // Este método se ejecutará cuando se envíe el formulario
  onSubmit() {
    const data = {
      nombre: this.nombre
    };

    // Llamamos al método que envía los datos al backend
    this.backendService.postData(data).subscribe(
      response => {
        console.log('Carrera guardada:', response);
        // Reiniciar el formulario si es necesario
        this.nombre = '';
      },
      error => {
        console.error('Error al guardar la carrera:', error);
      }
    );
  }



  onSearch() {
    this.resultado = null; // Limpiar el resultado previo
    this.error = '';       // Limpiar el error previo

    if (!this.query) {
      this.error = 'Por favor ingrese un DNI o un Código.';
      return;
    }

    const isNumeric = /^[0-9]+$/.test(this.query); // Verifica si contiene solo números

    if (isNumeric) {
      if (this.query.length === 8) {
        // Buscar por DNI (8 dígitos)
        this.backendService.buscarPorDni(this.query).subscribe(
          data => {
            if (data) {
              this.resultado = data;
            } else {
              this.error = 'No se encontraron resultados por DNI.';
            }
          },
          err => {
            this.error = 'No se encontraron resultados por DNI.';
          }
        );
      } else if (this.query.length === 9) {
        // Buscar por Código (9 dígitos)
        this.backendService.buscarPorCodigo(this.query).subscribe(
          data => {
            if (data) {
              this.resultado = data;
            } else {
              this.error = 'No se encontraron resultados por Código.';
            }
          },
          err => {
            this.error = 'No se encontraron resultados por Código.';
          }
        );
      } else {
        this.error = 'El número ingresado no es válido. DNI debe tener 8 dígitos y Código 9 dígitos.';
      }
    } else {
      this.error = 'Solo se permiten números para buscar por DNI o Código.';
    }
  }


}
