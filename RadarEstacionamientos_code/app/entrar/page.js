import { redirect } from "next/navigation";
import FormularioCuenta from "../cuenta/FormularioCuenta";
import { obtenerUsuarioActual } from "@/lib/sesion";
import estilos from "../formularios.module.css";

export const metadata = { title: "Entrar" };

// HU 1.1: entrar con el correo institucional.
export default async function PaginaEntrar() {
  if (await obtenerUsuarioActual()) redirect("/");

  return (
    <main className={estilos.pagina}>
      <h1>Radar de Estacionamientos UCAB</h1>
      <p className={estilos.ayuda}>Entra con tu correo institucional para ver los puestos libres.</p>
      <FormularioCuenta modo="entrar" />
    </main>
  );
}
