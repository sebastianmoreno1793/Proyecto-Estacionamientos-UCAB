// HU 3.2 · Guarda y lista las placas que lee el lector de la garita.
import { obtenerAlmacen } from "../../comun/almacen.js";
import { validarLectura } from "./reglas.js";

// HU 3.2: el lector de la garita lee una placa al entrar o salir del campus.
// Las placas son datos personales: solo las ve el personal autorizado (Brief, Rangos de Calidad).
// Valida y guarda la lectura; si llega repetida (mismo idLectura) no la duplica. [datos]
export async function registrarLecturaDePlaca({ placa, sentido, idLectura = null }, ahora = new Date()) {
  const almacen = obtenerAlmacen();
  if (idLectura) {
    const repetida = almacen.lecturasDePlaca.find((l) => l.idLectura === idLectura);
    if (repetida) return { lectura: { ...repetida }, repetida: true };
  }

  const validacion = validarLectura({ placa, sentido });
  if (validacion.error) return { error: validacion.error };

  const lectura = { id: crypto.randomUUID(), idLectura, ...validacion, hora: ahora.toISOString() };
  almacen.lecturasDePlaca.push(lectura);
  return { lectura: { ...lectura } };
}

// Devuelve las últimas placas leídas, la más reciente primero (HU 3.2). [datos]
export async function listarLecturasDePlaca(limite = 50) {
  return obtenerAlmacen().lecturasDePlaca.slice(-limite).reverse().map((l) => ({ ...l }));
}
