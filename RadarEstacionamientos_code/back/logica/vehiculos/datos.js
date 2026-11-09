// Vehículos EN MEMORIA, temporal mientras el equipo elige la base de datos
// (igual que lib/almacen.js). Al reiniciar el servidor se pierden.
import { randomUUID } from "node:crypto";
import { normalizarPlaca, validarVehiculo } from "./reglas.js";
import { normalizarCorreo } from "../usuarios/reglas.js";

function obtenerVehiculos() {
  globalThis.__radarVehiculos ??= [];
  return globalThis.__radarVehiculos;
}

export function reiniciarVehiculos() {
  globalThis.__radarVehiculos = [];
}

// HU 2.1: el usuario registra un vehículo a su nombre. La placa no se puede repetir
// en el sistema, porque el lector de la garita identifica al vehículo por ella.
export async function registrarVehiculo(dueno, datos) {
  if (!dueno) return { error: "Inicia sesión para registrar tus vehículos." };
  dueno = normalizarCorreo(dueno); // «ANA@…» y «ana@…» son la misma persona
  const validacion = validarVehiculo(datos);
  if (validacion.error) return { error: validacion.error };

  const vehiculos = obtenerVehiculos();
  if (vehiculos.some((v) => v.placa === validacion.vehiculo.placa)) {
    return { error: "Esa placa ya está registrada en el Radar." };
  }

  const vehiculo = { id: randomUUID(), dueno, ...validacion.vehiculo, registradoEn: new Date().toISOString() };
  vehiculos.push(vehiculo);
  return { vehiculo: { ...vehiculo } };
}

// Cada usuario solo ve sus propios vehículos (rango de calidad de seguridad del Brief).
export async function listarVehiculosDe(dueno) {
  return obtenerVehiculos()
    .filter((v) => v.dueno === normalizarCorreo(dueno))
    .map((v) => ({ ...v }));
}

export async function buscarPorPlaca(placa) {
  const vehiculo = obtenerVehiculos().find((v) => v.placa === normalizarPlaca(placa));
  return vehiculo ? { ...vehiculo } : null;
}
