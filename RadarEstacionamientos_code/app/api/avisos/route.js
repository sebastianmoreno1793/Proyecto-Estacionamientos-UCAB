import { NextResponse } from "next/server";
import { registrarAviso, vistaPublica } from "@/lib/estacionamientos/datos";
import { emitir } from "@/lib/eventos_en_vivo";
import { esClaveDeSensorValida } from "@/lib/sensores";

export const dynamic = "force-dynamic";

const ESTADO_POR_MOTIVO = { no_existe: 404, tipo: 400, desactivado: 409, lleno: 409, vacio: 409 };

// HU 3.1 Recibir avisos de entrada y salida. Es el camino de los sensores de cada
// estacionamiento; el simulador y Postman entran por aquí igual que un sensor real (D-002).
//   POST /api/avisos   encabezado x-clave-sensor
//   { "estacionamientoId": "est-playa", "tipo": "ENTRADA", "idAviso": "opcional, único" }
export async function POST(request) {
  if (!esClaveDeSensorValida(request.headers.get("x-clave-sensor"))) {
    return NextResponse.json({ error: "Falta la clave del sensor o no es válida (encabezado x-clave-sensor)." }, { status: 401 });
  }
  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return NextResponse.json({ error: "El cuerpo debe ser un objeto JSON." }, { status: 400 });
  }
  if (typeof cuerpo.estacionamientoId !== "string" || !cuerpo.estacionamientoId) {
    return NextResponse.json({ error: "Falta estacionamientoId.", motivo: "falta_estacionamiento" }, { status: 400 });
  }

  const idAviso = typeof cuerpo.idAviso === "string" ? cuerpo.idAviso.slice(0, 100) : null;
  const resultado = await registrarAviso({ estacionamientoId: cuerpo.estacionamientoId, tipo: cuerpo.tipo, idAviso });
  if (resultado.error) {
    return NextResponse.json({ error: resultado.error, motivo: resultado.motivo }, { status: ESTADO_POR_MOTIVO[resultado.motivo] ?? 400 });
  }

  const respuesta = {
    movimiento: resultado.movimiento,
    estacionamiento: vistaPublica(resultado.estacionamiento),
    repetido: Boolean(resultado.repetido),
  };
  if (!resultado.repetido) emitir("AVISO", { movimiento: resultado.movimiento, estacionamiento: respuesta.estacionamiento });
  return NextResponse.json(respuesta);
}
