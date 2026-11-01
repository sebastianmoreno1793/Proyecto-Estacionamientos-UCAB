import { NextResponse } from "next/server";
import { emitir } from "@/lib/eventos_en_vivo";
import { listarIncidencias, registrarIncidencia, vistaPublica } from "@/lib/incidencias/datos";
import { obtenerUsuarioActual } from "@/lib/sesion";

export const dynamic = "force-dynamic";

// HU 9.1 Reportar una incidencia. Mismas reglas que el formulario de la app.
//   GET  /api/incidencias
//   POST /api/incidencias   { "estacionamientoId": "est-playa", "tipo": "conos_atravesados" }
//   tipos: bateria_descargada · conos_atravesados · vehiculo_mal_estacionado
export async function GET() {
  if (!(await obtenerUsuarioActual())) {
    return NextResponse.json({ error: "Inicia sesión para ver las incidencias." }, { status: 401 });
  }
  return NextResponse.json({ incidencias: (await listarIncidencias()).map(vistaPublica) });
}

export async function POST(request) {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) return NextResponse.json({ error: "Inicia sesión para reportar una incidencia." }, { status: 401 });

  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo) return NextResponse.json({ error: "El cuerpo debe ser JSON." }, { status: 400 });

  const resultado = await registrarIncidencia({
    estacionamientoId: cuerpo.estacionamientoId,
    tipo: cuerpo.tipo,
    reportadaPor: usuario.correo,
  });
  if (resultado.error) return NextResponse.json({ error: resultado.error }, { status: 400 });

  const incidencia = vistaPublica(resultado.incidencia);
  emitir("INCIDENCIA", { incidencia });
  return NextResponse.json({ incidencia }, { status: 201 });
}
