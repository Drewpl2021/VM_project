import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BackendService} from "../../../services/backend.service";

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

  cargarParticipantes(): void {
    this.backendService.obtenerParticipantes(this.eventoId!).subscribe(
      (data) => {
        this.participantes = data;
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
    if (this.editMode) {
      this.guardarCambios();
    }
    this.editMode = !this.editMode;
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
    if (confirm("¿Estás seguro de que deseas eliminar este participante?")) {
      this.backendService.eliminarParticipante(participanteId).subscribe(
        () => {
          this.participantes = this.participantes.filter(part => part.id !== participanteId);
          console.log("Participante eliminado con éxito.");
        },
        (error) => {
          console.error("Error al eliminar participante:", error);
        }
      );
    }
  }
}
