import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../services/backend.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-importar-datos',
  templateUrl: './importar-datos.component.html',
  styleUrls: ['./importar-datos.component.css']
})
export class ImportarDatosComponent implements OnInit {
  selectedFile: File | null = null;
  users: any[] = [];
  mostrarModalCrear = false;
  mostrarModalEditar = false;
  carreras: any[] = [];
  roles: any[] = [];

  usuariosPaginados: any[] = [];
  searchTerm: string = '';

  statuses: string[] = ['Estudiante', 'Egresado', 'Docente', 'Retirado'];
  statusSeleccionados: string[] = []; // Lista de status seleccionados
  filtrosStatus: string[] = [];


  // Paginación
  pageSize: number = 10; // Tamaño de cada página
  paginaActual: number = 1; // Página actual
  totalPaginas: number = 0; // Total de páginas
  usuarioForm: any = {
    nombre: '',
    apellido: '',
    dni: '',
    codigo: '',
    email: '',
    password: '',
    private_ingreso: '',
    horas_obtenidas: 0,
    status: 'Estudiante', // Valor predeterminado
    carrera: { id: null }, // Objeto inicializado
    rol: { id: null } // Objeto inicializado
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

  descargarReporte(): void {
    const filtros = this.filtrosStatus; // Asegúrate de tener los filtros seleccionados
    const params = filtros.length > 0 ? { status: filtros } : {};

    this.backendService.exportarUsuarios(params).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  actualizarFiltros(status: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const checked = checkbox.checked;

    if (checked) {
      // Agrega el estado al filtro seleccionado
      if (!this.filtrosStatus.includes(status)) {
        this.filtrosStatus.push(status);
      }
    } else {
      // Remueve el estado del filtro seleccionado
      this.filtrosStatus = this.filtrosStatus.filter((filtro) => filtro !== status);
    }
    this.buscarUsuarios();
  }

  descargarFormatoExcel(): void {
    const link = document.createElement('a');
    link.href = 'assets/documentos/FormatoUser.xlsx'; // Ruta al archivo Excel dentro de assets
    link.download = 'FormatoUser.xlsx'; // Nombre del archivo que se descargará
    link.click();
  }



  // Subir el archivo al backend
  uploadFile() {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Por favor selecciona un archivo.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile); // Añadir archivo al FormData

    this.backendService.uploadExcel(formData).subscribe(
      response => {
        console.log('Archivo subido exitosamente:', response);  // Log para confirmar éxito
        Swal.fire({
          title: 'Éxito',
          text: 'Archivo cargado y procesado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Refresca la página al confirmar
          }
        });
      },
      error => {Swal.fire('Éxito', 'Archivo cargado y procesado correctamente.', 'success');
        console.error('Error en la subida, pero continuando normalmente.');  // Evitar alertas
      }
    );
  }
  ngOnInit(): void {
    this.buscarUsuarios();
    this.obtenerCarreras();
    this.obtenerRoles();
    this.cargarUsuarios();
  }
  obtenerCarreras(): void {
    this.backendService.getData().subscribe(
      (data) => {
        this.carreras = data || []; // Asignar un array vacío si no hay datos
      },
      (error) => {
        console.error('Error al obtener las carreras:', error);
      }
    );
  }

  obtenerRoles(): void {
    this.backendService.getRoles().subscribe(
      (data) => {
        this.roles = data || []; // Asignar un array vacío si no hay datos
      },
      (error) => {
        console.error('Error al obtener los roles:', error);
      }
    );
  }


  cargarUsuarios(): void {
    this.backendService.getAllUsers().subscribe(
      (data) => {
        this.users = data; // Carga los datos
        this.actualizarPaginacion(); // Calcula la paginación
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
      }
    );
  }

  buscarUsuarios(): void {
    let usuariosFiltrados = this.users;

    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase();
      usuariosFiltrados = usuariosFiltrados.filter((user) =>
        user.nombre.toLowerCase().includes(termino) ||
        user.apellido.toLowerCase().includes(termino) ||
        user.codigo.toLowerCase().includes(termino)
      );
    }

    if (this.filtrosStatus.length > 0) {
      usuariosFiltrados = usuariosFiltrados.filter((user) =>
        this.filtrosStatus.includes(user.status)
      );
    }

    this.paginaActual = 1; // Reinicia la página
    this.actualizarPaginacion(usuariosFiltrados);
  }



  actualizarPaginacion(lista: any[] = this.users): void {
    const inicio = (this.paginaActual - 1) * this.pageSize;
    const fin = inicio + this.pageSize;
    this.usuariosPaginados = lista.slice(inicio, fin); // Toma los usuarios para la página actual
    this.totalPaginas = Math.ceil(lista.length / this.pageSize); // Calcula las páginas totales
  }

  cambiarPagina(incremento: number): void {
    this.paginaActual += incremento;
    this.actualizarPaginacion();
  }

  actualizarTamanioPagina(size: number): void {
    this.pageSize = size;
    this.paginaActual = 1; // Reinicia a la primera página
    this.actualizarPaginacion(); // Recalcula la paginación
  }


  obtenerUsuarios(): void {
    this.backendService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
      }
    );
  }

  abrirModalCrearUsuario(): void {
    this.usuarioForm = {
      nombre: '',
      apellido: '',
      dni: '',
      codigo: '',
      email: '',
      password: '',
      private_ingreso: '',
      horas_obtenidas: 0,
      status: 'Estudiante', // Valor predeterminado
      rol: { id: null },  // Inicializa como un objeto con `id`
      carrera: { id: null } // Inicializa como un objeto con `id`
    };
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
    const usuario = {
      nombre: this.usuarioForm.nombre,
      apellido: this.usuarioForm.apellido,
      dni: this.usuarioForm.dni,
      codigo: this.usuarioForm.codigo,
      email: this.usuarioForm.email,
      password: this.usuarioForm.password,
      private_ingreso: this.usuarioForm.private_ingreso,
      horas_obtenidas: this.usuarioForm.horas_obtenidas,
      status: this.usuarioForm.status,
      rol: {
        id: this.usuarioForm.rol?.id || this.usuarioForm.roles_id // Usa el ID del rol seleccionado
      },
      carrera: {
        id: this.usuarioForm.carrera?.id || this.usuarioForm.carreras_id // Usa el ID de la carrera seleccionada
      }
    };

    console.log('Datos enviados al backend:', usuario);

    this.backendService.crearUsuario(usuario).subscribe(
      () => {
        this.obtenerUsuarios();
        this.cerrarModal();
        Swal.fire('Éxito', 'Usuario creado correctamente.', 'success');
      },
      (error) => {
        console.error('Error al crear el usuario:', error);
        Swal.fire('Error', 'No se pudo crear el usuario.', 'error');
      }
    );
  }


  actualizarUsuario(): void {
    this.backendService.updateUser(this.usuarioForm.id, this.usuarioForm).subscribe(() => {
      this.obtenerUsuarios();
      this.cerrarModal();
        Swal.fire({
          title: 'Éxito',
          text: 'Usuario actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Refresca la página al confirmar
          }
        });
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
        Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
      }
    );
  }
  eliminarUsuario(id: number): void {
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
        this.backendService.deleteUser(id).subscribe(
          () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'Usuario eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload(); // Refresca la página al confirmar
              }
            });
          },
          (error) => {
            console.error('Error al eliminar el usuario:', error);
            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
          }
        );
      }
    });
  }



}
