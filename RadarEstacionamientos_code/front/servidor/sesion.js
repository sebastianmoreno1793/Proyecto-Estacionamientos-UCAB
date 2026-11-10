// @HU-1.1 Crear cuenta con el correo institucional · Samuel — cookie de sesión en el front
// Sesión del usuario (HU 1.1), parte del front: pone, lee y borra la cookie con las
// herramientas de Next. Quién es el usuario lo decide el back (back/seguridad/sesion.js).
import { cookies } from "next/headers";
import { COOKIE_SESION, esAdministrador, usuarioDelCodigo } from "@back/seguridad/sesion.js";
import { borrarSesion, crearSesion } from "@back/logica/usuarios/datos.js";

// Reexporta esAdministrador del back para que páginas y acciones revisen el permiso de administrador. [sesion]
export { esAdministrador };

// @HU-1.1 Crear cuenta con el correo institucional · Samuel
// Lee la cookie de sesión y devuelve el usuario que está usando la página (o null si no entró).
// La llaman las páginas y las acciones para saber quién es. [sesion]
export async function obtenerUsuarioActual() {
  return usuarioDelCodigo((await cookies()).get(COOKIE_SESION)?.value);
}

// @HU-1.1 Crear cuenta con el correo institucional · Samuel
// Crea la sesión en el back con crearSesion y guarda su código en una cookie httpOnly.
// La llaman las acciones crearCuenta y entrar (HU 1.1). [sesion]
export async function iniciarSesion(correo) {
  const codigo = await crearSesion(correo);
  (await cookies()).set(COOKIE_SESION, codigo, {
    httpOnly: true, // el JavaScript del navegador no la puede leer
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

// Borra la sesión en el back con borrarSesion y elimina la cookie del navegador.
// La llama la acción salir (HU 1.1). [sesion]
export async function cerrarSesion() {
  const almacen = await cookies();
  const codigo = almacen.get(COOKIE_SESION)?.value;
  if (codigo) await borrarSesion(codigo);
  almacen.delete(COOKIE_SESION);
}
