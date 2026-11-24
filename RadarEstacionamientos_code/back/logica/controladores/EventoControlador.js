// Controlador · Canal en vivo (Server-Sent Events): cada cambio de la app llega al instante (HU 4.3).
//   GET /api/eventos
// Clases de mensaje: CONEXION, AVISO, LECTURA_GARITA, INCIDENCIA, ESTACIONAMIENTO, SENSOR_CON_FALLA, REINICIO.
import { Controlador } from "./Controlador.js";

export class EventoControlador extends Controlador {
  static LATIDO_MS = 25000;

  #eventos;

  constructor({ eventos }) {
    super();
    this.#eventos = eventos;
  }

  // GET /api/eventos · Deja la conexión abierta mandando cada cambio. Responde 200 (text/event-stream). [api] [postman] [simulador] [en-vivo]
  abrir(peticion) {
    const codificador = new TextEncoder();
    const eventos = this.#eventos;
    let cancelar = () => {};

    const flujo = new ReadableStream({
      start(controlador) {
        const enviar = (mensaje) => controlador.enqueue(codificador.encode(`data: ${JSON.stringify(mensaje)}\n\n`));
        const desuscribir = eventos.suscribir(enviar);
        // Un comentario cada 25 s para que proxies y navegadores no cierren la conexión.
        const latido = setInterval(() => {
          try {
            controlador.enqueue(codificador.encode(": latido\n\n"));
          } catch {
            cancelar(); // el flujo ya se cerró sin avisar
          }
        }, EventoControlador.LATIDO_MS);
        cancelar = () => {
          clearInterval(latido);
          desuscribir();
        };
        peticion.signal.addEventListener("abort", () => {
          cancelar();
          try {
            controlador.close();
          } catch {
            // ya estaba cerrado
          }
        });
        enviar({ clase: "CONEXION", hora: new Date().toISOString() });
      },
      cancel() {
        cancelar();
      },
    });

    return new Response(flujo, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // detrás de nginx, que no acumule los mensajes
      },
    });
  }
}
