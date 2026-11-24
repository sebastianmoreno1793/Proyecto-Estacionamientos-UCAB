// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Revisa que la capacidad sea un entero entre 1 y 2000 y que «activo» sea sí o no
// Validador · Capacidad y estado de un estacionamiento.
import { Validador } from "./Validador.js";

export class CapacidadValidador extends Validador {
  static CAPACIDAD_MAXIMA = 2000;

  revisar({ capacidad, activo }, anotar) {
    const texto = this.texto(capacidad);
    let numero = null;
    if (!/^\d+$/.test(texto)) anotar("capacidad", "La capacidad debe ser un número entero de puestos.");
    else {
      numero = Number(texto);
      if (numero < 1) anotar("capacidad", "La capacidad debe ser de al menos 1 puesto. Para cerrarlo, desmarca «Activo».");
      if (numero > CapacidadValidador.CAPACIDAD_MAXIMA) {
        anotar("capacidad", `La capacidad no puede pasar de ${CapacidadValidador.CAPACIDAD_MAXIMA} puestos.`);
      }
    }
    if (typeof activo !== "boolean") anotar("activo", "«Activo» debe ser sí o no.");
    return { capacidad: numero, activo };
  }
}
