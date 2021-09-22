import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ConferenciaService {

    url = `${environment.urlGlobal}/conferencia`;

    constructor(private http: HttpClient) { }
   
    getConferencias() {
        return this.http.get(this.url).toPromise();
      }
    getConferenciasFecha() {
        return this.http.get( `${this.url}/fecha`).toPromise();
      }
}