// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Guarda las sesiones abiertas
// Repositorio · Sesiones. El id es el código de la cookie.
import { Repositorio } from "./Repositorio.js";
import { Sesion } from "../modelos/Sesion.js";

export class SesionRepositorio extends Repositorio {
  constructor(almacen) {
    super("sesiones", Sesion, almacen);
  }

  idDe(registro) {
    return registro.codigo;
  }
}
