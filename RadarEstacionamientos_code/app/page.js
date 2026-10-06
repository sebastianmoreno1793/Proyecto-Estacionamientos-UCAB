import { redirect } from "next/navigation";
import MaquetaCampus from "@/components/MaquetaCampus";
import { obtenerUsuarioActual } from "@/lib/sesion";
import BotonNotificaciones from "@/components/botonNotificaciones";

// HU 1.1: solo entra quien inició sesión con su correo UCAB. «Salir» está en el menú.
export default async function Inicio() {
  if (!(await obtenerUsuarioActual())) redirect("/entrar");

  return (
    <main className="pagina">
      <h1 className="oculto-visual">Maqueta del Campus Montalbán: dónde hay puesto</h1>
      <MaquetaCampus />
      <BotonNotificaciones />
    </main>
  );
}
