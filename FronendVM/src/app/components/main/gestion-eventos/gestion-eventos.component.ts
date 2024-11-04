import { Component } from '@angular/core';
import {BackendService} from "../../../services/backend.service";

@Component({
  selector: 'app-gestion-eventos',
  templateUrl: './gestion-eventos.component.html',
  styleUrls: ['./gestion-eventos.component.css']
})
export class GestionEventosComponent {
  eventos: any[] = [];
  eventosFiltrados: any[] = [];
  searchTerm: string = '';

  mostrarModalCrear: boolean = false;
  mostrarModalEditar: boolean = false;
  nuevoEvento: any = { status: 'Activo' };
  eventoSeleccionado: any = {};

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.obtenerEventos();
  }

  obtenerEventos(): void {
    this.backendService.getEventos().subscribe(
      (data) => {
        this.eventos = data;
        this.eventosFiltrados = data;
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
      }
    );
  }

  buscarEventos(): void {
    const term = this.searchTerm.toLowerCase();
    this.eventosFiltrados = this.eventos.filter(evento =>
      evento.nombre.toLowerCase().includes(term) ||
      evento.lugar.toLowerCase().includes(term) ||
      evento.direccion.toLowerCase().includes(term)
    );
  }

  abrirModalCrearEvento(): void {
    this.mostrarModalCrear = true;
    this.nuevoEvento = { status: 'Activo' };
  }

  cerrarModalCrearEvento(): void {
    this.mostrarModalCrear = false;
  }

  crearEvento(): void {
    this.backendService.createEvento(this.nuevoEvento).subscribe(
      (data) => {
        this.eventos.push(data);
        this.eventosFiltrados = this.eventos;
        this.cerrarModalCrearEvento();
        alert('Evento creado correctamente.');
      },
      (error) => {
        console.error('Error al crear el evento:', error);
      }
    );
  }

  abrirModalEditarEvento(evento: any): void {
    this.eventoSeleccionado = { ...evento };
    this.mostrarModalEditar = true;
  }

  cerrarModalEditarEvento(): void {
    this.mostrarModalEditar = false;
  }
  detenerPropagacion(event: MouseEvent): void {
    event.stopPropagation();
  }
  // Función para convertir la fecha al formato 'yyyy-MM-dd'
  private formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  actualizarEvento(): void {
    this.backendService.actualizarEvento(this.eventoSeleccionado.id, this.eventoSeleccionado).subscribe(
      (data) => {
        const index = this.eventos.findIndex(e => e.id === data.id);
        if (index !== -1) {
          this.eventos[index] = data;
          this.eventosFiltrados = this.eventos;
        }
        this.cerrarModalEditarEvento();
        alert('Evento actualizado correctamente.');
      },
      (error) => {
        console.error('Error al actualizar el evento:', error);
      }
    );
  }

  eliminarEvento(id: number): void {
    if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      this.backendService.deleteEvento(id).subscribe(
        () => {
          this.eventos = this.eventos.filter(evento => evento.id !== id);
          this.eventosFiltrados = this.eventos;
          alert('Evento eliminado correctamente.');
        },
        (error) => {
          console.error('Error al eliminar el evento:', error);
        }
      );
    }
  }
}
