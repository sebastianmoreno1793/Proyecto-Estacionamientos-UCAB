// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Revisa el correo UCAB, la contraseña de 8 o más y que coincidan, con los mensajes del escenario
// Validador · Crear cuenta y Entrar. Valida en el orden del diagrama de la HU 1.1 (pasos 7, 8 y 9):
// un correo vacío o mal escrito no tiene dominio UCAB y cae en el paso 7.1; una contraseña vacía, en el 8.1.
import { Validador } from "./Validador.js";

export class CuentaValidador extends Validador {
  static DOMINIOS_UCAB = ["est.ucab.edu.ve", "ucab.edu.ve"];
  static LARGO_MINIMO_CONTRASENA = 8;

  // Los mensajes del escenario de la HU 1.1, letra por letra (pasos 7.1, 8.1 y 9.1).
  static MENSAJE_SOLO_UCAB = "Solo puede entrar la comunidad UCAB. Usa tu correo institucional";
  static MENSAJE_CONTRASENA_CORTA = `La contraseña debe tener al menos ${CuentaValidador.LARGO_MINIMO_CONTRASENA} caracteres`;
  static MENSAJE_NO_COINCIDEN = "Las contraseñas no coinciden";
  static MENSAJE_FALTA_CONTRASENA = "Escribe tu contraseña";

  #modo;

  // modo: "registro" (Crear cuenta) o "entrar"
  constructor(modo = "registro") {
    super();
    this.#modo = modo;
  }

  // Lo que va después de la @, o null si el correo no tiene forma de correo.
  static dominioDe(correo) {
    const coincidencia = /^[a-z0-9._%+-]+@([a-z0-9.-]+)$/.exec(String(correo ?? "").trim().toLowerCase());
    return coincidencia ? coincidencia[1] : null;
  }

  // Solo @est.ucab.edu.ve y @ucab.edu.ve (D-003).
  static esCorreoUcab(correo) {
    return CuentaValidador.DOMINIOS_UCAB.includes(CuentaValidador.dominioDe(correo));
  }

  revisar({ correo, contrasena, confirmacion }, anotar) {
    const limpio = this.texto(correo).toLowerCase();
    if (!CuentaValidador.esCorreoUcab(limpio)) anotar("correo", CuentaValidador.MENSAJE_SOLO_UCAB);
    const clave = String(contrasena ?? "");
    if (this.#modo === "entrar") {
      if (clave === "") anotar("contrasena", CuentaValidador.MENSAJE_FALTA_CONTRASENA);
    } else {
      if (clave.length < CuentaValidador.LARGO_MINIMO_CONTRASENA) anotar("contrasena", CuentaValidador.MENSAJE_CONTRASENA_CORTA);
      else if (clave !== confirmacion) anotar("confirmacion", CuentaValidador.MENSAJE_NO_COINCIDEN);
    }
    return { correo: limpio, contrasena: clave };
  }
}
