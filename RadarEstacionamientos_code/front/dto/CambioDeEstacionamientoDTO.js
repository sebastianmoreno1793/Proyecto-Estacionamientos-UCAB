// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Lo que manda el administrador: capacidad y abierto o cerrado
// DTO · Cambio de un estacionamiento: { capacidad: número, activo: true | false }.
export class CambioDeEstacionamientoDTO {
  constructor({ capacidad, activo }) {
    this.capacidad = capacidad;
    this.activo = activo;
  }
}
