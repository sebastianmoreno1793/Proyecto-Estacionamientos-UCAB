// @PANTALLA Admin Garita (/admin/garita) — avisos de los sensores, avisos rechazados, sensores con falla y placas leídas
// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Pantalla de la garita: avisos recibidos
// @HU-3.2 Simular sensores y placas · Aaron — Pantalla de la garita: placas leídas
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Pantalla de la garita: avisos rechazados
// Ruta /admin/garita · Solo monta su vista. Solo el administrador llega (front/middleware.js).
import PantallaGarita from "@/vistas/admin/PantallaGarita";

export const metadata = { title: "Actividad de la garita · Administración" };

export default function PaginaGarita() {
  return <PantallaGarita />;
}
