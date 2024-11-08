import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../services/backend.service";
import {AuthService} from "../../../services/auth.service";

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
  anio_academico: string = "2024";

  constructor(private backendService: BackendService,
              private authService: AuthService,
              ) {}

  ngOnInit(): void {
    this.obtenerEventos();
    this.obtenerDatosUsuario();
  }

  obtenerEventos(): void {
    this.backendService.getEventos().subscribe(
      (data) => {
        this.eventos = data;
        // Filtrar solo los eventos cuyo estado sea 'Activo'
        this.eventosFiltrados = this.eventos.filter(evento => evento.status === 'Activo');
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
  inscribirse(eventoId: number, userId: number): void {
    // Verificar si el usuario ya está inscrito en el evento
    this.backendService.verificarInscripcion(this.usuario.id, eventoId).subscribe((yaInscrito) => {
      if (yaInscrito) {
        // Si ya está inscrito, mostrar una alerta simple
        alert('Ya estás inscrito en este evento');
      } else {
        // Si no está inscrito, procede a inscribirlo
        const inscripcion = {
          evento: { id: eventoId },
          usuario: { id: this.usuario.id },
          horas_obtenidas: 5,
          anio_academico: "2024"
        };

        this.backendService.inscribirUsuario(inscripcion).subscribe(
          response => {
            console.log("Inscripción guardada con éxito", response);
            alert('Inscripción exitosa');
          },
          error => {
            console.error("Error en la inscripción:", error);
            alert('Error al intentar inscribirse');
          }
        );
      }
    });
  }

}
