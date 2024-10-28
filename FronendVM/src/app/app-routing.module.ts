import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {LoginComponent} from "./components/login/login.component";
import {DashboardComponent} from "./components/dashboard.component";
import {MainComponent} from "./components/navbarlateral/main.component";

const routes: Routes = [
  { path: '', component: DashboardComponent }, // Página de inicio
  { path: 'login', component: LoginComponent }, // Ruta del login
  { path: 'main', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
