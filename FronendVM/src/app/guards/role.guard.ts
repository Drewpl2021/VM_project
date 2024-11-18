import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.authService.getUserRole(); // Recuperar el rol correctamente
    const rolesPermitidos = route.data['roles'];

    if (userRole && rolesPermitidos.includes(userRole)) {
      return true; // Permitir acceso si el usuario tiene un rol permitido
    } else {
      this.router.navigate(['/']); // Redirigir si no tiene permiso
      return false;
    }
  }
}
