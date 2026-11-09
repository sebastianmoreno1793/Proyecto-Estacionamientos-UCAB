// HU 2.1 Registrar mis vehículos. Reglas puras, se prueban con npm test.

export const LARGO_MAXIMO_TEXTO = 30;

// "ab-123 cd" -> "AB123CD"
export function normalizarPlaca(placa) {
  return String(placa ?? "")
    .toUpperCase()
    .replace(/[\s-]/g, "");
}

// Placas venezolanas: 6 o 7 letras y números (carros AB123CD, motos AB1C23A...).
export function esPlacaValida(placa) {
  const p = normalizarPlaca(placa);
  return /^[A-Z0-9]{6,7}$/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p);
}

function limpiar(texto) {
  return String(texto ?? "").trim();
}

export function validarVehiculo({ placa, marca, modelo, color }) {
  if (!esPlacaValida(placa)) {
    return { error: "La placa no es válida. Escribe solo letras y números, por ejemplo AB123CD." };
  }
  for (const [nombre, valor] of [
    ["marca", marca],
    ["modelo", modelo],
    ["color", color],
  ]) {
    const texto = limpiar(valor);
    if (texto === "") return { error: `Falta el ${nombre} del vehículo.` };
    if (texto.length > LARGO_MAXIMO_TEXTO) {
      return { error: `El ${nombre} no puede tener más de ${LARGO_MAXIMO_TEXTO} caracteres.` };
    }
  }
  return {
    vehiculo: {
      placa: normalizarPlaca(placa),
      marca: limpiar(marca),
      modelo: limpiar(modelo),
      color: limpiar(color),
    },
  };
}
