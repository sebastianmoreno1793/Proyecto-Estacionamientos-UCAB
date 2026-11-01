// Reglas del lector de placas de la garita (HU 3.2). Funciones puras.

export const SENTIDOS = ["ENTRADA", "SALIDA"];

// Placas venezolanas: 6 o 7 letras y números (AB123CD, ABC12D…). Se aceptan con espacios o
// guiones, como las escriba el lector, y se guardan en mayúsculas y sin separadores.
export function normalizarPlaca(texto) {
  return String(texto ?? "").toUpperCase().replace(/[\s-]/g, "");
}

export function validarLectura({ placa, sentido }) {
  const normalizada = normalizarPlaca(placa);
  if (!/^[A-Z0-9]{6,7}$/.test(normalizada)) {
    return { error: "La placa debe tener 6 o 7 letras y números." };
  }
  const sentidoNormalizado = String(sentido ?? "").toUpperCase().trim();
  if (!SENTIDOS.includes(sentidoNormalizado)) {
    return { error: "El sentido debe ser ENTRADA o SALIDA." };
  }
  return { placa: normalizada, sentido: sentidoNormalizado };
}
