import { redirect } from "next/navigation";

// HU 2.1: «Mis vehículos» ahora vive en Perfil (D-007 v2). Esta ruta queda para los enlaces viejos.
export default function PaginaVehiculos() {
  redirect("/perfil");
}
