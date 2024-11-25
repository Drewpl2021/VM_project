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
  error: string = '';
  bloqueado: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  userId: number | null = null;

  primerIngreso: boolean = false;
  private player: any;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router,
              private authService: AuthService,
              ) {this.userId = Number(localStorage.getItem('userId'))}


  ngOnInit(): void {
    this.obtenerDatosUsuario();
    this.usuario = this.authService.getAuthenticatedUserData();

    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? parseInt(storedUserId, 10) : null;
    this.loadYouTubeAPI();
  }

  // Carga la API de YouTube
  loadYouTubeAPI(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Define el método global requerido por la API
    (window as any).onYouTubeIframeAPIReady = () => {
      this.player = new (window as any).YT.Player('youtube-player', {
        height: '450',
        width: '800',
        videoId: 'ukliAPQYkCY', // ID del video
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
        },
        events: {
          onReady: this.onPlayerReady.bind(this),
        },
      });
    };
  }

  // Método que se ejecuta cuando el reproductor está listo
  onPlayerReady(event: any): void {
    event.target.setVolume(25); // Configura el volumen al 50%
    event.target.playVideo();   // Reproduce el video automáticamente
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  abrirModal(): void {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
      document.body.classList.add('modal-open');
    }
  }

  cerrarModal(): void {
    if (!this.bloqueado) { // Solo permite cerrar el modal si no está bloqueado
      const modal = document.getElementById('changePasswordModal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        document.body.classList.remove('modal-open');
      }
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
          text: response,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Refresca la página al confirmar
          }
        });

        // Actualizar primer ingreso a "SI" y cerrar el modal
        this.primerIngreso = false;
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (usuario) {
          usuario.primeringreso = 'SI';
          localStorage.setItem('usuario', JSON.stringify(usuario));
        }
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


  irAUpeu(): void {
    window.location.href = 'https://upeu.edu.pe/';
  }

  logout(): void {
    this.authService.logout();
  }
  obtenerDatosUsuario(): void {
    this.authService.getAuthenticatedUser().subscribe(
      (userData) => {
        console.log('Datos del usuario autenticado:', userData);
        this.usuario = userData;
        this.userRole = userData.roles_id; // Aquí se almacena el rol del usuario

        // Verificar si el campo primer_ingreso es "NO"
        if (this.usuario.primer_ingreso === 'NO') {
          this.primerIngreso = true;
          this.bloqueado = true; // Bloquear cierre del modal
          this.abrirModal(); // Abrir el modal automáticamente
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }

}
