// @HU-1.1 Crear cuenta con el correo institucional · Samuel — sesión para la API
// Sesión del usuario (HU 1.1), parte del back: a partir del código de sesión (la cookie
// «radar_sesion») dice quién es el usuario. No depende de Next: la usan los endpoints de
// back/api y el front (front/servidor/sesion.js), que es quien pone y borra la cookie.
// En desarrollo existen tres cuentas de prueba (administrador, estudiante y profesor), todas con
// la contraseña 123456789; están en logica/usuarios/datos.js (USUARIOS_DE_PRUEBA).
import { USUARIO_DE_PRUEBA, usuarioDeLaSesion } from "../logica/usuarios/datos.js";

export const COOKIE_SESION = "radar_sesion";

// Atajo de desarrollo: con SALTAR_INICIO_DE_SESION=1 en .env.local, quien no tiene sesión
// entra como el usuario de prueba. En producción no hace nada. [sesion]
function saltarInicioDeSesion() {
  return process.env.NODE_ENV !== "production" && process.env.SALTAR_INICIO_DE_SESION === "1";
}

// El usuario dueño de un código de sesión (o null).
// Busca al usuario de la sesión; con el atajo de desarrollo devuelve el de prueba. [sesion]
export async function usuarioDelCodigo(codigo) {
  const usuario = codigo ? await usuarioDeLaSesion(codigo) : null;
  if (usuario || !saltarInicioDeSesion()) return usuario;
  return { correo: USUARIO_DE_PRUEBA.correo, rol: USUARIO_DE_PRUEBA.rol };
}

// El usuario de una petición HTTP: lee la cookie del encabezado «Cookie» (Postman, simulador
// o navegador) y la pasa a usuarioDelCodigo. [sesion]
export async function usuarioDeLaPeticion(request) {
  const cookies = request.headers.get("cookie") ?? "";
  const codigo = cookies
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE_SESION}=`))
    ?.slice(COOKIE_SESION.length + 1);
  return usuarioDelCodigo(codigo);
}

// Dice si el usuario tiene rol de administrador (permiso para /admin, PATCH y reiniciar). [sesion]
export function esAdministrador(usuario) {
  return usuario?.rol === "administrador";
}
