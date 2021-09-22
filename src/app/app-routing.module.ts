import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { ConferenciaComponent } from './components/conferencia/conferencia.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { GafeteComponent } from './components/gafete/gafete.component';

const routes: Routes = [
  { path: 'registro', component: RegistroComponent },
  { path: 'conferencia', component: ConferenciaComponent },
  { path: 'reporte', component: ReporteComponent },
  { path: 'asistencia', component: AsistenciaComponent },
  { path: 'gafete/:idPersona', component: GafeteComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'registro' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
