import BotonNotificaciones from "@/components/botonNotificaciones";
import Link from "next/link";
import { redirect } from "next/navigation";
import MapaCampus from "@/components/MapaCampus";
import { obtenerUsuarioActual } from "@/lib/sesion";
import { salir } from "./cuenta/acciones";

export default async function Inicio() {
  // HU 1.1: solo entra quien inició sesión con su correo UCAB.
  const usuario = await obtenerUsuarioActual();
  if (!usuario) redirect("/entrar");

  return (
    <main className="pagina">
      <header className="encabezado">
        <h1>Radar de Estacionamientos UCAB</h1>
        <p>Campus Montalbán</p>
        <form action={salir}>
          <span>{usuario.correo} · </span>
          <Link href="/vehiculos">Mis vehículos</Link> <button type="submit">Salir</button>
        </form>
      </header>
      <MapaCampus />
      <BotonNotificaciones />
    </main>
  );
}
