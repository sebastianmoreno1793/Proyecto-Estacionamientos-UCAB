import { NextResponse } from "next/server";
import { emitir } from "@/lib/eventos_en_vivo";
import { registrarLecturaDePlaca } from "@/lib/garita/datos";
import { esClaveDeSensorValida } from "@/lib/sensores";

export const dynamic = "force-dynamic";

// HU 3.2 Lectura de placas en la garita. Es el camino del lector de placas.
//   POST /api/garita/lecturas   encabezado x-clave-sensor
//   { "placa": "AB123CD", "sentido": "ENTRADA", "idLectura": "opcional, único" }
export async function POST(request) {
  if (!esClaveDeSensorValida(request.headers.get("x-clave-sensor"))) {
    return NextResponse.json({ error: "Falta la clave del sensor o no es válida (encabezado x-clave-sensor)." }, { status: 401 });
  }
  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo) return NextResponse.json({ error: "El cuerpo debe ser JSON." }, { status: 400 });

  const idLectura = typeof cuerpo.idLectura === "string" ? cuerpo.idLectura.slice(0, 100) : null;
  const resultado = await registrarLecturaDePlaca({ placa: cuerpo.placa, sentido: cuerpo.sentido, idLectura });
  if (resultado.error) return NextResponse.json({ error: resultado.error }, { status: 400 });

  // Al canal en vivo va el sentido y la hora, NO la placa (dato personal).
  if (!resultado.repetida) emitir("LECTURA_GARITA", { sentido: resultado.lectura.sentido, idLectura });
  return NextResponse.json({ lectura: resultado.lectura, repetida: Boolean(resultado.repetida) });
}
