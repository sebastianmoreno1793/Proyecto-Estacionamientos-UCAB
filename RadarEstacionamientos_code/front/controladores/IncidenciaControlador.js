// @HU-9.1 Crear una incidencia · Sebastian — Control del formulario Reportar: valida, manda el reporte y decide qué mensaje mostrar
// Controlador (front) · Incidencias. En el ejemplo de la profesora es el «ManejoProducto»:
//   FormularioIncidencia → reportar() → valida (IncidenciaValidador) → IncidenciaServicio (fetch POST /api/incidencias)
//   → muestra MensajeIncidenciaCreada, MensajeDatosNoValidos o MensajeEstacionamientoCerrado.
import { Controlador } from "./Controlador.js";
import { IncidenciaDTO } from "../dto/IncidenciaDTO.js";
import { EstacionamientoServicio } from "../servicios/EstacionamientoServicio.js";
import { IncidenciaServicio } from "../servicios/IncidenciaServicio.js";
import { IncidenciaValidador } from "../validadores/IncidenciaValidador.js";

export class IncidenciaControlador extends Controlador {
  #servicio;
  #estacionamientos;
  #opciones = { estacionamientos: [], tipos: [] };

  constructor({ navegador, servicio = new IncidenciaServicio(), estacionamientoServicio = new EstacionamientoServicio() } = {}) {
    super({ navegador });
    this.#servicio = servicio;
    this.#estacionamientos = estacionamientoServicio;
  }

  // @HU-9.1 Crear una incidencia · Sebastian — CA3: solo se ofrecen los estacionamientos abiertos
  // Lo que necesita el formulario: estacionamientos abiertos y los tres tipos de problema.
  async cargar() {
    const [{ estacionamientos }, tipos] = await Promise.all([this.#estacionamientos.listar(), this.#servicio.tipos()]);
    this.#opciones = { estacionamientos: estacionamientos.filter((e) => e.activo), tipos };
    return this.#opciones;
  }

  // @HU-9.1 Crear una incidencia · Sebastian
  // formulario: FormData o { estacionamientoId, tipo }. Devuelve lo que la vista debe mostrar.
  async reportar(formulario) {
    const validacion = this.valida(
      new IncidenciaValidador({ estacionamientos: this.#opciones.estacionamientos.map((e) => e.id), tipos: this.#opciones.tipos.map((t) => t.id) }),
      this.leer(formulario),
    );
    if (!validacion.valido) return this.muestra("MensajeDatosNoValidos", { error: validacion.error, errores: validacion.errores, valores: validacion.datos });

    const r = await this.#servicio.crear(new IncidenciaDTO(validacion.datos));
    if (r.estado === 409) return this.muestra("MensajeEstacionamientoCerrado", { error: r.error, valores: validacion.datos });
    if (!r.ok) return this.muestra("MensajeDatosNoValidos", { error: r.error, valores: validacion.datos });
    return this.muestra("MensajeIncidenciaCreada", { incidencia: r.datos.incidencia });
  }
}
