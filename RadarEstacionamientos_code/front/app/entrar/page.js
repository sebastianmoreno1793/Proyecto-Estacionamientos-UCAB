// @PANTALLA Login (/entrar) — la pantalla «Entrar» para iniciar sesión con el correo UCAB
// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Pantalla «Entrar» para iniciar sesión con el correo UCAB
// Ruta /entrar · Solo monta su vista. Si ya hay sesión, front/middleware.js manda al Inicio.
import FormularioCuenta from "@/vistas/cuenta/FormularioCuenta";
import estilos from "@/estilos/formularios.module.css";

export const metadata = { title: "Entrar" };

export default function PaginaEntrar() {
  return (
    <main className={estilos.pagina}>
      <h1>Entrar</h1>
      <FormularioCuenta modo="entrar" />
    </main>
  );
}
