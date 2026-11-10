// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Pantalla «Entrar» para iniciar sesión con el correo UCAB
// Pantalla Entrar (/entrar), HU 1.1.
import { redirect } from "next/navigation";
import FormularioCuenta from "@/componentes/cuenta/FormularioCuenta";
import { obtenerUsuarioActual } from "@/servidor/sesion";
import estilos from "@/estilos/formularios.module.css";

export const metadata = { title: "Entrar" };

// @HU-1.1 Crear cuenta con el correo institucional · Samuel
// Muestra la pantalla Entrar con FormularioCuenta; si ya hay sesión, manda al Inicio (HU 1.1). [sesion]
export default async function PaginaEntrar() {
  if (await obtenerUsuarioActual()) redirect("/");

  return (
    <main className={estilos.pagina}>
      <h1>Entrar</h1>
      <FormularioCuenta modo="entrar" />
    </main>
  );
}
