import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BackendService} from "../../../services/backend.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-participantes',
  templateUrl: './lista-participantes.component.html',
  styleUrls: ['./lista-participantes.component.css']
})
export class ListaParticipantesComponent implements OnInit {
  eventoId: number | null = null;
  eventoNombre: string | null = null;
  participantes: any[] = [];
  editMode: boolean = false;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService) {}

  ngOnInit(): void {
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventoId) {
      this.cargarParticipantes();
      this.cargarNombreEvento();
    }
  }
  truncarTexto(texto: string | null, limite: number): string {
    if (!texto) return "Sin descripción"; // Devuelve "Sin descripción" si el campo está vacío o es nulo
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  }



  cargarParticipantes(): void {
    this.backendService.obtenerParticipantes(this.eventoId!).subscribe(
      (data) => {
        this.participantes = data;
        console.log('Datos recibidos:', data);
      },
      (error) => {
        console.error("Error al obtener participantes:", error);
      }
    );
  }

  cargarNombreEvento(): void {
    this.backendService.obtenerEventoPorId(this.eventoId!).subscribe(
      (evento) => {
        this.eventoNombre = evento.nombre;
      },
      (error) => {
        console.error("Error al obtener el nombre del evento:", error);
      }
    );
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    if (!this.editMode) {
      // Si se desactiva el modo de edición, guardar los cambios en el backend
      this.participantes.forEach(participante => {
        this.backendService.actualizarInscripcion(participante.idInscripcion, {
          horas_obtenidas: participante.horas_obtenidas,
          detalles: participante.detalles || null // Si no hay texto, envía null
        }).subscribe(
          (response) => {
            console.log('Inscripción actualizada:', response);
          },
          (error) => {
            console.error('Error al actualizar inscripción:', error);
          }
        );
      });

      Swal.fire('Éxito', 'Cambios guardados correctamente.', 'success');
    }
  }



  guardarCambios(): void {
    this.participantes.forEach(participante => {
      // Asegúrate de convertir horas_obtenidas a número antes de enviarlo
      participante.horas_obtenidas = Number(participante.horas_obtenidas);

      this.backendService.actualizarInscripcion(participante.idInscripcion, {
        horas_obtenidas: participante.horas_obtenidas
      }).subscribe(
        () => {
          console.log(`Horas obtenidas actualizadas para la inscripción con ID: ${participante.idInscripcion}`);
        },
        (error) => {
          console.error("Error al actualizar las horas obtenidas:", error);
        }
      );
    });
  }

  convertirANumero(participante: any): void {
    participante.horas_obtenidas = Number(participante.horas_obtenidas);
  }



  eliminarParticipante(participanteId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.backendService.eliminarParticipante(participanteId).subscribe(
          () => {
            this.participantes = this.participantes.filter(part => part.id !== participanteId);
            Swal.fire('Eliminado', 'El participante ha sido eliminado con éxito.', 'success');
          },
          (error) => {
            console.error("Error al eliminar participante:", error);
            Swal.fire('Error', 'Hubo un problema al eliminar al participante.', 'error');
          }
        );
      }
    });
  }
}
