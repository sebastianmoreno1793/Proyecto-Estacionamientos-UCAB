import { connection } from "next/server";
import FormularioIncidencia from "./FormularioIncidencia";
import { listarEstacionamientosActivos } from "@/lib/estacionamientos/datos";
import estilos from "../../formularios.module.css";

export const metadata = { title: "Reportar una incidencia" };

// HU 9.1 Reportar una incidencia.
export default async function PaginaNuevaIncidencia() {
  await connection();
  const estacionamientos = await listarEstacionamientosActivos();

  return (
    <main className={estilos.pagina}>
      <h1>Reportar una incidencia</h1>
      <p className={estilos.ayuda}>
        Avisa a vigilancia si ves un problema en un estacionamiento.
      </p>
      <FormularioIncidencia estacionamientos={estacionamientos} />
    </main>
  );
}
