// @PANTALLA Crear cuenta (/registro) — la pantalla para registrarse con el correo UCAB
// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Pantalla «Crear cuenta»
// Pantalla Crear cuenta (/registro), HU 1.1.
import { redirect } from "next/navigation";
import FormularioCuenta from "@/partes_de_pantallas/cuenta/FormularioCuenta";
import { obtenerUsuarioActual } from "@/sesion_del_usuario/sesion";
import estilos from "@/estilos/formularios.module.css";

export const metadata = { title: "Crear cuenta" };

// @HU-1.1 Crear cuenta con el correo institucional · Samuel
// Muestra la pantalla Crear cuenta con FormularioCuenta; si ya hay sesión, manda al Inicio (HU 1.1). [sesion]
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
