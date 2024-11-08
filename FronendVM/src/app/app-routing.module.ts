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

const routes: Routes = [
  { path: '', component: DashboardComponent }, // Página de inicio
  { path: 'login', component: LoginComponent }, // Ruta del login
  { path: 'main', component: LayoutComponent, canActivate: [AuthGuard] },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'proximos_eventos', component: ProximosEventosComponent },
      { path: 'eventos_participados', component: EventosParticipadosComponent },
      { path: 'gestion_eventos', component: GestionEventosComponent },
      { path: 'importar_datos', component: ImportarDatosComponent },
      { path: 'lista_participantes', component: ListaParticipantesComponent},
      { path: '', redirectTo: 'proximos_eventos', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
