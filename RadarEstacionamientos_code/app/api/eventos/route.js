import { suscribir } from "@/lib/eventos_en_vivo";

export const dynamic = "force-dynamic";

// Canal en vivo (Server-Sent Events): cada cambio de la app llega al instante (HU 4.3).
//   GET /api/eventos
// Clases de mensaje: AVISO, LECTURA_GARITA, INCIDENCIA, ESTACIONAMIENTO, REINICIO.
export async function GET(request) {
  const codificador = new TextEncoder();
  let cancelar = () => {};

  const flujo = new ReadableStream({
    start(controlador) {
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
