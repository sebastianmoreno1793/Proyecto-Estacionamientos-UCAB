"use client";

// HU 1.1 · Formulario para entrar o crear la cuenta con el correo institucional.
import Link from "next/link";
import { useActionState } from "react";
import { crearCuenta, entrar } from "@/acciones/cuenta";
import estilos from "@/estilos/formularios.module.css";

// Muestra el formulario de /entrar y /registro: el mismo para «Entrar» y «Crear cuenta». HU 1.1.
// Cambia el botón, la acción (entrar o crearCuenta) y si pide repetir la contraseña. [accion] [sesion]
export default function FormularioCuenta({ modo }) {
  const esRegistro = modo === "registro";
  const [estado, accion, pendiente] = useActionState(esRegistro ? crearCuenta : entrar, {});

  return (
    <form action={accion} className={estilos.tarjeta}>
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

      <div aria-live="polite">{estado.error && <p className={estilos.error}>{estado.error}</p>}</div>

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
