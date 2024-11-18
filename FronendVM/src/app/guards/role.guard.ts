import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const usuario = this.authService.getAuthenticatedUserData();
    const rolesPermitidos = route.data['roles'];

    if (usuario && rolesPermitidos.includes(usuario.rol)) {
      return true; // Permite el acceso
    } else {
      // Redirige a una página predeterminada si no tiene permiso
      this.router.navigate(['/']);
      return false;
    }
  }
}
