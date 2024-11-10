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

  constructor(private route: ActivatedRoute,
              private backendService: BackendService) {}

  ngOnInit(): void {
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventoId) {
      this.backendService.obtenerParticipantes(this.eventoId).subscribe((data) => {
        this.participantes = data;
      });
      this.backendService.obtenerEventoPorId(this.eventoId).subscribe((evento) => {
        this.eventoNombre = evento.nombre;
      });
    }
  }
}
