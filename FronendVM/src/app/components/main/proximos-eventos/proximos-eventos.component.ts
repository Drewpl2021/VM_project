import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../services/backend.service";
import {AuthService} from "../../../services/auth.service";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-proximos-eventos',
  templateUrl: './proximos-eventos.component.html',
  styleUrls: ['./proximos-eventos.component.css']
})
export class ProximosEventosComponent implements OnInit {
  eventos: any[] = [];
  eventosFiltrados: any[] = [];
  usuario: any = {};
  horas_obtenidas: number = 5;
  anio_academico="2024";
  inscripciones: number[] = [];
  isLoading: boolean = true;

  public statusUsuario: string | null = null;

  constructor(private backendService: BackendService,
              public authService: AuthService,
              ) {}

  ngOnInit(): void {
    this.obtenerEventos();
    this.obtenerDatosUsuario();
    this.authService.getAuthenticatedUser().subscribe(
      (usuario) => {
        this.statusUsuario = usuario.status;
        console.log('Status del usuario:', this.statusUsuario); // Para verificar
      },
      (error) => {
        console.error('Error al obtener usuario autenticado:', error);
      }
    );
    this.cargarEventos();
  }
  cargarEventos(): void {
    this.isLoading = true; // Inicia la carga
    this.backendService.getEventos().subscribe(
      (eventos) => {
        // Filtrar eventos cuyo estado sea 'Activo'
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos.filter(evento => evento.status === 'Activo');

        // Verificar si el usuario está inscrito en cada evento
        this.eventosFiltrados.forEach(evento => {
          this.backendService.verificarInscripcion(this.usuario.id, evento.id).subscribe(
            (yaInscrito) => {
              evento.usuarioInscrito = yaInscrito; // Añadir propiedad usuarioInscrito al evento
            },
            (error) => {
              console.error(`Error al verificar inscripción para el evento ${evento.id}:`, error);
              evento.usuarioInscrito = false; // En caso de error, asumir que no está inscrito
            }
          );
        });

        this.isLoading = false; // Termina la carga
      },
      (error) => {
        console.error('Error al cargar eventos:', error);
        this.isLoading = false; // Termina la carga incluso si hay un error
      }
    );
  }

  usuarioInscrito(eventoId: number): boolean {
    return this.inscripciones.includes(eventoId);
  }
  obtenerEventos(): void {
    this.backendService.getEventos().subscribe(
      (data) => {
        this.eventos = data;
        // Filtrar solo los eventos cuyo estado sea 'Activo'
        this.eventosFiltrados = this.eventos.filter(evento => evento.status === 'Activo');

        // Verificar si el usuario está inscrito en cada evento
        this.eventosFiltrados.forEach(evento => {
          this.backendService.verificarInscripcion(this.usuario.id, evento.id).subscribe(
            (yaInscrito) => {
              evento.usuarioInscrito = yaInscrito; // Añadir propiedad usuarioInscrito al evento
            },
            (error) => {
              console.error(`Error al verificar inscripción para el evento ${evento.id}:`, error);
              evento.usuarioInscrito = false; // En caso de error, asumir que no está inscrito
            }
          );
        });
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
      }
    );
  }

  obtenerDatosUsuario(): void {
    this.authService.getAuthenticatedUser().subscribe(
      (userData) => {
        console.log('Datos del usuario autenticado:', userData); // Este log mostrará el nombre y apellido
        this.usuario = userData;
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }


  inscribirse(eventoId: number): void {
    // Obtener los datos del usuario autenticado
    const usuario = this.authService.getAuthenticatedUserData();

    if (!usuario) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo recuperar la información del usuario autenticado. Por favor, inicia sesión nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    const userId = usuario.id; // ID del usuario autenticado

    // Buscar las horas válidas del evento en el listado ya cargado
    const eventoSeleccionado = this.eventos.find((evento) => evento.id === eventoId);

    if (!eventoSeleccionado) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo encontrar el evento seleccionado. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Verificar si el usuario ya está inscrito en el evento
    this.backendService.verificarInscripcion(userId, eventoId).subscribe(
      (yaInscrito) => {
        if (yaInscrito) {
          Swal.fire({
            title: 'Atención',
            text: 'Ya estás inscrito en este evento.',
            icon: 'info',
            confirmButtonText: 'Entendido',
          });
        } else {
          // Construir la inscripción con las horas válidas del evento
          const inscripcion = {
            evento: { id: eventoId },
            usuario: { id: userId },
            horas_obtenidas: parseInt(eventoSeleccionado.horas_obtenidas, 10), // Convertir a número
            anio_academico: this.anio_academico, // Suponiendo que ya tienes este valor configurado
          };

          // Enviar la inscripción al backend
          this.backendService.inscribirUsuario(inscripcion).subscribe(
            (response) => {
              Swal.fire({
                title: '¡Éxito!',
                text: 'Te has inscrito correctamente al evento.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
              });
            },
            (error) => {
              console.error('Error en la inscripción:', error);
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al intentar inscribirte. Intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
            }
          );
        }
      },
      (error) => {
        console.error('Error verificando inscripción:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo verificar tu inscripción. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }

}
