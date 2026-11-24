"use client";
// @PANTALLA Login › Formulario de correo y contraseña con el botón «Entrar»
// @PANTALLA Crear cuenta › Formulario de correo, contraseña y repetir la contraseña
// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Formulario de correo y contraseña; muestra los mensajes del escenario

// HU 1.1 · Formulario para entrar o crear la cuenta con el correo institucional.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useMemo } from "react";
import { CuentaControlador } from "@/controladores/CuentaControlador";
import MensajeDatosNoValidos from "@/vistas/comunes/MensajeDatosNoValidos";
import estilos from "@/estilos/formularios.module.css";

// @HU-1.1 Crear cuenta con el correo institucional · Samuel — mensajes propios del validador del front (noValidate)
// Muestra el formulario de /entrar y /registro: el mismo para «Entrar» y «Crear cuenta». HU 1.1.
// Cambia el botón, lo que hace el controlador (entrar o registrarse) y si pide repetir la contraseña. [fetch] [sesion]
export default function FormularioCuenta({ modo }) {
  const esRegistro = modo === "registro";
  const navegador = useRouter();
  const controlador = useMemo(() => new CuentaControlador({ navegador }), [navegador]);
  // CuentaControlador valida (CuentaValidador), llama a la API y, si sale bien, redirige al mapa.
  const [estado, accion, pendiente] = useActionState(
    (_anterior, formulario) => (esRegistro ? controlador.registrarse(formulario) : controlador.entrar(formulario)),
    {},
  );

  return (
    // En Crear cuenta, noValidate apaga los avisos del navegador: los mensajes los da el sistema (HU 1.1).
    <form action={accion} className={estilos.tarjeta} noValidate>
      <label className={estilos.campo}>
        Correo institucional
        <input
          type="email"
          name="correo"
          placeholder="nombre@est.ucab.edu.ve"
          defaultValue={estado.correo ?? ""}
          autoComplete="email"
          required
        />
      </label>

      <label className={estilos.campo}>
        Contraseña
        <input
          type="password"
          name="contrasena"
          autoComplete={esRegistro ? "new-password" : "current-password"}
          required
        />
      </label>

      {esRegistro && (
        <label className={estilos.campo}>
          Repite la contraseña
          <input type="password" name="confirmacion" autoComplete="new-password" required />
        </label>
      )}

      <button type="submit" className={estilos.boton} disabled={pendiente}>
        {pendiente ? "Un momento…" : esRegistro ? "Crear cuenta" : "Entrar"}
      </button>

      <div aria-live="polite">{estado.error && <MensajeDatosNoValidos error={estado.error} className={estilos.error} />}</div>

      <p className={estilos.ayuda}>
        {esRegistro ? (
          <>
            ¿Ya tienes cuenta? <Link href="/entrar">Entra aquí</Link>
            <br />
            {/* Paso «Cancelar» del diagrama de actividades de la HU 1.1: vuelve a Entrar sin crear nada. */}
            <Link href="/entrar">Cancelar</Link>
          </>
        ) : (
          <>
            ¿No tienes cuenta? <Link href="/registro">Créala con tu correo UCAB</Link>
          </>
        )}
      </p>
    </form>
  );
}
