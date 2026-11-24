// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Pide la sugerencia para un edificio (fetch GET /api/sugerencia)
// Servicio · Sugerencia.
import { ClienteHttp } from "./ClienteHttp.js";

export class SugerenciaServicio extends ClienteHttp {
  // Devuelve { ok, datos: { edificio, sugerido, alternativas }, error }.
  sugerir(edificioId) {
    return this.get(`/api/sugerencia?edificio=${encodeURIComponent(edificioId)}`);
  }
}
