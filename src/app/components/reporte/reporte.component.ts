import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import offline from 'highcharts/modules/offline-exporting';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { ReporteService } from 'src/app/services/reporte.service';
import { ExportDataService } from '../../services/exports/export-excel.service.ts.service';
import Swal from 'sweetalert2';
import { ExportPdfService } from 'src/app/services/exports/export-pdf.service.ts.service';


const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});
exporting(Highcharts);
offline(Highcharts);
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  termino: any = "";
  data: any = []
  conferencias: any = [];
  participantes: any = [];
  participantesFilter: any = [];
  p1: any;

  constructor(private _reporte: ReporteService, private FilterPipe: FilterPipe, private _exportXLSX: ExportDataService, private _exportPDF: ExportPdfService) { }

  ngOnInit(): void {
    this.getParticipantesConferencia();
    this.getParticipantes()
  }
  async getParticipantes() {
    this.participantes = [];
    this._reporte.getParticipantes().then((res: any) => {
      this.participantes = res.cont.participantes;
      this.participantesFilter = res.cont.participantes;
    }).catch((err) => {
      console.log(err);

    })
  }

  findParticipantesConferencia(idConferencia) {
    this.p1 = 1;
    if (idConferencia == '0') {
      this.getParticipantes();
    } else {
      this._reporte.getConferenciaById(idConferencia).then((res: any) => {
        const array = res.cont.conferencia;
        this.participantes
        const a = array.map(res => {
          return res.persona[0] ? res.persona[0] : {
            arrIdConferencia: [],
            blnActivo: true,
            created_at: "N/A",
            nmbTelefono: "N/A",
            strCorreo: "N/A",
            strNombre: "N/A",
            strNombreEmpresa: "N/A",
            strPrimerApellido: "",
            strPuesto: "N/A",
            strSegundoApellido: "",
            updated_at: "N/A",
            __v: 0,
            _id: ""
          };
        })
        this.participantes = a;
        this.participantesFilter = a;

      }).catch((err) => {
        console.log(err);

      })
    }

  }

  async getParticipantesConferencia() {
    this.data = [];
    this._reporte.getParticipantesConferencias().then((res: any) => {
      const info = res.cont.conferencia;
      this.conferencias = res.cont.conferencia;
      this.data = info.map(res => {
        return {
          _id: res._id,
          name: res.strNombre,
          data: [res.arrIdParticipante]
        }
      })
      this.grafica();

    }).catch((err) => {
      console.log(err);

    })
  }

  grafica() {
    Highcharts.chart('pieChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'column',
      },
      title: {
        text: `Asistencia a Conferencias`
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      xAxis: {
        categories: ['total'],
        title: {
          text: 'Conferencias'
        }
      },
      yAxis: {
        title: {
          text: 'Asistencias'
        }
      },
      series: this.data

    });
  }

  filtrar() {
    this.p1 = 1;
    this.participantes = this.FilterPipe.transform(this.participantesFilter, this.termino);
  }
  exportPDF() {
    let header = [
      {
        text: "Nombre",
        style: "tableHeader",
        bold: true,
        fillColor: "#2a3e52",
        color: "#ffffff",
        size: 13,
      },
      {
        text: "Apellidos",
        style: "tableHeader",
        bold: true,
        fillColor: "#2a3e52",
        color: "#ffffff",
        size: 13,
      },
      {
        text: "Nombre Empresa",
        style: "tableHeader",
        bold: true,
        fillColor: "#2a3e52",
        color: "#ffffff",
        size: 13,
      },
      {
        text: "Puesto",
        style: "tableHeader",
        bold: true,
        fillColor: "#2a3e52",
        color: "#ffffff",
        size: 13,
      },
      {
        text: "Correo",
        style: "tableHeader",
        bold: true,
        fillColor: "#2a3e52",
        color: "#ffffff",
        size: 13,
      }
    ];

    const arrCategoria = this.participantes.map(resp => {
      return {
        strNombre: resp.strNombre ? resp.strNombre : '',
        strApellidos: resp.strPrimerApellido ? resp.strPrimerApellido + ' ' + resp.strSegundoApellido : '',
        strNombreEmpresa: resp.strNombreEmpresa ? resp.strNombreEmpresa : '',
        strPuesto: resp.strPuesto ? resp.strPuesto : '',
        strCorreo: resp.strCorreo ? resp.strCorreo : '',
      }
    });

    this._exportPDF.generatePdf("Reporte de asistencias", header, arrCategoria, "center");

    if (this.participantes.length > 0) {
      this._exportPDF.generatePdf(
        "Reporte de aplicaciones",
        header,
        this.participantes,
        "center",
        'landscape'
      );
    }
  }


  async exportXLSX() {
    try {

      if (this.participantes.length !== 0) {
        this.participantes = this.participantes.map(resp => {

          return {
            strNombre: resp.strNombre ? resp.strNombre : '',
            strApellidos: resp.strPrimerApellido ? resp.strPrimerApellido + ' ' + resp.strSegundoApellido : '',
            strNombreEmpresa: resp.strNombreEmpresa ? resp.strNombreEmpresa : '',
            strPuesto: resp.strPuesto ? resp.strPuesto : '',
            strCorreo: resp.strCorreo ? resp.strCorreo : '',
          }
        });

        let jsonobject = JSON.stringify(this.participantes);
        jsonobject = jsonobject.replace(/strNombre/gi, 'Nombre');
        jsonobject = jsonobject.replace(/strPrimerApellido/gi, 'Apellidos');
        jsonobject = jsonobject.replace(/strNombreEmpresa/gi, 'NombreEmpresa');
        jsonobject = jsonobject.replace(/strPuesto/gi, 'Puesto');
        jsonobject = jsonobject.replace(/strCorreo/gi, 'Correo');
        this._exportXLSX.exportAsExcelFile(JSON.parse(jsonobject), 'Excel de asistencia');
      }
    } catch (error) {
      Toast.fire({
        icon: 'warning',
        title: error.error ? error.error.msg : error
      });
    }

  }

}