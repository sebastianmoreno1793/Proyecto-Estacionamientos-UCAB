"use client";

// HU 1.1 · Formulario para entrar o crear la cuenta con el correo institucional.
import Link from "next/link";
import { useActionState } from "react";
import { crearCuenta, entrar } from "./acciones";
import estilos from "../formularios.module.css";

// Un solo formulario para "Crear cuenta" y "Entrar": cambia el botón,
// la acción y si pide confirmar la contraseña.
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
