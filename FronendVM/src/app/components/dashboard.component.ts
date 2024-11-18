import { Component } from '@angular/core';
import {BackendService} from "../services/backend.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  nombre: string = '';
  eventos: any[] = [];
  eventosActivos: any[] = [];
  query: string = ''; // Un único campo para búsqueda
  resultado: any = null;
  error: string = '';

  constructor(private backendService: BackendService,
              private router: Router) { }

  goToSecondComponent() {
    this.router.navigate(['/login']); // Navega al otro componente
  }
  // Este método se ejecutará cuando se envíe el formulario
  onSubmit() {
    const data = {
      nombre: this.nombre
    };

    // Llamamos al método que envía los datos al backend
    this.backendService.postData(data).subscribe(
      response => {
        console.log('Carrera guardada:', response);
        // Reiniciar el formulario si es necesario
        this.nombre = '';
      },
      error => {
        console.error('Error al guardar la carrera:', error);
      }
    );
  }

  ngOnInit(): void {
    this.backendService.getEventos().subscribe(
      (data) => {
        console.log('Eventos cargados:', data);
        this.eventos = data;

        // Filtramos los eventos que están en estado 'Activo'
        this.eventosActivos = this.eventos.filter(evento => evento.status === 'Activo');
      },
      (error) => {
        console.error('Error al cargar los eventos:', error);
      }
    );
    const usuarioAutenticado = false; // Simulación de autenticación



  }


  onSearch() {
    this.resultado = null; // Limpiar el resultado previo
    this.error = '';       // Limpiar el error previo

    if (!this.query) {
      this.error = 'Por favor ingrese un DNI o un Código.';
      return;
    }

    const isNumeric = /^[0-9]+$/.test(this.query); // Verifica si contiene solo números

    if (isNumeric) {
      if (this.query.length === 8) {
        // Buscar por DNI (8 dígitos)
        this.backendService.buscarPorDni(this.query).subscribe(
          data => {
            if (data) {
              this.resultado = data;
            } else {
              this.error = 'No se encontraron resultados por DNI.';
            }
          },
          err => {
            this.error = 'No se encontraron resultados por DNI.';
          }
        );
      } else if (this.query.length === 9) {
        // Buscar por Código (9 dígitos)
        this.backendService.buscarPorCodigo(this.query).subscribe(
          data => {
            if (data) {
              this.resultado = data;
            } else {
              this.error = 'No se encontraron resultados por Código.';
            }
          },
          err => {
            this.error = 'No se encontraron resultados por Código.';
          }
        );
      } else {
        this.error = 'El número ingresado no es válido. DNI debe tener 8 dígitos y Código 9 dígitos.';
      }
    } else {
      this.error = 'Solo se permiten números para buscar por DNI o Código.';
    }
  }


}
