import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {BackendService} from "../../services/backend.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  sidebarVisible: boolean = true;
  usuario: any = {};
  userRole: number | null = null;
  mostrarContenidoInicial = true;
  nombre: string = '';
  eventos: any[] = [];
  eventosActivos: any[] = [];
  query: string = '';
  resultado: any = null;
  error: string = '';

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  userId: number | null = null;



  constructor(private router: Router,
              private authService: AuthService,
              private backendService: BackendService,
              ) {this.userId = Number(localStorage.getItem('userId'))}


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

    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? parseInt(storedUserId, 10) : null;

  }

  abrirModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
    }
  }

  cerrarModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }
  }

  onChangePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'La nueva contraseña y la confirmación no coinciden.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe(
      (response) => {
        Swal.fire({
          title: '¡Éxito!',
          text: response, // Mostrar respuesta del backend
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al cambiar la contraseña:', error);
        Swal.fire({
          title: 'Error',
          text: error.error || 'Ocurrió un error al intentar cambiar la contraseña.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    );
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
