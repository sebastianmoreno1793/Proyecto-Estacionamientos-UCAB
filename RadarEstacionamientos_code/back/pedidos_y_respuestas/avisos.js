// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Recibe los avisos de entrada y salida que mandan los sensores
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Con cada aviso, actualiza el aforo del estacionamiento
// Endpoint del back. La URL la conecta el front en front/app/api/avisos/route.js.
import { registrarAviso, vistaPublica } from "../reglas_y_datos/estacionamientos/datos.js";
import { emitir } from "../piezas_compartidas/eventos_en_vivo.js";
import { esClaveDeSensorValida } from "../control_de_acceso/clave_sensores.js";

const ESTADO_POR_MOTIVO = { no_existe: 404, tipo: 400, lleno: 409, vacio: 409 };

// @HU-3.1 Recibir avisos de entrada y salida · Aaron
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
// HU 3.1 Recibir avisos de entrada y salida. Es el camino de los sensores de cada
// estacionamiento; el simulador y Postman entran por aquí igual que un sensor real (D-002).
//   POST /api/avisos   encabezado x-clave-sensor
//   { "estacionamientoId": "est-playa", "tipo": "ENTRADA", "idAviso": "opcional" }
// POST /api/avisos · El sensor avisa una entrada o salida (HU 3.1 y 4.1). Responde 200, 400, 401, 404 o 409. [api] [postman] [en-vivo]
export async function POST(request) {
  if (!esClaveDeSensorValida(request.headers.get("x-clave-sensor"))) {
    return Response.json({ error: "Falta la clave del sensor o no es válida (encabezado x-clave-sensor)." }, { status: 401 });
  }
  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return Response.json({ error: "El cuerpo debe ser un objeto JSON." }, { status: 400 });
  }
  if (typeof cuerpo.estacionamientoId !== "string" || !cuerpo.estacionamientoId) {
    return Response.json({ error: "Falta estacionamientoId.", motivo: "falta_estacionamiento" }, { status: 400 });
  }

  // El id del aviso puede llegar como texto o número (Postman, sensores); se guarda como texto.
  const idAviso = ["string", "number"].includes(typeof cuerpo.idAviso) ? String(cuerpo.idAviso).slice(0, 100) : null;
  const resultado = await registrarAviso({ estacionamientoId: cuerpo.estacionamientoId, tipo: cuerpo.tipo, idAviso });
  if (resultado.error) {
    return Response.json({ error: resultado.error, motivo: resultado.motivo }, { status: ESTADO_POR_MOTIVO[resultado.motivo] ?? 400 });
  }

  const respuesta = { movimiento: resultado.movimiento, estacionamiento: vistaPublica(resultado.estacionamiento) };
  emitir("AVISO", { movimiento: resultado.movimiento, estacionamiento: respuesta.estacionamiento });
  return Response.json(respuesta);
}
