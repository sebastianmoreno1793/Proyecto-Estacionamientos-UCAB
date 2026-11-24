// @HU-2.1 Registrar mis vehículos · Samuel — La placa se guarda en mayúsculas y sin espacios ni guiones
// @HU-3.2 Simular sensores y placas · Aaron — La garita guarda la placa igual que «Mis vehículos»
// Modelo · Placa de un vehículo. «ab-123 cd» y «AB123CD» son la misma placa: así el lector de la
// garita y «Mis vehículos» la reconocen igual. Que tenga 6 o 7 letras y números lo revisa el front
// (front/validadores/VehiculoValidador.js).

export class Placa {
  #texto;

  constructor(texto) {
    this.#texto = Placa.normalizar(texto);
  }

  // REGLA: mayúsculas y sin espacios ni guiones.
  static normalizar(texto) {
    return String(texto ?? "")
      .toUpperCase()
      .replace(/[\s-]/g, "");
  }

  estaVacia() {
    return this.#texto === "";
  }

  esIgualA(otra) {
    return this.#texto === new Placa(otra).toString();
  }

  toString() {
    return this.#texto;
  }
}
