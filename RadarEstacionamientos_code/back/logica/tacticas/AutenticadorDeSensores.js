// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Solo quien tiene la clave de los sensores puede avisar entradas y salidas
// @HU-3.2 Simular sensores y placas · Aaron — Solo el lector de placas (o el simulador) con la clave puede mandar placas
// Táctica de SEGURIDAD · Autenticar actores. Revisa el encabezado `x-clave-sensor` que comparten los
// sensores, el lector de placas, el simulador y Postman con la app. En producción la clave sale de
// la variable de entorno CLAVE_SENSORES; en desarrollo, si no está, vale la de `.env.example`.
import { timingSafeEqual } from "node:crypto";

export class AutenticadorDeSensores {
  static ENCABEZADO = "x-clave-sensor";
  static CLAVE_DE_DESARROLLO = "clave-de-desarrollo";

  #clave;

  constructor(clave = AutenticadorDeSensores.claveConfigurada()) {
    this.#clave = clave;
  }

  // La de CLAVE_SENSORES o, fuera de producción, la de desarrollo. En producción sin clave: null (no entra nadie).
  static claveConfigurada() {
    if (process.env.CLAVE_SENSORES) return process.env.CLAVE_SENSORES;
    return process.env.NODE_ENV === "production" ? null : AutenticadorDeSensores.CLAVE_DE_DESARROLLO;
  }

  // Compara en tiempo constante (no da pistas de cuántas letras acertó).
  esClaveValida(recibida) {
    if (!this.#clave || typeof recibida !== "string") return false;
    const a = Buffer.from(recibida);
    const b = Buffer.from(this.#clave);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  // @HU-3.1 Recibir avisos de entrada y salida · Aaron
  // true si la petición trae la clave correcta. Si no, el controlador responde 401.
  verificar(peticion) {
    return this.esClaveValida(peticion.headers.get(AutenticadorDeSensores.ENCABEZADO));
  }
}
