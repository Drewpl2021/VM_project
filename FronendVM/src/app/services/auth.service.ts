import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private authenticatedUserEmail: string | null = null;
  private usuario: any = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage(); // Cargar datos del usuario al iniciar el servicio
  }

  private loadUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.usuario = JSON.parse(storedUser);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(() => {
        localStorage.setItem('isAuthenticated', 'true'); // Guardar estado de autenticación
      })
    );
  }

  getAuthenticatedUserData() {
    return this.usuario;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  setAuthenticatedUserEmail(email: string): void {
    this.authenticatedUserEmail = email;
    localStorage.setItem('authenticatedUserEmail', email);
  }

  getAuthenticatedUser(): Observable<any> {
    const email = this.authenticatedUserEmail || localStorage.getItem('authenticatedUserEmail');
    return this.http.get(`${this.apiUrl}/me`, { params: { email: email as string } }).pipe(
      tap((usuario) => {
        this.usuario = usuario; // Guarda los datos del usuario autenticado
        localStorage.setItem('usuario', JSON.stringify(usuario)); // Almacenar usuario en el localStorage
      })
    );
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated'); // Elimina la autenticación
    localStorage.removeItem('authenticatedUserEmail'); // Elimina el email autenticado
    localStorage.removeItem('usuario'); // Elimina los datos del usuario
    this.router.navigate(['/login']); // Redirige a la página de login
  }

  getUserRole(): string | null {
    if (!this.usuario) {
      this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    }
    return this.usuario?.rol || null;
  }
}
