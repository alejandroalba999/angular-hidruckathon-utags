import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class AsistenciaService {

    url = `${environment.urlGlobal}/conferencia`;

    constructor(private http: HttpClient) { }

    patchAsistencia(idConferencia: string, arrIdParticipante: any[]) {
        return this.http.patch(this.url, { arrIdParticipante }, { params: { idConferencia } }).toPromise();
    }

}
