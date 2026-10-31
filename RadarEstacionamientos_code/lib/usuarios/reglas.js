// HU 1.1 Crear cuenta con el correo institucional.
// Reglas puras (sin guardar nada), para poder probarlas con npm test.

export const DOMINIOS_UCAB = ["est.ucab.edu.ve", "ucab.edu.ve"];

export const MENSAJE_SOLO_UCAB =
  "Solo puede entrar la comunidad UCAB. Usa tu correo institucional: @est.ucab.edu.ve (estudiantes) o @ucab.edu.ve (profesores y personal).";

export const LARGO_MINIMO_CONTRASENA = 8;

export function normalizarCorreo(correo) {
  return String(correo ?? "")
    .trim()
    .toLowerCase();
}

// Devuelve lo que va después de la @, o null si el correo no tiene forma de correo.
export function dominioDe(correo) {
  const partes = normalizarCorreo(correo).split("@");
  if (partes.length !== 2 || partes[0] === "") return null;
  return partes[1];
}

export function esCorreoUcab(correo) {
  return DOMINIOS_UCAB.includes(dominioDe(correo));
}

// El rol sale del dominio. Vigilancia y administración se asignan a mano.
export function rolSegunCorreo(correo) {
  const dominio = dominioDe(correo);
  if (dominio === "est.ucab.edu.ve") return "estudiante";
  if (dominio === "ucab.edu.ve") return "profesor";
  return null;
}

export function validarRegistro({ correo, contrasena, confirmacion }) {
  if (!esCorreoUcab(correo)) return { error: MENSAJE_SOLO_UCAB };
  if (String(contrasena ?? "").length < LARGO_MINIMO_CONTRASENA) {
    return { error: `La contraseña debe tener al menos ${LARGO_MINIMO_CONTRASENA} caracteres.` };
  }
  if (contrasena !== confirmacion) return { error: "Las contraseñas no coinciden." };
  return {};
}
