import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {registerLocaleData} from "@angular/common";
import localeEs from '@angular/common/locales/es';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ProximosEventosComponent } from './components/main/proximos-eventos/proximos-eventos.component';
import { EventosParticipadosComponent } from './components/main/eventos-participados/eventos-participados.component';
import { GestionEventosComponent } from './components/main/gestion-eventos/gestion-eventos.component';
import { ImportarDatosComponent } from './components/main/importar-datos/importar-datos.component';
import { ListaParticipantesComponent } from './components/main/lista-participantes/lista-participantes.component';


registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LayoutComponent,
    ProximosEventosComponent,
    EventosParticipadosComponent,
    GestionEventosComponent,
    ImportarDatosComponent,
    ListaParticipantesComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
