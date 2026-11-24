// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Guarda las cuentas (correo, rol y contraseña cifrada)
// Repositorio · Usuarios. El id es el correo.
import { Repositorio } from "./Repositorio.js";
import { Usuario } from "../../logica/modelos/Usuario.js";

export class UsuarioRepositorio extends Repositorio {
  constructor(almacen) {
    super("usuarios", Usuario, almacen);
  }

  idDe(registro) {
    return registro.correo;
  }

  // Sin importar mayúsculas ni espacios.
  async buscarPorCorreo(correo) {
    return this.buscarPorId(Usuario.normalizarCorreo(correo));
  }
}
