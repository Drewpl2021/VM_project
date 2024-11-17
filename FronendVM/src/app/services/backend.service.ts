import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }


  //Carrera
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carreras`);
  }

  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/carreras`, data);
  }



  // Eventos
  createEvento(evento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/evento`, evento);
  }

  actualizarEvento(id: number, evento: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/evento/${id}`, evento);
  }

  deleteEvento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/evento/${id}`);
  }

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/evento`);
  }

  obtenerEventoPorId(eventoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/evento/${eventoId}`);
  }
  getEventoById(eventoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/eventos/${eventoId}`);
  }




  //  Usuarios
  buscarUsuariosPorNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/nombre/${nombre}`);
  }

  buscarUsuariosPorTermino(termino: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/buscar?termino=${termino}`);
  }

  buscarPorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/codigo/${codigo}`);
  }

  buscarPorDni(dni: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/dni/${dni}`);
  }

  uploadExcel(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/upload`, formData);
  }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`);
  }

  crearUsuario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, data, { responseType: 'text' });
  }


  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${id}`);
  }
  obtenerUsuarioPorId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }





  // Inscripciones
  inscribirUsuario(inscripcion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscripciones`, inscripcion);
  }

  verificarInscripcion(usuarioId: number, eventoId: number): Observable<boolean> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId.toString())
      .set('eventoId', eventoId.toString());

    return this.http.get<boolean>(`${this.apiUrl}/inscripciones/verificar`, { params });
  }

  obtenerParticipantes(eventoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inscripciones/evento/${eventoId}/participantes`);
  }

  obtenerEventosInscritosPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inscripciones/usuario/${usuarioId}/eventos`);
  }

  eliminarParticipante(participanteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/inscripciones/participante/${participanteId}`);
  }

  actualizarInscripcion(idInscripcion: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/inscripciones/${idInscripcion}`, payload);
  }

  obtenerInscripcionesPorUsuario(usuarioId: number) {
    return this.http.get<any[]>(`http://localhost:8080/inscripciones/usuario/${usuarioId}`);
  }



  //ROL
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/roles`);
  }


}
