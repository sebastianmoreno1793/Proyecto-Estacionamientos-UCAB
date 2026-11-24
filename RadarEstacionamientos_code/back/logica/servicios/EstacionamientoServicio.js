// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Entrega cada estacionamiento con sus libres y su semáforo
// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Con la forma para dibujarlos
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Cambia la capacidad y abre o cierra
// Servicio · Estacionamientos.
import { ErrorDeNegocio } from "../modelos/ErrorDeNegocio.js";
import { EstacionamientoDTO } from "../dto/EstacionamientoDTO.js";

export class EstacionamientoServicio {
  #repositorio;
  #eventos;

  constructor({ estacionamientoRepositorio, eventos }) {
    this.#repositorio = estacionamientoRepositorio;
    this.#eventos = eventos;
  }

  // @HU-4.2 Consultar el semáforo de ocupación · Aaron
  // @HU-5.1 Consultar los estacionamientos en el mapa del campus · German
  async listar() {
    return (await this.#repositorio.listar()).map((e) => EstacionamientoDTO.desdeModelo(e, { conForma: true }));
  }

  // @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
  // cambios: { capacidad?, activo? }; lo que no viene se queda como está. 404 si no existe.
  async cambiar(id, { capacidad, activo }) {
    const estacionamiento = await this.#repositorio.buscarPorId(id);
    if (!estacionamiento) throw new ErrorDeNegocio("Ese estacionamiento no existe.", "no_existe");

    if (capacidad !== undefined) estacionamiento.cambiarCapacidad(capacidad);
    if (activo === true) estacionamiento.abrir();
    if (activo === false) estacionamiento.cerrar();
    await this.#repositorio.guardar(estacionamiento);

    const dto = EstacionamientoDTO.desdeModelo(estacionamiento);
    this.#eventos.emitir("ESTACIONAMIENTO", { estacionamiento: dto });
    return dto;
  }
}
