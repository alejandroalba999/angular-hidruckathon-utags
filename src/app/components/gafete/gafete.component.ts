import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroModel } from 'src/app/models/registro.model';
import { StorageService } from '../../services/encryption/storage.service';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-gafete',
  templateUrl: './gafete.component.html',
  styleUrls: ['./gafete.component.css']
})
export class GafeteComponent implements OnInit {
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  idPersona: string;
  Participante: RegistroModel = new RegistroModel();
  constructor( private activatedRoute: ActivatedRoute, private StorageService: StorageService, private RegistroService: RegistroService) { }

  ngOnInit(): void {
    this.idPersona = this.activatedRoute.snapshot.params.idPersona;
    this.getParticipante();
    this.idPersona = this.StorageService.encrypt(this.idPersona); 
    console.log('ENCRIPTADO ',this.idPersona);
    
    // this.idPersona = this.StorageService.decrypt(this.idPersona); 
    // console.log('DES-ENCRIPTADO ',this.idPersona);
    
  }

  getParticipante(){
    this.RegistroService.getParticipante(this.idPersona).then((data: any) => {      
      this.Participante = data.cont.participante[0];
    })
  }
  downloadPDF() {

    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'gafete-hidrockathon.png';
      this.downloadLink.nativeElement.click();
    });
  }

}
