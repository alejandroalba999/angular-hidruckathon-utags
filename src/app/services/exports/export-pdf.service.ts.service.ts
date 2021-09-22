import { Injectable } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// import * as jwt_decode from "jwt-decode";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {

  mainLogo = "";
  secondLogo = "";
  header = [
    {
      text: "Nombre",
      style: "tableHeader",
      bold: true,
      fillColor: "#2a3e52",
      color: "#ffffff",
      size: 12,
    }, {
      text: "Descripción",
      style: "tableHeader",
      alignment: "center",
      bold: true,
      fillColor: "#2a3e52",
      color: "#ffffff",
      size: 12,
    }, {
      text: "Estatus",
      alignment: "center",
      style: "tableHeader",
      bold: true,
      fillColor: "#2a3e52",
      color: "#ffffff",
      size: 12,
    }
  ];

  constructor() { }

  generatePdf(reportName: string, header: any = this.header, data: any, alignment: string = "left", orientation: string = "portrait") {
    pdfMake.tableLayouts = {};
    let fecha = new Date();

    let finalDate = fecha.toLocaleDateString("es-ES",);
    var documentDefinition = {
      pageMargins: [40, 60, 40, 40],
      pageOrientation: orientation,

      // Completa la parte superior del documento
      header: {
        // table: {
        //     widths: "*",
        //     body: [
        //         [
        //             {
        //                 image:this.secondLogo,
        //                 alignment: "left",
        //                 fit: [100, 100],
        //                 width: 100,
        //                 margin: [40, 20, 10, 15],
        //             },{
        //                 image:this.mainLogo,
        //                 alignment: "right",
        //                 fit: [100, 100],
        //                 width: 100,
        //                 margin: [0, 20, 20, 15],
        //             },
        //         ],
        //     ],
        // },
        // layout: "noBorders",
      },
      footer: function (currentPage, pageCount) {
        return {
          table: {
            widths: "*",
            body:
              [
                [
                  {
                    text: "Página " + currentPage.toString() + " de " + pageCount,
                    alignment: "center",
                    style: "normalText",
                    size: 10,
                  }, {
                    text: finalDate,
                    alignment: "right",
                    style: "normalText",
                    margin: [0, 0, 30, 30],
                    size: 10,
                  },
                ],
              ],
          },
          layout: "noBorders",
        };
      },
      info: {
        title: reportName + ".pdf",
      },
      content: [
        {
          text: reportName,
          fontSize: 12,
          bold: false,
          margin: [0, 20, 0, 20],
        }, {
          style: "",
          alignment: alignment,
          table: {
            headerRows: 1,
            body: [header].concat(data.map((el, i) => Object.values(el))),
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 === 0 ? "#CCCCCC" : null;
            }, hLineColor: function (i, node) {
              return i === 0 || i === node.table.body.length ? "null" : "#2a3e52";
            }, vLineColor: function (i, node) {
              return i === 0 || i === node.table.widths.length ? -0.01 : -0.01;
            }, vLineWidth: function (i) {
              return 0;
            },
          },
        },
      ],
    };
    pdfMake.createPdf(documentDefinition).download(reportName + ".pdf");
  }
}
