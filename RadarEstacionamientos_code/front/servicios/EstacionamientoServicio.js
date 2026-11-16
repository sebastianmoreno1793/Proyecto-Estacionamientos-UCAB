// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Pide los estacionamientos con sus libres y su semáforo (fetch)
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Manda la capacidad y el estado nuevos (fetch PATCH)
// Servicio · Estacionamientos: GET /api/estacionamientos y PATCH /api/estacionamientos/:id.
import { ClienteHttp } from "./ClienteHttp.js";
import { EstacionamientoDTO } from "../dto/EstacionamientoDTO.js";

export class EstacionamientoServicio extends ClienteHttp {
  // Devuelve { ok, estacionamientos: EstacionamientoDTO[] , error }.
  async listar() {
    const r = await this.get("/api/estacionamientos");
    return { ...r, estacionamientos: (r.datos.estacionamientos ?? []).map(EstacionamientoDTO.desde) };
  }

  // cambios: CambioDeEstacionamientoDTO { capacidad, activo }
  cambiar(id, cambios) {
    return this.patch(`/api/estacionamientos/${encodeURIComponent(id)}`, cambios);
  }
}
