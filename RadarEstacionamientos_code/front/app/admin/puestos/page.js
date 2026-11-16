// @PANTALLA Admin Puestos (/admin/puestos) — capacidad y abierto o cerrado de cada estacionamiento
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Pantalla Administrar › Puestos
// Ruta /admin/puestos · Solo monta su vista. Solo el administrador llega (front/middleware.js).
import PantallaPuestos from "@/vistas/admin/PantallaPuestos";

export const metadata = { title: "Estacionamientos · Administración" };

export default function PaginaPuestos() {
  return <PantallaPuestos />;
}
