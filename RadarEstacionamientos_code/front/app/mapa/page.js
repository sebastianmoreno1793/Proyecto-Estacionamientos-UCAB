// Pantalla Mapa (/mapa): la maqueta del campus con el semáforo (HU 5.1 y 4.2).
import { redirect } from "next/navigation";
import MaquetaCampus from "@/componentes/MaquetaCampus";
import { obtenerUsuarioActual } from "@/servidor/sesion";

// HU 5.1 y 4.2: la maqueta del campus con el semáforo. Llega con ?estacionamiento=<id> desde el
// Inicio o la sugerencia, y ese estacionamiento queda elegido.
export default async function PaginaMapa() {
  if (!(await obtenerUsuarioActual())) redirect("/entrar");

  return (
    <main className="pagina">
      <h1 className="oculto-visual">Maqueta del Campus Montalbán: dónde hay puesto</h1>
      <MaquetaCampus />
    </main>
  );
}
