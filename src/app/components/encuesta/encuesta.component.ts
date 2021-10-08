import { Component, ElementRef, OnInit } from '@angular/core';
import { RegistroModel } from 'src/app/models/registro.model';
import { EncuestaService } from 'src/app/services/encuesta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {
  RegistroModel: RegistroModel = new RegistroModel();
  correoValidado: Boolean = false;
  encuestas: any = [];
  constructor(private _encuestaService: EncuestaService) { }
  searchEmail() {
    (<HTMLInputElement>document.getElementById("Email-send")).setAttribute("disabled", "disabled");
    this._encuestaService.getEncuestas(this.RegistroModel).then((res: any) => {
      this.encuestas = res.cont;
      this.correoValidado = true;
    }).catch((err) => {
      setTimeout(() => {
        (<HTMLInputElement>document.getElementById("Email-send")).removeAttribute("disabled");
      }, 2000);
      console.log(err.error.msg);

      Swal.fire({
        icon: 'error',
        title: err.error.msg
      })

    })


  }
  ngOnInit(): void {

  }

}
