// @HU-2.1 Registrar mis vehículos · Samuel — reglas de la placa (las usa también la garita, HU 3.2)
// HU 2.1 Registrar mis vehículos. Reglas puras, se prueban con npm test.

export const LARGO_MAXIMO_TEXTO = 30;

// @HU-2.1 Registrar mis vehículos · Samuel
// @HU-3.2 Simular sensores y placas · Aaron — la misma regla para la garita
// "ab-123 cd" -> "AB123CD"
// Pasa la placa a mayúsculas y quita espacios y guiones (HU 2.1). [regla]
export function normalizarPlaca(placa) {
  return String(placa ?? "")
    .toUpperCase()
    .replace(/[\s-]/g, "");
}

// @HU-2.1 Registrar mis vehículos · Samuel
// @HU-3.2 Simular sensores y placas · Aaron — la misma regla para la garita
// Placas venezolanas: 6 o 7 letras y números (carros AB123CD, motos AB1C23A...). [regla]
export function esPlacaValida(placa) {
  const p = normalizarPlaca(placa);
  return /^[A-Z0-9]{6,7}$/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p);
}

// Quita los espacios de los extremos (texto vacío si no hay nada).
function limpiar(texto) {
  return String(texto ?? "").trim();
}

// @HU-2.1 Registrar mis vehículos · Samuel
// Valida placa, marca, modelo y color (HU 2.1). Devuelve { vehiculo } normalizado o { error }. [regla]
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
