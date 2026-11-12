// Endpoint del back. La URL la conecta el front en front/app/api/eventos/route.js.
import { suscribir } from "../piezas_compartidas/eventos_en_vivo.js";

// Canal en vivo (Server-Sent Events): cada cambio de la app llega al instante (HU 4.3).
//   GET /api/eventos
// Clases de mensaje: AVISO, LECTURA_GARITA, INCIDENCIA, ESTACIONAMIENTO, REINICIO.
// GET /api/eventos · Abre el canal en vivo y deja la conexión abierta mandando cada cambio (HU 4.3). Responde 200 (text/event-stream). [api] [postman] [en-vivo]
export async function GET(request) {
  const codificador = new TextEncoder();
  // Limpieza de la conexión; se define de verdad dentro de start(). [en-vivo]
  let cancelar = () => {};

  const flujo = new ReadableStream({
    // Arranca el flujo: suscribe al cliente, programa el latido y limpia todo si se desconecta. [en-vivo]
    start(controlador) {
      // Manda un mensaje al cliente con el formato SSE («data: {...}»). [en-vivo]
      const enviar = (mensaje) => controlador.enqueue(codificador.encode(`data: ${JSON.stringify(mensaje)}\n\n`));
      const desuscribir = suscribir(enviar);
      // Un comentario cada 25 s para que proxies y navegadores no cierren la conexión.
      const latido = setInterval(() => {
        try {
          controlador.enqueue(codificador.encode(": latido\n\n"));
        } catch {
          cancelar(); // el flujo ya se cerró sin avisar: se apaga el latido
        }
      }, 25000);
      // Apaga el latido y saca al cliente de la lista de suscriptores. [en-vivo]
      cancelar = () => {
        clearInterval(latido);
        desuscribir();
      };
      request.signal.addEventListener("abort", () => {
        cancelar();
        try {
          controlador.close();
        } catch {
          // ya estaba cerrado
        }
      });
      enviar({ clase: "CONEXION", hora: new Date().toISOString() });
    },
    // El cliente cerró el flujo: se limpia igual que al desconectarse. [en-vivo]
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
