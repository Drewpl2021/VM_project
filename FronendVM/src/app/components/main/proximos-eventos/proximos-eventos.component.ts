import { Component } from '@angular/core';
import {BackendService} from "../../../services/backend.service";

@Component({
  selector: 'app-proximos-eventos',
  templateUrl: './proximos-eventos.component.html',
  styleUrls: ['./proximos-eventos.component.css']
})
export class ProximosEventosComponent {
  eventos: any[] = [];
  eventosFiltrados: any[] = [];

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.obtenerEventos();
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
}
