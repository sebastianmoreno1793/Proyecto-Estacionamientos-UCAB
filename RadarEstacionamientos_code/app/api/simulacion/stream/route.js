// Stream de eventos SSE (Server-Sent Events) en tiempo real para la simulación 3D.
// Permite que cuando Postman (o cualquier cliente) envíe una petición a /api/simulacion/evento,
// el lienzo 3D en el navegador reciba la notificación instantáneamente y anime el carro.

export const dynamic = "force-dynamic";

// Almacén de clientes conectados (sobrevive recargas de desarrollo en globalThis)
globalThis.__clientesSimulacion ??= new Set();

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const cliente = (datos) => {
    try {
      writer.write(encoder.encode(`data: ${JSON.stringify(datos)}\n\n`));
    } catch {
      // Si el cliente cerró la pestaña, lo eliminamos
      globalThis.__clientesSimulacion.delete(cliente);
    }
  };

  globalThis.__clientesSimulacion.add(cliente);

  // Mensaje inicial de conexión
  writer.write(
    encoder.encode(
      `data: ${JSON.stringify({ tipo: "CONEXION", mensaje: "Conectado al radar 3D" })}\n\n`
    )
  );

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

// Función para emitir eventos a todos los navegadores conectados
export function emitirEventoSimulacion(evento) {
  if (globalThis.__clientesSimulacion) {
    for (const cliente of globalThis.__clientesSimulacion) {
      try {
        cliente(evento);
      } catch {
        globalThis.__clientesSimulacion.delete(cliente);
      }
    }
  }
}
