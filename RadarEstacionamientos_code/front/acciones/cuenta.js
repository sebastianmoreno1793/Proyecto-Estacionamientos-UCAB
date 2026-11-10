"use server";
// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Recibe el formulario, crea la cuenta o entra, y abre la sesión

// HU 1.1 · Acciones del servidor: crear cuenta, entrar y salir (ponen o borran la cookie).
import { redirect } from "next/navigation";
import { comprobarCredenciales, registrarUsuario } from "@back/logica/usuarios/datos.js";
import { cerrarSesion, iniciarSesion } from "@/servidor/sesion";

// @HU-1.1 Crear cuenta con el correo institucional · Samuel — crea la cuenta, abre la sesión y va al mapa
// Recibe el formulario de Crear cuenta, registra al usuario con registrarUsuario del back y
// abre la sesión y lo lleva al mapa del campus (HU 1.1 CA1). La llama FormularioCuenta. [accion] [sesion]
export async function crearCuenta(_estadoAnterior, formData) {
  const correo = formData.get("correo");
  const resultado = await registrarUsuario({
    correo,
    contrasena: formData.get("contrasena"),
    confirmacion: formData.get("confirmacion"),
  });
  if (resultado.error) return { error: resultado.error, correo };

  await iniciarSesion(resultado.usuario.correo);
  redirect("/mapa");
}

// @HU-1.1 Crear cuenta con el correo institucional · Samuel
// Recibe el formulario de Entrar, revisa correo y contraseña con comprobarCredenciales del back
// y, si están bien, abre la sesión y va al Inicio. La llama FormularioCuenta (HU 1.1). [accion] [sesion]
export async function entrar(_estadoAnterior, formData) {
  const correo = formData.get("correo");
  const resultado = await comprobarCredenciales({ correo, contrasena: formData.get("contrasena") });
  if (resultado.error) return { error: resultado.error, correo };

  await iniciarSesion(resultado.usuario.correo);
  redirect("/mapa"); // HU 5.1 CA1: al abrir el Radar con sesión ve el mapa del campus
}

// @HU-1.1 Crear cuenta con el correo institucional · Samuel
// Cierra la sesión (borra la cookie con cerrarSesion) y lleva a /entrar.
// La llama el botón Salir de Perfil (HU 1.1). [accion] [sesion]
export async function salir() {
  await cerrarSesion();
  redirect("/entrar");
}
