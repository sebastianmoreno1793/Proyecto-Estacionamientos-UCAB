// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Recibe el edificio y responde el estacionamiento sugerido
// Endpoint del back. La URL la conecta el front en front/app/api/sugerencia/route.js.
import { sugerirParaEdificio } from "../logica/sugerencia/datos.js";

// HU 7.2 · Sugerir el estacionamiento libre más cercano a un edificio.
//   GET /api/sugerencia?edificio=edif-aulas
// 200 → { edificio, sugerido: { id, nombre, libres, capacidad, distancia }, alternativas: [...] }
// 400 → falta el edificio · 404 → el edificio no existe
// 409 → el edificio existe pero no se puede sugerir (sin ubicación, o todo lleno o cerrado)
// No pide sesión: como el mapa, solo muestra datos públicos (sin placas ni correos).
// La llama la pantalla /sugerencia con fetch, y se puede probar desde Postman.
const ESTADO_POR_MOTIVO = { no_existe: 404, sin_ubicacion: 409, sin_puestos: 409 };

// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
// GET /api/sugerencia?edificio=<id> · Sugiere el estacionamiento libre más cercano al edificio (HU 7.2). Responde 200, 400, 404 o 409. [api] [postman]
export async function GET(request) {
  const edificio = new URL(request.url).searchParams.get("edificio");
  if (!edificio) {
    return Response.json({ error: "Falta el edificio: /api/sugerencia?edificio=<id>" }, { status: 400 });
  }
  const resultado = await sugerirParaEdificio(edificio);
  if (resultado.error) return Response.json(resultado, { status: ESTADO_POR_MOTIVO[resultado.motivo] ?? 400 });
  return Response.json(resultado);
}
