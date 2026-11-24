// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Control de Administrar › Edificios: valida y manda agregar, modificar o quitar
// Controlador (front) · Edificios.
import { Controlador } from "./Controlador.js";
import { EdificioDTO } from "../dto/EdificioDTO.js";
import { EdificioServicio } from "../servicios/EdificioServicio.js";
import { EdificioValidador } from "../validadores/EdificioValidador.js";

export class EdificioControlador extends Controlador {
  #servicio;

  constructor({ navegador, servicio = new EdificioServicio() } = {}) {
    super({ navegador });
    this.#servicio = servicio;
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — la misma lista para el administrador y el usuario
  listar() {
    return this.#servicio.listar();
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — agregar
  async agregar(formulario) {
    return this.#guardar(formulario, (dto) => this.#servicio.agregar(dto), (e) => `Se agregó "${e.nombre}".`);
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — modificar
  async modificar(id, formulario) {
    return this.#guardar(formulario, (dto) => this.#servicio.modificar(id, dto), () => "Cambios guardados.");
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — quitar
  async quitar(id) {
    const r = await this.#servicio.quitar(id);
    if (!r.ok) return this.muestra("MensajeError", { error: r.error });
    return this.muestra("MensajeHecho", { mensaje: `Se quitó "${r.datos.edificio.nombre}".`, quitado: r.datos.edificio });
  }

  async #guardar(formulario, llamar, mensaje) {
    const valores = this.leer(formulario);
    const validacion = this.valida(new EdificioValidador(), valores);
    if (!validacion.valido) return this.muestra("MensajeDatosNoValidos", { error: validacion.error, valores });

    const r = await llamar(new EdificioDTO(validacion.datos));
    if (!r.ok) return this.muestra("MensajeDatosNoValidos", { error: r.error, valores });
    return this.muestra("MensajeHecho", { mensaje: mensaje(r.datos.edificio), edificio: r.datos.edificio });
  }
}
