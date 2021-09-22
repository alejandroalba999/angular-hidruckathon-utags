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
  strMensajeError: any = { msg: '', err: false };
  infoCupon = '';
  cargando: boolean = false;
  scanActive = false;
  canvasElement: any;
  canvasContext: any;
  scanResult = null;
  videoElement: any;
  imageElement: any;
  cameraActive: boolean = false;
  scanResultAnterior: any;
  globalStream = null;
  record: boolean = true;
  succesRegister: boolean = false;
  navigation: any;
  conferencias: any = [];
  timeLeft: number = 60;
  interval;
  selectConferencia: any;
  arrayDecrypt = [];
  audioBeep = new Audio('assets/sounds/beep.mp3');
  audioSuccess = new Audio('assets/sounds/success-notification.wav');
  audioError = new Audio('assets/sounds/error-sound.wav');
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  constructor(private rd: Renderer2, private _serviceDecript: StorageService, private _conferencia: ConferenciaService, private _assitencia: AsistenciaService) {

  }

  ngAfterViewInit(): void {
    this.videoElement = this.video.nativeElement.children[0];
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  ngOnInit() {
    // Declare global variables.
    this.navigation = navigator.platform;
    this.iniciarEscaner();
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


  async iniciarEscaner() {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'back',
      parent: 'cameraPreview',
      className: 'cameraPreview'
    };

    this.start(cameraPreviewOptions);
    this.cameraActive = true;
    // this.cargando = await this.loadingController.create({});
    // await this.cargando.present();

    setTimeout(() => {

      requestAnimationFrame(this.escaneo.bind(this));
      this.rd.addClass(this.videoElement, 'videoElement');
    }, 0);
  }


  async escaneo() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.cargando) {
        // await this.cargando.dismiss();
        this.cargando = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth

      this.canvasContext.
        drawImage(this.videoElement, 0, 0,
          this.canvasElement.width,
          this.canvasElement.height
        );

      const imageData = this.canvasContext.
        getImageData(0, 0,
          this.canvasElement.width,
          this.canvasElement.height
        );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      if (code) {
        this.scanResult = code.data;
        if (this.scanResult === '') {
          // this.scanResultAnterior = this.scanResult;
          requestAnimationFrame(this.escaneo.bind(this));
        } else {
          if (this.scanResultAnterior != this.scanResult) {
            const infoDecrypt = this._serviceDecript.decrypt(this.scanResult);
            this.audioBeep.play();
            if (infoDecrypt) {
              this.arrayDecrypt.push(infoDecrypt)
              if (this.arrayDecrypt.length <= 1) {
                this._assitencia.patchAsistencia(this.selectConferencia, infoDecrypt).then((res: any) => {
                  this.audioSuccess.play();
                  Toast.fire({ icon: 'success', text: res.msg })
                  this.arrayDecrypt = [];
                  this.scanResultAnterior = this.scanResult;
                }).catch((err) => {
                  Toast.fire({ icon: 'error', text: err.error.msg })
                  this.audioError.play();
                  this.arrayDecrypt = [];
                  this.scanResultAnterior = this.scanResult;
                })
              }
            } else {
              this.audioError.play();
              Toast.fire({ icon: 'error', text: 'El codigo no pertenece a un cupón' })
              console.log('El codigo no pertenece a un cupon');
              this.scanResultAnterior = this.scanResult;
              requestAnimationFrame(this.escaneo.bind(this));
            }
            // }
          } else {
            this.scanResultAnterior = this.scanResult;
            requestAnimationFrame(this.escaneo.bind(this));
          }
        }

      } else {
        if (this.scanActive) {
          this.scanResultAnterior = this.scanResult;
          requestAnimationFrame(this.escaneo.bind(this));
        }
      }
      requestAnimationFrame(this.escaneo.bind(this));

    } else {
      this.scanResultAnterior = this.scanResult;
      requestAnimationFrame(this.escaneo.bind(this));
    }
  }

  start(options) {
    return new Promise((resolve, reject) => {
      const video: any = document.getElementById("video");


      const parent = document.getElementById(options.parent);
      if (!video) {
        const videoElement = document.createElement("video");
        videoElement.id = "video";
        videoElement.setAttribute("class", options.className || "");
        // videoElement.setAttribute("style", "-webkit-transform: scaleX(-1); transform: scaleX(-1);");
        parent.appendChild(videoElement);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Not adding `{ audio: true }` since we only want video now
          navigator.mediaDevices.getUserMedia({
            video: {
              width: { min: 500, ideal: 800, max: 1000 },
              height: { min: 500, ideal: 800, max: 1000 },
              facingMode: 'environment'
            }
          }).then((stream) => {
            //video.src = window.URL.createObjectURL(stream);
            videoElement.srcObject = stream;
            videoElement.play();
            this.cameraActive = true;
            resolve({});
          }, (err) => {
            reject(err);
          });
        }
      } else {
        // reject("camera already started");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Not adding `{ audio: true }` since we only want video now
          navigator.mediaDevices.getUserMedia({
            video: {
              width: { min: 500, ideal: 800, max: 1000 },
              height: { min: 500, ideal: 800, max: 1000 },
              facingMode: 'environment'
            }
          }).then((stream) => {
            //video.src = window.URL.createObjectURL(stream);
            this.cameraActive = true;
            video.srcObject = stream;
            video.play();
            resolve({});
          }, (err) => {
            this.cameraActive = false;
            reject(err);
          });
        }
      }
    });

  }

  stop() {
    const video: any = document.getElementById("video");
    video.pause();
    const st = video.srcObject;
    const tracks = st.getTracks();
    this.cameraActive = false;
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }
    video.srcObject = null;
  }

  ngOnDestroy(): void {
    this.stop();
  }

  reset() {
    this.scanResult = null;
  }

  detener() {
    this.videoElement.pause();
    this.scanActive = false;
  }


  reproducir() {
    this.videoElement.play();
    this.scanActive = true;
  }


}

interface CameraPreviewOptions {
  position: string,
  parent: string,
  className: string
}

