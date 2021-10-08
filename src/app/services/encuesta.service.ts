import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class EncuestaService {

    url = `${environment.urlGlobal}/encuesta`;
    urlEncuestaParticipante = `${environment.urlGlobal}/encuestaParticipante`

    constructor(private http: HttpClient) { }

    getEncuestas(strCorreo) {
        return this.http.post(`${this.url}/obtenerEncuestas`, strCorreo).toPromise();
    }
    postEncuestaParticipante(modelEncuestaParticipante) {
        return this.http.post(`${this.urlEncuestaParticipante}`, modelEncuestaParticipante).toPromise();
    }

}