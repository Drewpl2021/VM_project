import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {LoginComponent} from "./components/login/login.component";
import {DashboardComponent} from "./components/dashboard.component";
import {LayoutComponent} from "./components/layout/layout.component";
import {ProximosEventosComponent} from "./components/main/proximos-eventos/proximos-eventos.component";
import {EventosParticipadosComponent} from "./components/main/eventos-participados/eventos-participados.component";
import {GestionEventosComponent} from "./components/main/gestion-eventos/gestion-eventos.component";
import {ImportarDatosComponent} from "./components/main/importar-datos/importar-datos.component";
import {AuthGuard} from "./guards/auth.guard";
import {ListaParticipantesComponent} from "./components/main/lista-participantes/lista-participantes.component";
import {RoleGuard} from "./guards/role.guard";

const routes: Routes = [
  { path: '', component: DashboardComponent }, // Redirección inicial a login
  { path: 'login', component: LoginComponent }, // Ruta del login
  { path: 'main', component: LayoutComponent, canActivate: [AuthGuard] }, // Ruta para el login
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Rutas específicas para Estudiantes
      {
        path: 'inicio',
        component: DashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Estudiante'] }
      },
      {
        path: 'proximos_eventos',
        component: ProximosEventosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Estudiante'] }
      },

      {
        path: 'eventos_participados',
        component: EventosParticipadosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Estudiante'] }
      },

      // Rutas específicas para Coordinadores
      {
        path: 'gestion_eventos',
        component: GestionEventosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Coordinador'] }
      },
      {
        path: 'importar_datos',
        component: ImportarDatosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Coordinador'] }
      },
      {
        path: 'lista_participantes/:id',
        component: ListaParticipantesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Coordinador'] }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
