import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { StorageService } from '../../services/encryption/storage.service';
import jsQR from 'jsqr';
import { ConferenciaService } from '../../services/conferencia.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import Swal from 'sweetalert2';
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});
@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})


export class AsistenciaComponent implements OnInit {
  conferencias: any = [];
  timeLeft: number = 60;
  interval;
  selectConferencia: any;
  audioBeep = new Audio('assets/sounds/beep.mp3');
  audioSuccess = new Audio('assets/sounds/success-notification.wav');
  audioError = new Audio('assets/sounds/error-sound.wav');
  @ViewChild('video', { static: true }) videoElm: ElementRef;
  @ViewChild('canvas', { static: true }) canvasElm: ElementRef;
  videoStart = false;
  medias: MediaStreamConstraints = {
    video: {
      width: { min: 500, ideal: 800, max: 1000 },
      height: { min: 500, ideal: 800, max: 1000 },
      facingMode: "enviroment"
    }
  };
  constructor(private rd: Renderer2, private _serviceDecript: StorageService, private _conferencia: ConferenciaService, private _assitencia: AsistenciaService) { }


  startVideo() {
    // this.medias.video = true;
    navigator.mediaDevices.getUserMedia(this.medias).then(
      (localStream: MediaStream) => {
        this.videoElm.nativeElement.srcObject = localStream;
        this.videoStart = true;
        this.checkImage();
      }
    ).catch(
      error => {
        console.error(error);
        this.videoStart = false;
      }
    );
  }

  stopVideo() {
    this.medias.video = false;
    this.videoElm.nativeElement.srcObject.getVideoTracks()[0].enabled = false;
    this.videoElm.nativeElement.srcObject.getVideoTracks()[0].stop();
    this.videoStart = false;
  }

  checkImage() {
    const WIDTH = this.videoElm.nativeElement.clientWidth;
    const HEIGHT = this.videoElm.nativeElement.clientHeight;
    this.canvasElm.nativeElement.width = WIDTH;
    this.canvasElm.nativeElement.height = HEIGHT;

    const ctx = this.canvasElm.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    ctx.drawImage(this.videoElm.nativeElement, 0, 0, WIDTH, HEIGHT)
    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT)
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "onlyInvert" })
    if (code) {
      this.audioBeep.play();
      const infoDecrypt = this._serviceDecript.decrypt(code.data);
      if (infoDecrypt) {
        console.log(infoDecrypt);

        this._assitencia.patchAsistencia(this.selectConferencia, infoDecrypt).then((res: any) => {
          this.audioSuccess.play();
          // Toast.fire({ icon: 'success', text: res.msg });
          Swal.fire({ text: res.msg, icon: 'success', allowOutsideClick: false }).then((res) => {
            if (res.isConfirmed) {
              this.checkImage();
            }
          }).catch(() => {
            this.checkImage();
          })
        }).catch((err) => {
          // Toast.fire({ icon: 'error', text: err.error.msg })
          Swal.fire({ text: err.error.msg, icon: 'error', allowOutsideClick: false }).then((res) => {
            if (res.isConfirmed) {
              this.checkImage();
            }
          }).catch(() => {
            this.checkImage();
          })
          this.audioError.play();
        })

      } else {
        // Toast.fire({ icon: 'error', text: 'El cupón no es valido' });
        Swal.fire({ text: 'El cupón no es valído', icon: 'error', allowOutsideClick: false }).then((res) => {
          if (res.isConfirmed) {
            this.checkImage();
          }
        }).catch(() => {
          this.checkImage();
        })

      }


    } else {
      setTimeout(() => { this.checkImage(); }, 100)
    }
  }


  ngOnInit() {
    this.startVideo();
    this.getConferencias();
    this.startTimer();

  }


  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
      if (this.timeLeft == 0) {
        this.getConferencias();
      }

    }, 1000)
  }

  getConferencias() {
    this._conferencia.getConferencias().then((res: any) => {
      this.conferencias = res.cont.conferencias;
      this.selectConferencia = res.cont.conferencias[0]._id
      console.log(this.conferencias);

    }).catch((err) => {
      console.log(err);

    })
  }

}

