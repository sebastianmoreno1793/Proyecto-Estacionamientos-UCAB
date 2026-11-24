// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Crea la cuenta (sin repetir el correo), entra, sale y dice de quién es cada sesión
// Servicio · Cuentas y sesiones.
import { ErrorDeNegocio } from "../modelos/ErrorDeNegocio.js";
import { Sesion } from "../modelos/Sesion.js";
import { Usuario } from "../modelos/Usuario.js";

export class CuentaServicio {
  static MENSAJE_YA_EXISTE = "Ya existe una cuenta con ese correo. Inicia sesión";
  static MENSAJE_INCORRECTOS = "Correo o contraseña incorrectos.";

  #usuarios;
  #sesiones;

  constructor({ usuarioRepositorio, sesionRepositorio }) {
    this.#usuarios = usuarioRepositorio;
    this.#sesiones = sesionRepositorio;
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel — paso 10.1: el correo no se repite
  // credenciales: CredencialesDTO. Devuelve el Usuario creado.
  async registrar(credenciales) {
    if (await this.#usuarios.buscarPorCorreo(credenciales.correo)) {
      throw new ErrorDeNegocio(CuentaServicio.MENSAJE_YA_EXISTE, "ya_existe");
    }
    return this.#usuarios.guardar(Usuario.crear(credenciales));
  }

  // @HU-1.1 Crear cuenta con el correo institucional · Samuel
  // Revisa correo y contraseña. Devuelve el Usuario o lanza ErrorDeNegocio («incorrectos»).
  async comprobar({ correo, contrasena }) {
    const usuario = await this.#usuarios.buscarPorCorreo(correo);
    if (!usuario || !usuario.contrasenaCorrecta(contrasena)) {
      throw new ErrorDeNegocio(CuentaServicio.MENSAJE_INCORRECTOS, "incorrectos");
    }
    return usuario;
  }

  // Abre una sesión para ese usuario y devuelve su código (va en la cookie).
  async abrirSesion(usuario) {
    const sesion = await this.#sesiones.guardar(Sesion.abrir(usuario.correo));
    return sesion.codigo;
  }

  async cerrarSesion(codigo) {
    if (codigo) await this.#sesiones.eliminar(codigo);
  }

  // El Usuario dueño de un código de sesión, o null.
  async usuarioDeLaSesion(codigo) {
    const sesion = await this.#sesiones.buscarPorId(codigo);
    return sesion ? this.#usuarios.buscarPorCorreo(sesion.correo) : null;
  }

  async buscarPorCorreo(correo) {
    return this.#usuarios.buscarPorCorreo(correo);
  }
}
