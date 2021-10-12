import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ReporteService {

    url = `${environment.urlGlobal}/reporte`;

    constructor(private http: HttpClient) { }

    getParticipantesConferencias() {
        return this.http.get(this.url).toPromise();
    }

    getParticipantes() {
        return this.http.get(`${this.url}/participantes`).toPromise();
    }

    getConferenciaById(idConferencia) {
        return this.http.get(`${this.url}/conferencias`, { params: { idConferencia } }).toPromise();
    }

    getEncuestas() {
        return this.http.get(`${this.url}/reporteEncuesta`).toPromise();
    }


}