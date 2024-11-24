import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BackendService} from "../../../services/backend.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-participantes',
  templateUrl: './lista-participantes.component.html',
  styleUrls: ['./lista-participantes.component.css']
})
export class ListaParticipantesComponent implements OnInit {
  eventoId: number | null = null;
  eventoNombre: string | null = null;
  participantes: any[] = [];
  editMode: boolean = false;
  usuariosNoInscritos: any[] = [];
  usuariosFiltrados: any[] = [];
  busquedaUsuario: string = '';
  mostrarModalAgregarParticipantes: boolean = false;
  eventoHorasObtenidas: number = 0;
  participantesOriginales: any[] = [];
  fileToUpload: File | null = null;
  participantesPaginados: any[] = [];
  tamanioPagina: number = 10;
  paginaActual: number = 1;
  usuariosPaginados: any[] = [];
  paginaActualUsuarios: number = 1;
  tamanioPaginaUsuarios: number = 10;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventoId) {
      this.cargarParticipantes();
      this.cargarNombreEvento();
    }
  }

  generarReporte(): void {
    if (this.eventoId) {
      this.backendService.descargarReportePorEvento(this.eventoId).subscribe(
        (response) => {
          const blob = new Blob([response], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte_evento_${this.eventoId}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error al generar el reporte:', error);
          Swal.fire('Error', 'No se pudo generar el reporte. Intente nuevamente.', 'error');
        }
      );
    } else {
      Swal.fire('Advertencia', 'No se seleccionó un evento válido.', 'warning');
    }
  }

  abrirInputArchivo(): void {
    const input = document.getElementById('inputArchivo') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  descargarFormatoExcel(): void {
    const link = document.createElement('a');
    link.href = 'assets/documentos/Lista_de_participantes.xlsx'; // Ruta al archivo Excel dentro de assets
    link.download = 'Lista_de_participantes.xlsx'; // Nombre del archivo que se descargará
    link.click();
  }

  handleFileInput(event: any): void {
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload) {
      this.subirArchivo();
    }
  }

  subirArchivo(): void {
    if (!this.fileToUpload) {
      Swal.fire('Error', 'Por favor, selecciona un archivo antes de continuar.', 'error');
      return;
    }

    if (this.eventoId === null) {
      Swal.fire('Error', 'No se seleccionó un evento válido.', 'error');
      return;
    }

    this.backendService.importarParticipantes(this.eventoId, this.fileToUpload).subscribe(
      (response: any) => {
        Swal.fire('Éxito', response, 'success');

      },
      (error) => {
        const errorMensaje = error.error?.message || 'Hubo un problema al subir el archivo.';
        Swal.fire('Error', errorMensaje, 'error');
        console.error('Error al importar participantes:', error);
      }
    );
  }

  truncarTexto(texto: string | null, limite: number): string {
    if (!texto) return "Sin descripción"; // Devuelve "Sin descripción" si el campo está vacío o es nulo
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  }

  cargarParticipantes(): void {
    this.backendService.obtenerParticipantes(this.eventoId!).subscribe(
      (data) => {
        this.participantesOriginales = [...data]; // Copia de datos originales
        this.participantes = [...data]; // Datos visibles
        this.actualizarPagina(); // Asegúrate de que los datos paginados se actualicen
        console.log('Participantes cargados:', data); // Depuración
      },
      (error) => {
        console.error('Error al cargar participantes:', error);
      }
    );
  }

  cambiarPagina(incremento: number): void {
    this.paginaActual += incremento;
    this.actualizarPagina();
  }

  actualizarTamanioPagina(event: any): void {
    this.tamanioPagina = +event.target.value; // Convertir el valor a número
    this.paginaActual = 1; // Reiniciar a la primera página
    this.actualizarPagina();
  }

  actualizarTamanioPaginaModel(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Hacer cast explícito
    this.tamanioPaginaUsuarios = +selectElement.value; // Convertir el valor a número
    this.paginaActualUsuarios = 1; // Reiniciar a la primera página
    this.actualizarPaginaUsuarios();
  }
  get totalPaginas(): number {
    return Math.ceil(this.participantes.length / this.tamanioPagina);
  }

  cargarNombreEvento(): void {
    this.backendService.obtenerEventoPorId(this.eventoId!).subscribe(
      (evento) => {
        this.eventoNombre = evento.nombre;
        this.eventoHorasObtenidas = evento.horas_obtenidas; // Almacena las horas del evento
      },
      (error) => {
        console.error("Error al obtener el nombre del evento:", error);
      }
    );
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    if (!this.editMode) {
      // Si se desactiva el modo de edición, guardar los cambios en el backend
      this.participantes.forEach(participante => {
        this.backendService.actualizarInscripcion(participante.idInscripcion, {
          horas_obtenidas: participante.horas_obtenidas,
          detalles: participante.detalles || null // Si no hay texto, envía null
        }).subscribe(
          (response) => {
            console.log('Inscripción actualizada:', response);
          },
          (error) => {
            console.error('Error al actualizar inscripción:', error);
          }
        );
      });

      Swal.fire('Éxito', 'Cambios guardados correctamente.', 'success');
    }
  }

  convertirANumero(participante: any): void {
    participante.horas_obtenidas = Number(participante.horas_obtenidas);
  }

  eliminarParticipante(participanteId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.backendService.eliminarParticipante(participanteId).subscribe(
          () => {
            Swal.fire('Eliminado', 'El participante ha sido eliminado con éxito.', 'success').then(() => {
              // Refresca la página después de la eliminación
              window.location.reload();
            });
          },
          (error) => {
            console.error('Error al eliminar participante:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar al participante.', 'error');
          }
        );
      }
    });
  }

  abrirModalAgregarParticipantes(): void {
    this.mostrarModalAgregarParticipantes = true;

    // Llamar al backend para obtener los usuarios no inscritos
    this.backendService.obtenerUsuariosNoInscritos(this.eventoId!).subscribe(
      (data) => {
        this.usuariosNoInscritos = data.map((usuario: any) => ({
          ...usuario,
          seleccionado: false // Agrega un campo temporal para manejar selección
        }));
        this.usuariosFiltrados = [...this.usuariosNoInscritos]; // Inicializa la lista filtrada
        this.actualizarPaginaUsuarios(); // Actualiza la paginación inicial
      },
      (error) => {
        console.error('Error al obtener usuarios no inscritos:', error);
      }
    );
  }

  cerrarModalAgregarParticipantes(): void {
    this.mostrarModalAgregarParticipantes = false;
  }

  filtrarUsuariosNoInscritos(): void {
    const termino = this.busquedaUsuario.trim().toLowerCase();
    if (termino) {
      this.usuariosFiltrados = this.usuariosNoInscritos.filter(usuario =>
        usuario.nombre.toLowerCase().includes(termino) ||
        usuario.apellido.toLowerCase().includes(termino) ||
        usuario.email.toLowerCase().includes(termino)
      );
    } else {
      this.usuariosFiltrados = [...this.usuariosNoInscritos];
    }
    this.actualizarPaginaUsuarios();
  }

  cambiarPaginaUsuarios(incremento: number): void {
    this.paginaActualUsuarios += incremento;
    this.actualizarPaginaUsuarios();
  }

  actualizarPaginaUsuarios(): void {
    const inicio = (this.paginaActualUsuarios - 1) * this.tamanioPaginaUsuarios;
    const fin = inicio + this.tamanioPaginaUsuarios;
    this.usuariosPaginados = this.usuariosFiltrados.slice(inicio, fin);
  }

  get totalPaginasUsuarios(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.tamanioPaginaUsuarios);
  }

  filtrarUsuarios(): void {
    const termino = this.busquedaUsuario.trim().toLowerCase(); // Convertir el término a minúsculas
    if (termino) {
      // Filtra los datos originales
      this.participantes = this.participantesOriginales.filter((participante) =>
        participante.nombre.toLowerCase().includes(termino) ||
        participante.apellido.toLowerCase().includes(termino) ||
        participante.codigo.toLowerCase().includes(termino)
      );
    } else {
      // Si no hay término de búsqueda, restaurar todos los datos originales
      this.participantes = [...this.participantesOriginales];
    }

    // Después de filtrar, actualiza los datos paginados
    this.actualizarPagina();
  }

  actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.tamanioPagina;
    const fin = inicio + this.tamanioPagina;
    this.participantesPaginados = this.participantes.slice(inicio, fin);
  }





  cargarUsuariosNoInscritos(): void {
    this.backendService.obtenerUsuariosNoInscritos(this.eventoId!).subscribe(
      (data) => {
        this.usuariosNoInscritos = data.map(usuario => ({
          ...usuario,
          seleccionado: false // Añade la propiedad para rastrear la selección
        }));
      },
      (error) => {
        console.error("Error al cargar usuarios no inscritos:", error);
      }
    );
  }


  agregarParticipantes(): void {
    const participantesSeleccionados = this.usuariosNoInscritos.filter(u => u.seleccionado);

    if (participantesSeleccionados.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin selección',
        text: 'Por favor, selecciona al menos un participante.',
      });
      return;
    }

    const inscripcionesExitosas: any[] = [];
    const inscripcionesFallidas: any[] = [];

    participantesSeleccionados.forEach((participante, index) => {
      this.backendService.crearInscripcion({
        evento: { id: this.eventoId },
        usuario: { id: participante.id },
        horas_obtenidas: this.eventoHorasObtenidas,
        anio_academico: "2024",
        detalles: null,
      }).subscribe(
        response => {
          console.log("Inscripción creada:", response);
          inscripcionesExitosas.push(participante);

          // Verifica si es el último participante
          if (index === participantesSeleccionados.length - 1) {
            this.finalizarInscripciones(inscripcionesExitosas, inscripcionesFallidas);
          }
        },
        error => {
          console.error(`Error al inscribir usuario ${participante.id}:`, error);
          inscripcionesFallidas.push(participante);

          // Verifica si es el último participante
          if (index === participantesSeleccionados.length - 1) {
            this.finalizarInscripciones(inscripcionesExitosas, inscripcionesFallidas);
          }
        }
      );
    });
  }

