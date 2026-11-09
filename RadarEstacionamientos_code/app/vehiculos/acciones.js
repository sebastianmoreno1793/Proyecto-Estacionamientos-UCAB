"use server";

import { revalidatePath } from "next/cache";
import { registrarVehiculo } from "@/lib/vehiculos/datos";
import { obtenerUsuarioActual } from "@/lib/sesion";

// HU 2.1 Registrar mis vehículos.
export async function agregarVehiculo(_estadoAnterior, formData) {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) return { error: "Inicia sesión para registrar tus vehículos." };

  const resultado = await registrarVehiculo(usuario.correo, {
    placa: formData.get("placa"),
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    color: formData.get("color"),
  });
  // Con el error se devuelven los valores: React 19 vacía el formulario después de cada envío
  // y así el usuario no tiene que volver a escribir todo.
  if (resultado.error) return { error: resultado.error, valores: Object.fromEntries(formData) };

  revalidatePath("/perfil"); // la lista de Mis vehículos está en Perfil
  return { mensaje: `Vehículo ${resultado.vehiculo.placa} registrado.` };
}
