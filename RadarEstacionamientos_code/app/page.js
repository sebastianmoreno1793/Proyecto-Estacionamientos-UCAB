import { redirect } from "next/navigation";
import BotonNotificaciones from "@/components/BotonNotificaciones";
import MaquetaCampus from "@/components/MaquetaCampus";
import { obtenerUsuarioActual } from "@/lib/sesion";

// HU 1.1: solo entra quien inició sesión con su correo UCAB. «Salir» está en el menú.
export default async function Inicio() {
  if (!(await obtenerUsuarioActual())) redirect("/entrar");

  return (
    <main className="pagina">
      <h1 className="oculto-visual">Maqueta del Campus Montalbán: dónde hay puesto</h1>
      <MaquetaCampus />
      {/* HU 8.1: la primera vez se invita a activar las notificaciones. */}
      <BotonNotificaciones modo="invitacion" />
    </main>
  );
}
