import { NextResponse } from "next/server";
import { ESTACIONAMIENTOS } from "@/data/estacionamientos";
import { listarEstacionamientos, vistaPublica } from "@/lib/estacionamientos/datos";

export const dynamic = "force-dynamic";

// Estado de los estacionamientos para el mapa y el semáforo (HU 4.2), con su forma (HU 5.1).
//   GET /api/estacionamientos
export async function GET() {
  const forma = Object.fromEntries(ESTACIONAMIENTOS.map(({ id, poligono, pisos }) => [id, { poligono, pisos }]));
  const estacionamientos = (await listarEstacionamientos()).map((e) => ({ ...vistaPublica(e), ...forma[e.id] }));
  return NextResponse.json({ estacionamientos });
}