// Método para finalizar las inscripciones y cerrar el modal
  private finalizarInscripciones(exitosos: any[], fallidos: any[]): void {
    if (fallidos.length === 0) {
      Swal.fire({
        icon: 'success',
        title: '¡Inscripciones completadas!',
        text: `${exitosos.length} participantes inscritos correctamente.`,
      }).then(() => {
        // Recarga la página al cerrar la alerta
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Inscripciones completadas con errores',
        html: `
        <p>${exitosos.length} participantes inscritos correctamente.</p>
        <p>${fallidos.length} inscripciones fallidas:</p>
        <ul>
          ${fallidos.map(f => `<li>${f.nombre} (${f.id})</li>`).join('')}
        </ul>
      `,
      }).then(() => {
        // Recarga la página al cerrar la alerta
        window.location.reload();
      });
    }
  }

  terminarEvento(): void {
    if (!this.eventoId) {
      Swal.fire('Error', 'No se encontró el evento a finalizar.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El evento será marcado como finalizado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const eventoActualizado = { status: 'Finalizado' };

        this.backendService.updateEvento(this.eventoId as number, eventoActualizado).subscribe(
          () => {
            Swal.fire(
              'Éxito',
              'El evento ha sido finalizado correctamente.',
              'success'
            ).then(() => {
              this.router.navigate(['/gestion_eventos']);
            });
          },
          (error) => {
            Swal.fire(
              'Éxito',
              'El evento ha sido finalizado correctamente.',
              'success'
            ).then(() => {
              this.router.navigate(['/gestion_eventos']);
            });
          }
        );
      }
    });
  }



  protected readonly Math = Math;
}
