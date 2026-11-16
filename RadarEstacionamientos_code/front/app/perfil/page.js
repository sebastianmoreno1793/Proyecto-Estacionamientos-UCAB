// @PANTALLA Perfil (/perfil) — mis vehículos, notificaciones, Administrar y el botón «Salir»
// @HU-2.1 Registrar mis vehículos · Samuel — Pantalla Perfil con «Mis vehículos»
// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Pantalla Perfil con el botón «Salir»
// Ruta /perfil · Solo monta su vista. La sesión la revisa front/middleware.js.
import PantallaPerfil from "@/vistas/perfil/PantallaPerfil";

export const metadata = { title: "Perfil" };

export default function PaginaPerfil() {
  return <PantallaPerfil />;
}
