import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log(response); // Verifica la respuesta en la consola
        this.router.navigate(['/main']);
      },
      (error) => {
        this.errorMessage = 'Credenciales incorrectas';
        console.error('Error de autenticación:', error);
      }
    );
  }
}
