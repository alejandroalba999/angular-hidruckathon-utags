import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RegistroModel } from '../../models/registro.model';
import { ConferenciaModel } from '../../models/conferencia.model';
import { ConferenciaService } from '../../services/conferencia.service';
import { RegistroService } from '../../services/registro.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StorageService } from '../../services/encryption/storage.service';
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
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  RegistroModel: RegistroModel = new RegistroModel();
  step1: boolean = true;
  step2: boolean = false;
  show: boolean = false;
  arrConferencias: any[];

  url = `${environment.muestraImagen}`;
  strImagen = './assets/images/default.jpg';
  arrIdConferencia: any[] = [];
  ConferenciaModel: ConferenciaModel = new ConferenciaModel();
  ConferenciaModel2: any;
  idPersona: string;
  constructor(private ConferenciaService: ConferenciaService, private RegistroService: RegistroService, private StorageService: StorageService) { }

  ngOnInit(): void {
    this.getConferencias();
  }

  stepsForm(valor: number) {
    if (valor === 1) {
      this.step1 = true;
      this.step2 = false;
    }
    if (valor === 2) {
      this.step1 = false;
      this.step2 = true;
    }
  }

  getConferencias() {
    this.ConferenciaService.getConferencias().then((data: any) => {
      this.ConferenciaModel = data.cont.conferencias;
      this.arrConferencias = data.cont.conferencias;
    })
  }

  onCategoriaPressed(categoriaSelected: any, checked: boolean) {
    if (checked) {
      this.arrIdConferencia.push(categoriaSelected);
      // console.log(this.arrIdConferencia);

    } else {
      this.arrIdConferencia.splice(this.arrIdConferencia.indexOf(categoriaSelected), 1);
      // console.log(this.arrIdConferencia);
    }
  }

  async registrar() {
    try {
      const RegistroModel = new FormData();
      RegistroModel.append('strNombre', this.RegistroModel.strNombre);
      RegistroModel.append('strPrimerApellido', this.RegistroModel.strPrimerApellido);
      RegistroModel.append('strSegundoApellido', this.RegistroModel.strSegundoApellido ? this.RegistroModel.strSegundoApellido : '');
      RegistroModel.append('strCorreo', this.RegistroModel.strCorreo);
      RegistroModel.append('nmbTelefono', this.RegistroModel.nmbTelefono);
      RegistroModel.append('strPuesto', this.RegistroModel.strPuesto);
      RegistroModel.append('strNombreEmpresa', this.RegistroModel.strNombreEmpresa);

      if (this.arrIdConferencia !== null) {
        // console.log(this.arrIdConferencia);

        for (const arrIdConferencia of this.arrIdConferencia) {
          RegistroModel.append('arrIdConferencia', arrIdConferencia._id);
        }
      }

      const resp: any = await this.RegistroService.postParticipante(RegistroModel);

      this.ConferenciaModel2 = resp.cont.participante;
      this.idPersona = this.ConferenciaModel2._id;
      this.idPersona = this.StorageService.encrypt(this.idPersona);
      console.log(this.idPersona);

      this.step1 = false;
      this.step2 = false;
      this.show = true;
      // $('#nuevoRegistro').modal('hide');
      Swal.fire(
        'Persona registrada correctamente',
        '',
        'success'
      )
    } catch (error) {
      Toast.fire({
        icon: 'warning',
        title: error.error.msg
      })
    }
  }
  downloadPDF() {

    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'networkingMFD.png';
      this.downloadLink.nativeElement.click();
    });
  }
  // Extraemos el
  // const DATA = document.getElementById('gafete');
  // const doc = new jsPDF('p', 'pt', 'a4');
  // const options = {
  //   background: 'white',
  //   scale: 3
  // };

  //   html2canvas(document.querySelector("#gafete")).then(canvas => {
  //     document.body.appendChild(canvas)
  // });
  //   html2canvas(DATA, options).then((canvas) => {

  //     const img = canvas.toDataURL('image/PNG');

  //     // Add image Canvas to PDF
  //     const bufferX = 2;
  //     const bufferY = 5;
  //     // const imgProps = (doc as any).getImageProperties(img);
  //     // console.log(imgProps);

  //     const pdfWidth = 0;

  //     const pdfHeight = 400;

  //     doc.addImage(img, 'pdf', bufferX, bufferY, pdfWidth, pdfHeight, 'FAST');
  //     return doc;
  //   }).then((docResult) => {
  //     docResult.save(`gafete.pdf`);
  //   });
  // }
}

