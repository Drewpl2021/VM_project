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

  constructor(private authService: AuthService, private backendService: BackendService) {}

  ngOnInit(): void {
    this.obtenerUserId();
  }

  obtenerUserId(): void {
    this.authService.getAuthenticatedUser().subscribe(
      (userData) => {
        this.userId = userData.id;
        this.obtenerEventosInscritos(); // Llamar después de obtener el ID
      },
      (error) => {
        console.error('Error al obtener el ID del usuario:', error);
      }
    );
  }

  obtenerEventosInscritos(): void {
    if (this.userId) {
      this.backendService.obtenerEventosInscritosPorUsuario(this.userId).subscribe(
        (eventos) => {
          this.eventosInscritos = eventos;
        },
        (error) => {
          console.error('Error al obtener eventos inscritos:', error);
        }
      );
    }
  }
}
