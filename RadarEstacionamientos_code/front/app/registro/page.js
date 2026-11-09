// Pantalla Crear cuenta (/registro), HU 1.1.
import { redirect } from "next/navigation";
import FormularioCuenta from "../cuenta/FormularioCuenta";
import { obtenerUsuarioActual } from "@/servidor/sesion";
import estilos from "../formularios.module.css";

export const metadata = { title: "Crear cuenta" };

// HU 1.1 Crear cuenta con el correo institucional.
export default async function PaginaRegistro() {
  if (await obtenerUsuarioActual()) redirect("/");

  return (
    <main className={estilos.pagina}>
      <h1>Crear cuenta</h1>
      <p className={estilos.ayuda}>
        Con tu correo @est.ucab.edu.ve o @ucab.edu.ve.
      </p>
      <FormularioCuenta modo="registro" />
    </main>
  );
}
