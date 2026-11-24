// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Agrega, modifica y quita edificios; el nombre no se repite
// Servicio · Catálogo de edificios. La misma lista la ve el administrador y el usuario (chips del Inicio).
import { Edificio } from "../modelos/Edificio.js";
import { ErrorDeNegocio } from "../modelos/ErrorDeNegocio.js";
import { EdificioDTO } from "../dto/EdificioDTO.js";

export class EdificioServicio {
  #repositorio;

  constructor({ edificioRepositorio }) {
    this.#repositorio = edificioRepositorio;
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — ordenados por nombre
  async listar() {
    return (await this.#repositorio.listar())
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
      .map(EdificioDTO.desdeModelo);
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — agregar
  // datos: EdificioDTO ({ nombre, ubicacion }).
  async agregar(datos) {
    const edificios = await this.#repositorio.listar();
    this.#exigirNombreUnico(datos.nombre, edificios);
    const edificio = Edificio.crear(datos, edificios.map((e) => e.id));
    return EdificioDTO.desdeModelo(await this.#repositorio.guardar(edificio));
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — modificar
  async modificar(id, datos) {
    const edificio = await this.#exigirQueExista(id);
    this.#exigirNombreUnico(datos.nombre, await this.#repositorio.listar(), id);
    edificio.cambiar(datos);
    return EdificioDTO.desdeModelo(await this.#repositorio.guardar(edificio));
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — quitar
  async quitar(id) {
    await this.#exigirQueExista(id);
    return EdificioDTO.desdeModelo(await this.#repositorio.eliminar(id));
  }

  async buscarPorId(id) {
    return this.#repositorio.buscarPorId(id);
  }

  async #exigirQueExista(id) {
    const edificio = await this.#repositorio.buscarPorId(id);
    if (!edificio) throw new ErrorDeNegocio("Ese edificio no existe.", "no_existe");
    return edificio;
  }

  // REGLA DE NEGOCIO: dos edificios no pueden llamarse igual (sin contar mayúsculas, tildes ni espacios).
  // `idActual` es el que se está modificando, que puede conservar su propio nombre.
  #exigirNombreUnico(nombre, edificios, idActual = null) {
    if (edificios.some((e) => e.id !== idActual && e.tieneElMismoNombreQue(nombre))) {
      throw new ErrorDeNegocio("Ya hay un edificio con ese nombre.", "repetido");
    }
  }
}
