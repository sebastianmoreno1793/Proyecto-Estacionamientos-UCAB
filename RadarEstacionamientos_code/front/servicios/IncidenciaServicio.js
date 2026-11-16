// @HU-9.1 Crear una incidencia · Sebastian — Manda el reporte al back con fetch POST /api/incidencias
// Servicio · Incidencias.
import { ClienteHttp } from "./ClienteHttp.js";

export class IncidenciaServicio extends ClienteHttp {
  // incidencia: IncidenciaDTO { estacionamientoId, tipo }
  crear(incidencia) {
    return this.post("/api/incidencias", incidencia);
  }

  // Los tres tipos de problema (vienen con la lista de incidencias).
  async tipos() {
    const r = await this.get("/api/incidencias");
    return r.datos.tipos ?? [];
  }
}
