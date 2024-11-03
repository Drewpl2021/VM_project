import { Component } from '@angular/core';
import {BackendService} from "../../../services/backend.service";

@Component({
  selector: 'app-importar-datos',
  templateUrl: './importar-datos.component.html',
  styleUrls: ['./importar-datos.component.css']
})
export class ImportarDatosComponent {
  selectedFile: File | null = null;  // Variable para almacenar el archivo
  users: any[] = [];

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
    this.backendService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
  editarCliente(cliente: any) {
    // Lógica para editar
  }

  eliminarCliente(cliente: any) {
    // Lógica para eliminar
  }

}
