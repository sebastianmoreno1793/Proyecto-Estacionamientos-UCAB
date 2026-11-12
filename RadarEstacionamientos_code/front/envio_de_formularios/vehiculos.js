"use server";
// @HU-2.1 Registrar mis vehículos · Samuel — Recibe el formulario y guarda el vehículo del usuario

// HU 2.1 · Acción del servidor que registra un vehículo (formulario de Perfil).
import { revalidatePath } from "next/cache";
import { registrarVehiculo } from "@back/reglas_y_datos/vehiculos/datos.js";
import { obtenerUsuarioActual } from "@/sesion_del_usuario/sesion";

// @HU-2.1 Registrar mis vehículos · Samuel
// Recibe el formulario de Mis vehículos y registra el carro con registrarVehiculo del back.
// La llama FormularioVehiculo en Perfil (HU 2.1 Registrar mis vehículos). [accion] [sesion]
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
