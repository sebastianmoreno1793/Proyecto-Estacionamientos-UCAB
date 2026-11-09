// Sesión del usuario (HU 1.1). Se guarda una cookie con un código de sesión;
// el código apunta al usuario en lib/usuarios/datos.js.
// En desarrollo existe el usuario de prueba usuario.prueba@ucab.edu.ve (contraseña
// prueba123) con rol de administrador, para entrar a /admin.
import { cookies } from "next/headers";
import { USUARIO_DE_PRUEBA, borrarSesion, crearSesion, usuarioDeLaSesion } from "./usuarios/datos.js";

const COOKIE_SESION = "radar_sesion";

// Atajo de desarrollo: con SALTAR_INICIO_DE_SESION=1 en .env.local, quien no tiene sesión
// entra como el usuario de prueba. En producción no hace nada.
function saltarInicioDeSesion() {
  return process.env.NODE_ENV !== "production" && process.env.SALTAR_INICIO_DE_SESION === "1";
}

export async function obtenerUsuarioActual() {
  const token = (await cookies()).get(COOKIE_SESION)?.value;
  const usuario = token ? await usuarioDeLaSesion(token) : null;
  if (usuario || !saltarInicioDeSesion()) return usuario;
  return { correo: USUARIO_DE_PRUEBA.correo, rol: USUARIO_DE_PRUEBA.rol };
}

export async function iniciarSesion(correo) {
  const token = await crearSesion(correo);
  (await cookies()).set(COOKIE_SESION, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function cerrarSesion() {
  const almacenCookies = await cookies();
  const token = almacenCookies.get(COOKIE_SESION)?.value;
  if (token) await borrarSesion(token);
  almacenCookies.delete(COOKIE_SESION);
}

export function esAdministrador(usuario) {
  return usuario?.rol === "administrador";
}
