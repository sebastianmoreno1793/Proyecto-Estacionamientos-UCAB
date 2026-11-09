import { NextResponse } from "next/server";
import { sugerirParaEdificio } from "@/lib/sugerencia/datos";

export const dynamic = "force-dynamic";

// HU 7.2 · Sugerir el estacionamiento libre más cercano a un edificio.
//   GET /api/sugerencia?edificio=edif-aulas
// 200 → { edificio, sugerido: { id, nombre, libres, capacidad, distancia }, alternativas: [...] }
// 400 → falta el edificio · 404 → el edificio no existe
// 409 → el edificio existe pero no se puede sugerir (sin ubicación, o todo lleno o cerrado)
// No pide sesión: como el mapa, solo muestra datos públicos (sin placas ni correos).
// La llama la pantalla /sugerencia con fetch, y se puede probar desde Postman.
const ESTADO_POR_MOTIVO = { no_existe: 404, sin_ubicacion: 409, sin_puestos: 409 };

export async function GET(request) {
  const edificio = new URL(request.url).searchParams.get("edificio");
  if (!edificio) {
    return NextResponse.json({ error: "Falta el edificio: /api/sugerencia?edificio=<id>" }, { status: 400 });
  }
  const resultado = await sugerirParaEdificio(edificio);
  if (resultado.error) return NextResponse.json(resultado, { status: ESTADO_POR_MOTIVO[resultado.motivo] ?? 400 });
  return NextResponse.json(resultado);
}
