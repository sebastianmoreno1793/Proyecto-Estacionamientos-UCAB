// @HU-3.2 Simular sensores y placas · Aaron — Valida la placa leída y el sentido (ENTRADA o SALIDA)
// Reglas del lector de placas de la garita (HU 3.2). Funciones puras.

export const SENTIDOS = ["ENTRADA", "SALIDA"];

// Las placas siguen las mismas reglas que en «Mis vehículos» (HU 2.1): 6 o 7 letras y números,
// con al menos una letra y un número. Se aceptan con espacios o guiones y se guardan en
// mayúsculas y sin separadores. Una sola regla para las dos HU.
import { esPlacaValida, normalizarPlaca } from "../vehiculos/reglas.js";

export { normalizarPlaca };

// @HU-3.2 Simular sensores y placas · Aaron
// Valida la placa y el sentido (HU 3.2). Los devuelve normalizados o { error }. [regla]
export function validarLectura({ placa, sentido }) {
  const normalizada = normalizarPlaca(placa);
  if (!esPlacaValida(normalizada)) {
    return { error: "La placa debe tener 6 o 7 letras y números." };
  }
  const sentidoNormalizado = String(sentido ?? "").toUpperCase().trim();
  if (!SENTIDOS.includes(sentidoNormalizado)) {
    return { error: "El sentido debe ser ENTRADA o SALIDA." };
  }
  return { placa: normalizada, sentido: sentidoNormalizado };
}
