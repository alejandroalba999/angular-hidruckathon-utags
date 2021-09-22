import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ConferenciaComponent } from './components/conferencia/conferencia.component';
import { RouterModule } from '@angular/router';
import { ReporteComponent } from './components/reporte/reporte.component';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { GafeteComponent } from './components/gafete/gafete.component';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FilterPipe } from './pipes/filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    ConferenciaComponent,
    ReporteComponent,
    AsistenciaComponent,
    GafeteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    RouterModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgxPaginationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    FilterPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
