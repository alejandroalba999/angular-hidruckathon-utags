import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class RegistroService {

    url = `${environment.urlGlobal}/participante`;

    constructor(private http: HttpClient) { }

    postParticipante(participante: any) {        
        return this.http.post(this.url, participante).toPromise();
      }

    getParticipante(idParticipante: string) {
    return this.http.get(this.url, { params: { idParticipante: idParticipante } }).toPromise();
    }
}