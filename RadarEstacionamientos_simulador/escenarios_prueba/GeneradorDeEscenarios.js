// GeneradorDeEscenarios · Escenarios de prueba del simulador (HU 3.3): decide QUÉ avisos enviar.
// El simulador después los manda por la API de la app base, uno por uno, como lo harían los
// sensores. Nunca se fija la ocupación "a mano": la app base la calcula con cada aviso.
import { Aleatorio } from "../mapa_3d/Aleatorio.js";

export class GeneradorDeEscenarios {
  static LETRAS = "ABCDEFGHJKLMNPRSTUVWXYZ";

  #azar;

  // azar: un Aleatorio (con semilla en las pruebas; el de Math.random en el simulador).
  constructor(azar = Aleatorio.delSistema()) {
    this.#azar = azar;
  }

  // Placa venezolana de prueba (AB123CD). No es de nadie.
  placaAleatoria() {
    const letra = () => this.#azar.elegir(GeneradorDeEscenarios.LETRAS);
    return `${letra()}${letra()}${100 + this.#azar.entero(900)}${letra()}${letra()}`;
  }

  // Hora pico: llegadas repartidas en proporción a los puestos libres de cada estacionamiento
  // activo. Nunca más llegadas que puestos libres.
  repartirLlegadas(estacionamientos, cantidad) {
    return this.#repartir(estacionamientos, cantidad, GeneradorDeEscenarios.libresDe);
  }

  // Fin de clases: salidas en proporción a los carros que hay en cada estacionamiento activo.
  repartirSalidas(estacionamientos, cantidad) {
    return this.#repartir(estacionamientos, cantidad, GeneradorDeEscenarios.ocupadosDe);
  }

  // Una incidencia al azar en un estacionamiento activo (la app base rechaza los desactivados).
  incidenciaAleatoria(estacionamientos, tipos) {
    const activos = estacionamientos.filter((e) => e.activo);
    if (activos.length === 0 || tipos.length === 0) return null;
    return { estacionamientoId: this.#azar.elegir(activos).id, tipo: this.#azar.elegir(tipos).id };
  }

  // Una ENTRADA por cada puesto libre, intercalando estacionamientos.
  static avisosParaLlenar(estacionamientos) {
    return GeneradorDeEscenarios.#intercalar(
      estacionamientos.map((e) => Array(GeneradorDeEscenarios.libresDe(e)).fill({ estacionamientoId: e.id, tipo: "ENTRADA" })),
    );
  }

  // Una SALIDA por cada carro estacionado, intercalando estacionamientos.
  static avisosParaVaciar(estacionamientos) {
    return GeneradorDeEscenarios.#intercalar(
      estacionamientos.map((e) => Array(GeneradorDeEscenarios.ocupadosDe(e)).fill({ estacionamientoId: e.id, tipo: "SALIDA" })),
    );
  }

  static libresDe(e) {
    return e.activo ? Math.max(0, e.capacidad - e.ocupados) : 0;
  }

  static ocupadosDe(e) {
    return e.activo ? Math.max(0, e.ocupados) : 0;
  }

  // Reparte `cantidad` entre los estacionamientos según el cupo de cada uno (sin pasarse del cupo).
  #repartir(estacionamientos, cantidad, cupoDe) {
    const cupos = estacionamientos.map(cupoDe);
    const ids = [];
    for (let i = 0; i < cantidad; i++) {
      const k = this.#elegirPonderado(cupos);
      if (k === -1) break;
      cupos[k]--;
      ids.push(estacionamientos[k].id);
    }
    return ids;
  }

  #elegirPonderado(pesos) {
    const total = pesos.reduce((s, p) => s + p, 0);
    if (total <= 0) return -1;
    let r = this.#azar.siguiente() * total;
    for (let i = 0; i < pesos.length; i++) {
      r -= pesos[i];
      if (r < 0) return i;
    }
    return pesos.length - 1;
  }

  // Uno de cada estacionamiento por turno: así el semáforo de todos cambia a la vez y no uno tras otro.
  static #intercalar(listas) {
    const salida = [];
    for (let i = 0; listas.some((l) => i < l.length); i++) {
      for (const l of listas) if (i < l.length) salida.push(l[i]);
    }
    return salida;
  }
}
