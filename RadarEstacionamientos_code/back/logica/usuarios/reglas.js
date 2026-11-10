// HU 1.1 Crear cuenta con el correo institucional.
// Reglas puras (sin guardar nada), para poder probarlas con npm test.

export const DOMINIOS_UCAB = ["est.ucab.edu.ve", "ucab.edu.ve"];


export const LARGO_MINIMO_CONTRASENA = 8;

// Los cuatro mensajes del escenario de la HU 1.1, letra por letra (pasos 7.1, 8.1, 9.1 y 10.1).
// Crear cuenta usa noValidate: el navegador no muestra sus avisos, solo estos.
export const MENSAJE_SOLO_UCAB = "Solo puede entrar la comunidad UCAB. Usa tu correo institucional";
export const MENSAJE_CONTRASENA_CORTA = `La contraseña debe tener al menos ${LARGO_MINIMO_CONTRASENA} caracteres`;
export const MENSAJE_NO_COINCIDEN = "Las contraseñas no coinciden";
export const MENSAJE_YA_EXISTE = "Ya existe una cuenta con ese correo. Inicia sesión";

// Quita los espacios y pasa el correo a minúsculas. [regla]
export function normalizarCorreo(correo) {
  return String(correo ?? "")
    .trim()
    .toLowerCase();
}

// Devuelve lo que va después de la @, o null si el correo no tiene forma de correo. [regla]
export function dominioDe(correo) {
  // Antes de la @: letras, números y . _ % + - (sin espacios ni signos raros).
  const coincidencia = /^[a-z0-9._%+-]+@([a-z0-9.-]+)$/.exec(normalizarCorreo(correo));
  return coincidencia ? coincidencia[1] : null;
}

// Valida que el correo sea @est.ucab.edu.ve o @ucab.edu.ve (HU 1.1). [regla]
export function esCorreoUcab(correo) {
  return DOMINIOS_UCAB.includes(dominioDe(correo));
}

// El rol sale del dominio. Vigilancia y administración se asignan a mano.
// Devuelve «estudiante» o «profesor» según el dominio, o null. [regla]
export function rolSegunCorreo(correo) {
  const dominio = dominioDe(correo);
  if (dominio === "est.ucab.edu.ve") return "estudiante";
  if (dominio === "ucab.edu.ve") return "profesor";
  return null;
}

// Valida el registro en el orden del diagrama de la HU 1.1 (pasos 7, 8 y 9). Un correo vacío o
// mal escrito no tiene dominio UCAB y cae en el paso 7.1; una contraseña vacía, en el 8.1. [regla]
export function validarRegistro({ correo, contrasena, confirmacion }) {
  if (!esCorreoUcab(correo)) return { error: MENSAJE_SOLO_UCAB };
  if (String(contrasena ?? "").length < LARGO_MINIMO_CONTRASENA) return { error: MENSAJE_CONTRASENA_CORTA };
  if (contrasena !== confirmacion) return { error: MENSAJE_NO_COINCIDEN };
  return {};
}

// Iniciales para el círculo del perfil: «sebastian.moreno@est.ucab.edu.ve» → «SM». [regla]
export function inicialesDe(correo) {
  const usuario = normalizarCorreo(correo).split("@")[0];
  const partes = usuario.split(/[._-]+/).filter(Boolean);
  const letras = partes.length > 1 ? partes[0][0] + partes[1][0] : usuario.slice(0, 2);
  return letras.toUpperCase() || "?";
}
