import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // Método para obtener datos
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carreras`);
  }

  // Método para enviar datos
  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/carreras`, data);
  }

  // Método para obtener datos
  buscarPorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/codigo/${codigo}`);
  }

  // Método para obtener datos
  buscarPorDni(dni: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/dni/${dni}`);
  }

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/evento`);
  }

  uploadExcel(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/upload`, formData);
  }
}
