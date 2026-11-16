// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Control del mapa y del Inicio: trae los estacionamientos y los mantiene en vivo
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Control de Administrar › Puestos: valida y guarda capacidad y estado
// Controlador (front) · Estacionamientos.
import { Controlador } from "./Controlador.js";
import { CambioDeEstacionamientoDTO } from "../dto/CambioDeEstacionamientoDTO.js";
import { EstacionamientoServicio } from "../servicios/EstacionamientoServicio.js";
import { EventosEnVivoServicio } from "../servicios/EventosEnVivoServicio.js";
import { CapacidadValidador } from "../validadores/CapacidadValidador.js";

export class EstacionamientoControlador extends Controlador {
  static CAMBIOS = ["AVISO", "ESTACIONAMIENTO", "REINICIO"];

  #servicio;
  #enVivo;

  constructor({ navegador, servicio = new EstacionamientoServicio(), enVivo = new EventosEnVivoServicio() } = {}) {
    super({ navegador });
    this.#servicio = servicio;
    this.#enVivo = enVivo;
  }

  // @HU-4.2 Consultar el semáforo de ocupación · Aaron — orden de la lista «¿Dónde hay puesto?»
  // Primero los abiertos, del que tiene más libres al que tiene menos; los cerrados al final.
  static ordenarPorLibres(estacionamientos) {
    return [...estacionamientos].sort((a, b) => Number(b.activo) - Number(a.activo) || b.libres - a.libres);
  }

  // @HU-4.2 Consultar el semáforo de ocupación · Aaron — Devuelve { ok, estacionamientos, error }.
  listar() {
    return this.#servicio.listar();
  }

  // Canal en vivo (HU 4.3): cuando entra o sale un carro, o cambia un estacionamiento, llama a alCambiar(mensaje).
  // estadoDeConexion: { alConectar, alCortarse }. Devuelve la función para dejar de escuchar.
  escucharCambios(alCambiar, estadoDeConexion = {}) {
    return this.#enVivo.escuchar(EstacionamientoControlador.CAMBIOS, alCambiar, estadoDeConexion);
  }

  // @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
  // formulario: FormData de FilaPuesto (capacidad y la casilla «activo»).
  async cambiar(id, formulario) {
    const datos = this.leer(formulario);
    const valores = { capacidad: datos.capacidad, activo: datos.activo === "on" || datos.activo === true };
    const validacion = this.valida(new CapacidadValidador(), valores);
    if (!validacion.valido) return this.muestra("MensajeDatosNoValidos", { error: validacion.error, valores });

    const r = await this.#servicio.cambiar(id, new CambioDeEstacionamientoDTO(validacion.datos));
    if (!r.ok) return this.muestra("MensajeDatosNoValidos", { error: r.error, valores });
    return this.muestra("MensajeCambiosGuardados", { mensaje: "Cambios guardados.", estacionamiento: r.datos.estacionamiento });
  }
}
