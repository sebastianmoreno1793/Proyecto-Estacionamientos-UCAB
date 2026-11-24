// Modelo · Error que lanza un modelo o un servicio cuando una REGLA DE NEGOCIO no deja hacer algo
// (por ejemplo, entrar a un estacionamiento lleno). Lleva el `motivo` para que el controlador elija
// el código HTTP. No es una validación de formato: esas están en el front (front/validadores/).

export class ErrorDeNegocio extends Error {
  #motivo;

  // mensaje: lo que se le muestra a la persona · motivo: código corto («lleno», «no_existe»…)
  constructor(mensaje, motivo = "regla") {
    super(mensaje);
    this.name = "ErrorDeNegocio";
    this.#motivo = motivo;
  }

  get motivo() {
    return this.#motivo;
  }
}
