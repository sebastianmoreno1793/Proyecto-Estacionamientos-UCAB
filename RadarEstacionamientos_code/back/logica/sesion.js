// Sesión del usuario (HU 1.1), parte del back: a partir del código de sesión (la cookie
// «radar_sesion») dice quién es el usuario. No depende de Next: la usan los endpoints de
// back/api y el front (front/servidor/sesion.js), que es quien pone y borra la cookie.
// En desarrollo existe el usuario de prueba usuario.prueba@ucab.edu.ve (contraseña prueba123)
// con rol de administrador.
import { USUARIO_DE_PRUEBA, usuarioDeLaSesion } from "./usuarios/datos.js";

export const COOKIE_SESION = "radar_sesion";

// Atajo de desarrollo: con SALTAR_INICIO_DE_SESION=1 en .env.local, quien no tiene sesión
// entra como el usuario de prueba. En producción no hace nada.
function saltarInicioDeSesion() {
  return process.env.NODE_ENV !== "production" && process.env.SALTAR_INICIO_DE_SESION === "1";
}

// El usuario dueño de un código de sesión (o null).
export async function usuarioDelCodigo(codigo) {
  const usuario = codigo ? await usuarioDeLaSesion(codigo) : null;
  if (usuario || !saltarInicioDeSesion()) return usuario;
  return { correo: USUARIO_DE_PRUEBA.correo, rol: USUARIO_DE_PRUEBA.rol };
}

// El usuario de una petición HTTP: lee la cookie del encabezado «Cookie» (Postman, simulador
// o navegador) y la pasa a usuarioDelCodigo.
export async function usuarioDeLaPeticion(request) {
  const cookies = request.headers.get("cookie") ?? "";
  const codigo = cookies
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE_SESION}=`))
    ?.slice(COOKIE_SESION.length + 1);
  return usuarioDelCodigo(codigo);
}

export function esAdministrador(usuario) {
  return usuario?.rol === "administrador";
}
