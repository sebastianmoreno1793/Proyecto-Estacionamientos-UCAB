// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Pide el catálogo y manda agregar, modificar o quitar (fetch)
// Servicio · Edificios: /api/edificios y /api/edificios/:id.
import { ClienteHttp } from "./ClienteHttp.js";

export class EdificioServicio extends ClienteHttp {
  async listar() {
    const r = await this.get("/api/edificios");
    return r.datos.edificios ?? [];
  }

  // edificio: EdificioDTO { nombre, ubicacion }
  agregar(edificio) {
    return this.post("/api/edificios", edificio);
  }

  modificar(id, edificio) {
    return this.patch(`/api/edificios/${encodeURIComponent(id)}`, edificio);
  }

  quitar(id) {
    return this.delete(`/api/edificios/${encodeURIComponent(id)}`);
  }
}
