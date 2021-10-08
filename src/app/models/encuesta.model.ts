export class EncuestaModel {
    _id: string;
    strNombre: string;
    arrIdPregunta: [PreguntaModel];
}
export class PreguntaModel {
    strPregunta: string;
    arrIdRespuesta: [RespuestaModel];
}
export class RespuestaModel {
    strRespuesta: string;
}
