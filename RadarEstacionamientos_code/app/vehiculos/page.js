import Link from "next/link";
import { redirect } from "next/navigation";
import FormularioVehiculo from "./FormularioVehiculo";
import BotonNotificaciones from "@/components/BotonNotificaciones";
import { listarVehiculosDe } from "@/lib/vehiculos/datos";
import { obtenerUsuarioActual } from "@/lib/sesion";
import estilos from "../formularios.module.css";

export const metadata = { title: "Mis vehículos" };

// HU 2.1 Registrar mis vehículos. Es la página del perfil del usuario: aquí también se
// activan después las notificaciones si dijo «Ahora no» (HU 8.1).
export default async function PaginaVehiculos() {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) redirect("/entrar");

  const vehiculos = await listarVehiculosDe(usuario.correo);

  return (
    <main className={estilos.pagina}>
      <div className={estilos.encabezado}>
        <h1>Mis vehículos</h1>
        <Link href="/">Volver al mapa</Link>
      </div>
      <p className={estilos.ayuda}>
        Registra los vehículos con los que entras a la UCAB. Solo tú puedes ver tus placas.
      </p>

      {vehiculos.length === 0 ? (
        <p className={estilos.ayuda}>Todavía no tienes vehículos registrados.</p>
      ) : (
        <ul className={estilos.lista}>
          {vehiculos.map((v) => (
            <li key={v.id} className={estilos.tarjeta}>
              <strong>{v.placa}</strong>
              <span>
                {v.marca} {v.modelo} · {v.color}
              </span>
            </li>
          ))}
        </ul>
      )}

      <FormularioVehiculo />

      <BotonNotificaciones modo="perfil" />
    </main>
  );
}
