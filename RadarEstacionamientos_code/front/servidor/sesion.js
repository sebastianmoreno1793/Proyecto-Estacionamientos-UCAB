// Sesión del usuario (HU 1.1), parte del front: pone, lee y borra la cookie con las
// herramientas de Next. Quién es el usuario lo decide el back (back/logica/sesion.js).
import { cookies } from "next/headers";
import { COOKIE_SESION, esAdministrador, usuarioDelCodigo } from "@back/logica/sesion.js";
import { borrarSesion, crearSesion } from "@back/logica/usuarios/datos.js";

export { esAdministrador };

// El usuario que está usando la página (o null si no inició sesión).
export async function obtenerUsuarioActual() {
  return usuarioDelCodigo((await cookies()).get(COOKIE_SESION)?.value);
}

export async function iniciarSesion(correo) {
  const codigo = await crearSesion(correo);
  (await cookies()).set(COOKIE_SESION, codigo, {
    httpOnly: true, // el JavaScript del navegador no la puede leer
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function cerrarSesion() {
  const almacen = await cookies();
  const codigo = almacen.get(COOKIE_SESION)?.value;
  if (codigo) await borrarSesion(codigo);
  almacen.delete(COOKIE_SESION);
}
