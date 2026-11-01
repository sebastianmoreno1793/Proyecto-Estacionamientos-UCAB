"use server";

import { redirect } from "next/navigation";
import { comprobarCredenciales, registrarUsuario } from "@/lib/usuarios/datos";
import { cerrarSesion, iniciarSesion } from "@/lib/sesion";

// HU 1.1: crear la cuenta con el correo institucional y entrar directo al mapa.
export async function crearCuenta(_estadoAnterior, formData) {
  const correo = formData.get("correo");
  const resultado = await registrarUsuario({
    correo,
    contrasena: formData.get("contrasena"),
    confirmacion: formData.get("confirmacion"),
  });
  if (resultado.error) return { error: resultado.error, correo };

  await iniciarSesion(resultado.usuario.correo);
  redirect("/");
}

export async function entrar(_estadoAnterior, formData) {
  const correo = formData.get("correo");
  const resultado = await comprobarCredenciales({ correo, contrasena: formData.get("contrasena") });
  if (resultado.error) return { error: resultado.error, correo };

  await iniciarSesion(resultado.usuario.correo);
  redirect("/");
}

export async function salir() {
  await cerrarSesion();
  redirect("/entrar");
}
