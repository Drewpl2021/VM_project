import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../services/backend.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-gestion-eventos',
  templateUrl: './gestion-eventos.component.html',
  styleUrls: ['./gestion-eventos.component.css']
})
export class GestionEventosComponent implements OnInit{
  eventos: any[] = [];
  eventosFiltrados: any[] = [];
  searchTerm: string = '';

  mostrarModalCrear: boolean = false;
  mostrarModalEditar: boolean = false;
  nuevoEvento: any = { status: 'Activo' };
  eventoSeleccionado: any = {};

  aniosDisponibles: number[] = [];
  anioSeleccionado: string = '';

  constructor(private backendService: BackendService,) {}

  ngOnInit(): void {
    this.obtenerEventos();
  }

  obtenerEventos(): void {
    this.backendService.getEventos().subscribe(
      (data) => {
        this.eventos = data;
        this.eventosFiltrados = data;

        // Extraer los años únicos directamente desde el campo 'anio'
        this.aniosDisponibles = [
          ...new Set(this.eventos.map(evento => evento.anio))
        ].sort((a, b) => b - a); // Ordenar de mayor a menor
        console.log('Años disponibles:', this.aniosDisponibles);
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
        Swal.fire('Error', 'No se pudieron cargar los eventos.', 'error');
      }
    );
  }


  filtrarPorAnio(anio: string): void {
    if (anio) {
      this.eventosFiltrados = this.eventos.filter((evento) => evento.anio === anio);
    } else {
      this.eventosFiltrados = [...this.eventos]; // Mostrar todos los eventos si no hay filtro
    }
  }


  buscarEventos(): void {
    // Resetea el filtro de año al usar el buscador
    this.anioSeleccionado = '';

    // Lógica para filtrar eventos según el término de búsqueda
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
    // Ajustar las fechas para que el backend las reciba correctamente
    if (this.nuevoEvento.fechaInicio) {
      this.nuevoEvento.fechaInicio = this.ajustarFechaTimezone(this.nuevoEvento.fechaInicio);
    }
    if (this.nuevoEvento.fechaFin) {
      this.nuevoEvento.fechaFin = this.ajustarFechaTimezone(this.nuevoEvento.fechaFin);
    }

    this.backendService.createEvento(this.nuevoEvento).subscribe(
      (data) => {
        this.eventos.push(data);
        this.eventosFiltrados = this.eventos;
        this.cerrarModalCrearEvento();
        Swal.fire('Éxito', 'Evento creado correctamente.', 'success');
      },
      (error) => {
        console.error('Error al crear el evento:', error);
        Swal.fire('Error', 'No se pudo crear el evento.', 'error');
      }
    );
  }

// Ajustar la fecha para ignorar el timezone
  private ajustarFechaTimezone(fecha: string): string {
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split('T')[0]; // Retorna solo la parte de la fecha
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
        Swal.fire('Éxito', 'Evento actualizado correctamente.', 'success');
      },
      (error) => {
        console.error('Error al actualizar el evento:', error);
        Swal.fire('Error', 'No se pudo actualizar el evento.', 'error');
      }
    );
  }

  eliminarEvento(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.backendService.deleteEvento(id).subscribe(
          () => {
            this.eventos = this.eventos.filter(evento => evento.id !== id);
            this.eventosFiltrados = this.eventos;
            Swal.fire('Eliminado', 'Evento eliminado correctamente.', 'success');
          },
          (error) => {
            console.error('Error al eliminar el evento:', error);
            Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
          }
        );
      }
    });
  }
}
