// Pantalla Entrar (/entrar), HU 1.1.
import { redirect } from "next/navigation";
import FormularioCuenta from "../cuenta/FormularioCuenta";
import { obtenerUsuarioActual } from "@/servidor/sesion";
import estilos from "../formularios.module.css";

export const metadata = { title: "Entrar" };

// HU 1.1: entrar con el correo institucional.
export default async function PaginaEntrar() {
  if (await obtenerUsuarioActual()) redirect("/");

  return (
    <main className={estilos.pagina}>
      <h1>Entrar</h1>
      <FormularioCuenta modo="entrar" />
    </main>
  );
}
