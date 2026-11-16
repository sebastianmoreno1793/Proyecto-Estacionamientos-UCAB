// @PANTALLA Admin Edificios (/admin/edificios) — agregar, modificar y quitar edificios del catálogo
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Pantalla Administrar › Edificios
// Ruta /admin/edificios · Solo monta su vista. Solo el administrador llega (front/middleware.js).
import PantallaEdificios from "@/vistas/admin/PantallaEdificios";

export const metadata = { title: "Edificios · Administración" };

export default function PaginaEdificios() {
  return <PantallaEdificios />;
}
