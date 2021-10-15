import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import offline from 'highcharts/modules/offline-exporting';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { ReporteService } from 'src/app/services/reporte.service';
import { ExportDataService } from '../../services/exports/export-excel.service.ts.service';
import Swal from 'sweetalert2';
import { ExportPdfService } from 'src/app/services/exports/export-pdf.service.ts.service';
import { saveAs } from 'file-saver';

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
  encuestas: any = [];
  arrPregunta = [];

  constructor(private _reporte: ReporteService, private FilterPipe: FilterPipe, private _exportXLSX: ExportDataService, private _exportPDF: ExportPdfService) { }

  ngOnInit(): void {
    this.getParticipantesConferencia();
    this.getParticipantes()
  }
  async getParticipantes() {
    this.participantes = [];
    this._reporte.getParticipantes().then((res: any) => {
      this.participantes = res.cont.participantes;
      console.log(this.participantes);
      this.participantesFilter = res.cont.participantes;
    }).catch((err) => {
      console.log(err);

    })
  }

  downloadFile(data: any) {
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'reporteEncuesta-NetworkingMDF.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
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

  async getEncuesta() {

    this._reporte.getEncuestas().then((res: any) => {
      this.encuestas = res.cont.encuesta;
      console.log(this.encuestas);
      this.encuestas = this.encuestas.map((data) => {
        let arrEncuesta = data.persona[0].encuesta;

        return {
          persona: `${data.persona[0].strNombre} ${data.persona[0].strPrimerApellido} ${data.persona[0].strSegundoApellido ? data.persona[0].strSegundoApellido : ''}`,
          correo: data.persona[0].strCorreo,
          respuestas: arrEncuesta,
        }
      })
      this.downloadFile(this.encuestas)

    }).catch((err) => {
      console.log(err);

    })
  }


  async exportXLSX() {
    try {

      if (this.participantes.length !== 0) {

        const exportExcel = this.participantes.map(resp => {
          // console.log(resp);

          let objeto = {};
          for (const [index, conf] of resp.conferencias.entries()) {
            objeto = { ...objeto, ...JSON.parse(`{"Conferencia ${index + 1}":"${conf.strNombre}"}`) }
          }
          return {
            strNombre: resp.strNombre ? resp.strNombre : '',
            strApellidos: resp.strPrimerApellido ? resp.strPrimerApellido + ' ' + resp.strSegundoApellido : '',
            strNombreEmpresa: resp.strNombreEmpresa ? resp.strNombreEmpresa : '',
            strPuesto: resp.strPuesto ? resp.strPuesto : '',
            strCorreo: resp.strCorreo ? resp.strCorreo : '',
            ...objeto
          }

        });
        this._exportXLSX.exportAsExcelFile(exportExcel, 'Excel de asistencia');
      }
    } catch (error) {
      Toast.fire({
        icon: 'warning',
        title: error.error ? error.error.msg : error
      });
    }

  }

}