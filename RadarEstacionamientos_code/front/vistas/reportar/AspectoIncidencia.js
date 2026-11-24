// @HU-9.1 Crear una incidencia · Sebastian — Color e ícono de cada tipo de problema en Reportar
// Vista · Aspecto de cada tipo de incidencia (D-007: mosaicos de color con ícono).
export class AspectoIncidencia {
  static #POR_TIPO = {
    conos_atravesados: { color: "coral", icono: "conos" },
    bateria_descargada: { color: "ambar", icono: "bateria" },
    vehiculo_mal_estacionado: { color: "lavanda", icono: "carro", ancho: true },
  };

  static de(tipo) {
    return AspectoIncidencia.#POR_TIPO[tipo] ?? AspectoIncidencia.#POR_TIPO.vehiculo_mal_estacionado;
  }
}
