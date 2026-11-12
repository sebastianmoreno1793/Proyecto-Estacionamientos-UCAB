// @HU-3.2 Simular sensores y placas · Aaron — Recibe las lecturas de placa del lector de la garita
// Endpoint del back. La URL la conecta el front en front/app/api/garita/lecturas/route.js.
import { emitir } from "../piezas_compartidas/eventos_en_vivo.js";
import { registrarLecturaDePlaca } from "../reglas_y_datos/garita/datos.js";
import { esClaveDeSensorValida } from "../control_de_acceso/clave_sensores.js";

// @HU-3.2 Simular sensores y placas · Aaron
// HU 3.2 Lectura de placas en la garita. Es el camino del lector de placas.
//   POST /api/garita/lecturas   encabezado x-clave-sensor
//   { "placa": "AB123CD", "sentido": "ENTRADA", "idLectura": "opcional, único" }
// POST /api/garita/lecturas · El lector de la garita envía una placa leída (HU 3.2). Responde 200, 400 o 401. [api] [postman] [en-vivo]
export async function POST(request) {
  if (!esClaveDeSensorValida(request.headers.get("x-clave-sensor"))) {
    return Response.json({ error: "Falta la clave del sensor o no es válida (encabezado x-clave-sensor)." }, { status: 401 });
  }
  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return Response.json({ error: "El cuerpo debe ser un objeto JSON." }, { status: 400 });
  }

  const idLectura = ["string", "number"].includes(typeof cuerpo.idLectura) ? String(cuerpo.idLectura).slice(0, 100) : null;
  const resultado = await registrarLecturaDePlaca({ placa: cuerpo.placa, sentido: cuerpo.sentido, idLectura });
  if (resultado.error) return Response.json({ error: resultado.error }, { status: 400 });

  // Al canal en vivo va el sentido y la hora, NO la placa (dato personal).
  if (!resultado.repetida) emitir("LECTURA_GARITA", { sentido: resultado.lectura.sentido, idLectura });
  return Response.json({ lectura: resultado.lectura, repetida: Boolean(resultado.repetida) });
}
