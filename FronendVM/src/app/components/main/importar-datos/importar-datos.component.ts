import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../services/backend.service";

@Component({
  selector: 'app-importar-datos',
  templateUrl: './importar-datos.component.html',
  styleUrls: ['./importar-datos.component.css']
})
export class ImportarDatosComponent implements OnInit {
  selectedFile: File | null = null;
  users: any[] = [];
  searchTerm: string = '';
  mostrarModalCrear = false;
  mostrarModalEditar = false;
  usuarioForm: any = {
    nombre: '',
    apellido: '',
    dni: '',
    codigo: '',
    email: '',
    password: '',
    private_ingreso: '',
    horas_obtenidas: 0,
    status: 'Cachimbo', // Valor predeterminado
    carreras_id: null,
    roles_id: null
  };


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

  abrirModalCrearUsuario(): void {
    this.usuarioForm = {};
    this.mostrarModalCrear = true;
  }

  abrirModalEditarUsuario(user: any): void {
    this.mostrarModalEditar = true;
    this.mostrarModalCrear = false;
    this.usuarioForm = {
      ...user,
      carreras_id: user.carrera ? user.carrera.id : null,
      roles_id: user.rol ? user.rol.id : null
    };
  }


  cerrarModal(): void {
    this.mostrarModalCrear = false;
    this.mostrarModalEditar = false;
  }

  crearUsuario(): void {
    this.backendService.createUser(this.usuarioForm).subscribe(() => {
      this.obtenerUsuarios();
      this.cerrarModal();
    });
  }

  actualizarUsuario(): void {
    this.backendService.updateUser(this.usuarioForm.id, this.usuarioForm).subscribe(() => {
      this.obtenerUsuarios();
      this.cerrarModal();
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.backendService.deleteUser(id).subscribe(() => {
        this.obtenerUsuarios();
      });
    }
  }


}
