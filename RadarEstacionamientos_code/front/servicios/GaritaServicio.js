// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Pide los avisos recibidos y el estado de los sensores (fetch)
// @HU-3.2 Simular sensores y placas · Aaron — Pide las placas leídas (fetch)
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Pide los avisos rechazados (fetch)
// Servicio · Actividad de la garita (solo administrador): GET /api/avisos y GET /api/garita/lecturas.
import { ClienteHttp } from "./ClienteHttp.js";

export class GaritaServicio extends ClienteHttp {
  // Devuelve { ok, error, movimientos, rechazados, sensores, lecturas }.
  async actividad() {
    const [avisos, lecturas] = await Promise.all([this.get("/api/avisos"), this.get("/api/garita/lecturas")]);
    return {
      ok: avisos.ok && lecturas.ok,
      error: avisos.error ?? lecturas.error,
      movimientos: avisos.datos.movimientos ?? [],
      rechazados: avisos.datos.rechazados ?? [],
      sensores: avisos.datos.sensores ?? { conFalla: [], sinAviso: [] },
      lecturas: lecturas.datos.lecturas ?? [],
    };
  }
}
