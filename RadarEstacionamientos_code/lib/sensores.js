import { timingSafeEqual } from "node:crypto";

// Clave que comparten los sensores y el lector de placas con la app (encabezado
// `x-clave-sensor`). En producción sale de la variable de entorno CLAVE_SENSORES; en
// desarrollo, si no está, vale la clave de prueba de `.env.example`.
const CLAVE_DE_DESARROLLO = "clave-de-desarrollo";

export function claveDeSensores() {
  if (process.env.CLAVE_SENSORES) return process.env.CLAVE_SENSORES;
  return process.env.NODE_ENV === "production" ? null : CLAVE_DE_DESARROLLO;
}

export function esClaveDeSensorValida(recibida, clave = claveDeSensores()) {
  if (!clave || typeof recibida !== "string") return false;
  const a = Buffer.from(recibida);
  const b = Buffer.from(clave);
  return a.length === b.length && timingSafeEqual(a, b);
}
