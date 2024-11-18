import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {BackendService} from "../../../services/backend.service";

@Component({
  selector: 'app-eventos-participados',
  templateUrl: './eventos-participados.component.html',
  styleUrls: ['./eventos-participados.component.css']
})
export class EventosParticipadosComponent implements OnInit{
  userId: number | null = null;
  eventosInscritos: any[] = [];
  inscripciones: any[] = [];
  horasTotales: number = 0;

  constructor(
    private authService: AuthService,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.obtenerUserId();
  }

  obtenerUserId(): void {
    this.authService.getAuthenticatedUser().subscribe(
      (userData) => {
        this.userId = userData.id;
        this.horasTotales = userData.horas_obtenidas; // Inicialmente usa los datos del usuario autenticado
        this.obtenerHorasTotales(); // Obtén las horas totales desde el backend
        this.obtenerEventosInscritos();
        this.obtenerInscripciones();
      },
      (error) => {
        console.error('Error al obtener el ID del usuario:', error);
      }
    );
  }

  obtenerHorasTotales(): void {
    if (this.userId) {
      this.backendService.obtenerUsuarioPorId(this.userId).subscribe(
        (usuario) => {
          this.horasTotales = usuario.horas_obtenidas; // Actualizar las horas obtenidas
        },
        (error) => {
          console.error('Error al obtener las horas totales del usuario:', error);
        }
      );
    }
  }

  obtenerEventosInscritos(): void {
    if (this.userId) {
      this.backendService.obtenerEventosInscritosPorUsuario(this.userId).subscribe(
        (eventos) => {
          this.eventosInscritos = eventos; // Asegúrate de que 'detalles' venga en los datos
          this.vincularHorasAsignadas(); // Vincular las horas después de obtener los eventos
        },
        (error) => {
          console.error('Error al obtener eventos inscritos:', error);
        }
      );
    }
  }


  obtenerInscripciones(): void {
    if (this.userId) {
      this.backendService.obtenerInscripcionesPorUsuario(this.userId).subscribe(
        (inscripciones) => {
          this.inscripciones = inscripciones;
          this.vincularHorasAsignadas(); // Vincular las horas después de obtener las inscripciones
        },
        (error) => {
          console.error('Error al obtener inscripciones:', error);
        }
      );
    }
  }

  vincularHorasAsignadas(): void {
    if (this.eventosInscritos.length > 0 && this.inscripciones.length > 0) {
      this.eventosInscritos = this.eventosInscritos.map(evento => {
        const inscripcion = this.inscripciones.find(
          insc => insc.evento.id === evento.id
        );
        evento.horas_asignadas = inscripcion ? inscripcion.horas_obtenidas : 0;
        evento.detalles = inscripcion ? inscripcion.detalles : 'Sin descripción';
        return evento;
      });
    }
  }
}
