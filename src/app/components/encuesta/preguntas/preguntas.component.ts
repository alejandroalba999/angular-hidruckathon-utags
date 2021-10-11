import { Component, OnInit, Input } from '@angular/core';
import { EncuestaModel, PreguntaModel, RespuestaModel } from 'src/app/models/encuesta.model';
import { EncuestaService } from 'src/app/services/encuesta.service';
import Swal from 'sweetalert2';
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css']
})

export class PreguntasComponent implements OnInit {
  modeloEncuesta = new EncuestaModel();
  modelPregunta = new PreguntaModel();
  modeloRespuesta = new RespuestaModel();
  encuesta: any = [];
  idParticipante: any = "";
  arrayRespuestas = [];
  opcional: boolean = false;
  p1: any = 0;
  arrowButtom: boolean = false;
  preguntaOculta: boolean = false;
  ultimaPregunta: boolean = false;

  constructor(private _encuesta: EncuestaService) { }
  @Input() set obtenerEncuestas(value) {
    this.idParticipante = value.idParticipante;
    this.encuesta = value.encuestas;
  }
  ngOnInit(): void {
  }
  check(encuesta, pregunta, respuesta, nEncuesta, nPregunta, nRespuesta) {

    //  Esto ya funciona
    let resp = {
      idEncuesta: encuesta,
      idPregunta: pregunta,
      idRespuesta: respuesta,
      idParticipante: this.idParticipante,
      numeroEncuesta: nEncuesta,
      numeroPregunta: nPregunta,
      numeroRespuesta: nRespuesta

    }

    const preguntaEncontrada = this.arrayRespuestas.find((res) => res.numeroEncuesta == nEncuesta && res.numeroPregunta == nPregunta)
    if (preguntaEncontrada && this.arrayRespuestas.length > 0) {
      this.arrayRespuestas = this.arrayRespuestas.map((replace) => {
        if (replace.idPregunta == pregunta && replace.idEncuesta == encuesta) {
          return {
            idEncuesta: replace.idEncuesta,
            idPregunta: replace.idPregunta,
            idRespuesta: respuesta, //respuesta nueva
            idParticipante: replace.idParticipante,
            numeroEncuesta: replace.numeroEncuesta,
            numeroPregunta: replace.numeroPregunta,
            numeroRespuesta: replace.numeroRespuesta
          }
        } else {
          return replace
        }
      })
      // this.arrayRespuestas[nPregunta].idRespuesta = respuesta;
    }
    if (nPregunta == 6) {
      this.ultimaPregunta = true;
    }
    if (!preguntaEncontrada) {
      this.arrayRespuestas.push(resp);
    }
    if (nRespuesta == 1 && nEncuesta == 0 && nPregunta == 3) {
      this.opcional = true;
    }
    if (nRespuesta == 0 && nEncuesta == 0 && nPregunta == 3) {
      this.opcional = false;
    }


  }
  arrow(i) {
    if (i == 0) {
      this.arrowButtom = !this.arrowButtom;
    }
  }
  enviar() {
    this._encuesta.postEncuestaParticipante(this.arrayRespuestas).then((res) => {
      Swal.fire({
        icon: 'success',
        title: "La encuesta se registro exitosamente"
      })
      setTimeout(() => {
        window.location.reload()
      }, 2000);

    }).catch((err) => {
      Swal.fire({
        icon: 'error',
        title: "Error al registrar la encuesta"
      })
    })
  }
}
