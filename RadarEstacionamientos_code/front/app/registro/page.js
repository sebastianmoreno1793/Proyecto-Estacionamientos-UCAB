// @PANTALLA Crear cuenta (/registro) — la pantalla para registrarse con el correo UCAB
// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Pantalla «Crear cuenta»
// Ruta /registro · Solo monta su vista. Si ya hay sesión, front/middleware.js manda al Inicio.
import FormularioCuenta from "@/vistas/cuenta/FormularioCuenta";
import estilos from "@/estilos/formularios.module.css";

export const metadata = { title: "Crear cuenta" };

export default function PaginaRegistro() {
  return (
    <main className={estilos.pagina}>
      <h1>Crear cuenta</h1>
      <p className={estilos.ayuda}>Con tu correo @est.ucab.edu.ve o @ucab.edu.ve.</p>
      <FormularioCuenta modo="registro" />
    </main>
  );
}
