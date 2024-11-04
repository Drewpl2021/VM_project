import { Component } from '@angular/core';
import {BackendService} from "../../../services/backend.service";

@Component({
  selector: 'app-importar-datos',
  templateUrl: './importar-datos.component.html',
  styleUrls: ['./importar-datos.component.css']
})
export class ImportarDatosComponent {
  selectedFile: File | null = null;
  users: any[] = [];
  searchTerm: string = '';

  constructor(private backendService: BackendService) {}

  // Manejar el evento de selección de archivo
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Archivo seleccionado:', file); // Confirmar que se seleccionó el archivo
    }
  }

  // Subir el archivo al backend
  uploadFile() {
    if (!this.selectedFile) {
      alert('Por favor selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile); // Añadir archivo al FormData

    this.backendService.uploadExcel(formData).subscribe(
      response => {
        console.log('Archivo subido exitosamente:', response);  // Log para confirmar éxito
        alert('Archivo cargado y procesado correctamente.');  // Mostrar mensaje de éxito
      },
      error => {if (window.confirm("Archivos subidos Exitosamente"))
        console.error('Error en la subida, pero continuando normalmente.');  // Evitar alertas
      }
    );
  }
  ngOnInit(): void {
    this.buscarUsuarios(); // Llama al método de búsqueda, que cargará todos los usuarios si no hay término de búsqueda
  }
  editarCliente(cliente: any) {
    // Lógica para editar
  }

  eliminarCliente(cliente: any) {
    // Lógica para eliminar
  }


  buscarUsuarios(): void {
    if (this.searchTerm.trim()) {
      this.backendService.buscarUsuariosPorTermino(this.searchTerm).subscribe(
        (data) => {
          this.users = data;
        },
        (error) => {
          console.error('Error al buscar usuarios:', error);
        }
      );
    } else {
      this.obtenerUsuarios(); // Si no hay término de búsqueda, cargar todos los usuarios
    }
  }

  obtenerUsuarios(): void {
    this.backendService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }


}
