import { Component, OnInit } from '@angular/core';
import { ConferenciaModel } from '../../models/conferencia.model';
import { ConferenciaService } from '../../services/conferencia.service';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';


const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
@Component({
  selector: 'app-conferencia',
  templateUrl: './conferencia.component.html',
  styleUrls: ['./conferencia.component.css']
})
export class ConferenciaComponent implements OnInit {

  
  arrConferencias: any[];
  
  strImagen = './assets/images/default.jpg';
  ruta = 'imgConferencista';
  url = `${environment.muestraImagen}`;
  searchText: string;
  arrIdConferencia: any[] = [];
  arrConstConf: any[] = [];
  ConferenciaModel: ConferenciaModel = new ConferenciaModel();
  constructor(private ConferenciaService: ConferenciaService, private FilterPipe: FilterPipe) { }

  ngOnInit(): void {
    this.getConferencias();
    console.log(this.url);
    
  }

  getConferencias(){
    this.ConferenciaService.getConferenciasFecha().then((data: any) => {
    this.ConferenciaModel = data.cont.conferencias;
    this.arrConferencias = data.cont.conferencias;
    this.arrConstConf = data.cont.conferencias;
    console.log(this.arrConferencias);
    
    
    })
  }

  search(){    
   this.arrConferencias = this.FilterPipe.transform(this.arrConstConf, this.searchText);
   if(this.arrConferencias.length <= 0){
    Toast.fire({
      icon: 'info',
      title: 'No hay conferencias para mostrar'
    })

   }
  }
}
