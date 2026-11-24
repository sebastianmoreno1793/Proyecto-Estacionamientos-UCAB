// @HU-2.1 Registrar mis vehículos · Samuel — Revisa la placa (6 o 7 letras y números) y que estén marca, modelo y color
// Validador · Vehículo. Que la placa no esté ya registrada es una regla de negocio: la revisa el back.
import { Validador } from "./Validador.js";

export class VehiculoValidador extends Validador {
  static LARGO_MAXIMO_TEXTO = 30;

  // "ab-123 cd" → "AB123CD"
  static normalizarPlaca(placa) {
    return String(placa ?? "").toUpperCase().replace(/[\s-]/g, "");
  }

  // Placas venezolanas: 6 o 7 letras y números, con al menos una letra y un número (AB123CD, AB1C23A…).
  static esPlacaValida(placa) {
    const p = VehiculoValidador.normalizarPlaca(placa);
    return /^[A-Z0-9]{6,7}$/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p);
  }

  revisar({ placa, marca, modelo, color }, anotar) {
    if (!VehiculoValidador.esPlacaValida(placa)) anotar("placa", "La placa no es válida. Escribe solo letras y números, por ejemplo AB123CD.");
    const limpios = { placa: VehiculoValidador.normalizarPlaca(placa) };
    const nombres = { marca: ["la", "La"], modelo: ["el", "El"], color: ["el", "El"] };
    for (const [campo, valor] of Object.entries({ marca, modelo, color })) {
      const texto = this.texto(valor);
      const [articulo, Articulo] = nombres[campo];
      if (texto === "") anotar(campo, `Falta ${articulo} ${campo} del vehículo.`);
      else if (texto.length > VehiculoValidador.LARGO_MAXIMO_TEXTO) {
        anotar(campo, `${Articulo} ${campo} no puede tener más de ${VehiculoValidador.LARGO_MAXIMO_TEXTO} caracteres.`);
      }
      limpios[campo] = texto;
    }
    return limpios;
  }
}
