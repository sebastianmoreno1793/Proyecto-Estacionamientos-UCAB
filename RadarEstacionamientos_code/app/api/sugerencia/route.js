import { NextResponse } from "next/server";
import { sugerirParaEdificio } from "@/lib/sugerencia/datos";

export const dynamic = "force-dynamic";

// HU 7.2 · Sugerir el estacionamiento libre más cercano a un edificio.
//   GET /api/sugerencia?edificio=edif-aulas
// 200 → { edificio, sugerido: { id, nombre, libres, capacidad, distancia }, alternativas: [...] }
// 400 → falta el edificio · 404 → no hay sugerencia (edificio sin ubicación o todo lleno)
// La llama la pantalla /sugerencia con fetch, y se puede probar desde Postman.
export async function GET(request) {
  const edificio = new URL(request.url).searchParams.get("edificio");
  if (!edificio) {
    return NextResponse.json({ error: "Falta el edificio: /api/sugerencia?edificio=<id>" }, { status: 400 });
  }
  const resultado = await sugerirParaEdificio(edificio);
  if (resultado.error) return NextResponse.json(resultado, { status: 404 });
  return NextResponse.json(resultado);
}
