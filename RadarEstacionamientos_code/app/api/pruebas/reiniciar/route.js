import { NextResponse } from "next/server";
import { reiniciarAlmacen } from "@/lib/almacen";
import { listarEstacionamientos, vistaPublica } from "@/lib/estacionamientos/datos";
import { emitir } from "@/lib/eventos_en_vivo";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";

export const dynamic = "force-dynamic";

// SOLO EN DESARROLLO: vuelve todo a los datos de ejemplo (ocupación, incidencias, avisos y
// lecturas). Sirve para repetir una demo o una prueba desde el mismo punto de partida.
// En producción esta ruta no existe (404).
//   POST /api/pruebas/reiniciar
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }
  if (!esAdministrador(await obtenerUsuarioActual())) {
    return NextResponse.json({ error: "Solo el administrador puede reiniciar." }, { status: 403 });
  }
  reiniciarAlmacen();
  const estacionamientos = (await listarEstacionamientos()).map(vistaPublica);
  emitir("REINICIO", { estacionamientos });
  return NextResponse.json({ ok: true, estacionamientos });
}
