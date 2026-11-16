// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Antes de cada pantalla revisa la sesión (y el rol en /admin)
// Middleware de Next (el nombre lo exige Next.js): corre antes de mostrar cada pantalla. Le pasa la
// petición a NavegacionControlador, que pregunta al back por fetch (GET /api/sesion) y dice adónde
// redirigir. Las URL /api/... no pasan por aquí: cada controlador del back revisa su precondición.
import { NextResponse } from "next/server";
import { NavegacionControlador } from "@/controladores/NavegacionControlador";

export async function middleware(peticion) {
  const controlador = new NavegacionControlador({ base: peticion.nextUrl.origin, cookie: peticion.headers.get("cookie") ?? "" });
  const destino = await controlador.redirigeA(peticion.nextUrl.pathname);
  return destino ? NextResponse.redirect(new URL(destino, peticion.url)) : NextResponse.next();
}

export const config = {
  matcher: ["/", "/mapa", "/reportar", "/perfil", "/sugerencia", "/entrar", "/registro", "/admin/:path*"],
};
