// Endpoint del back. La URL la conecta el front en front/app/api/pruebas/reiniciar/route.js.
import { reiniciarAlmacen } from "../logica/almacen.js";
import { listarEstacionamientos, vistaPublica } from "../logica/estacionamientos/datos.js";
import { emitir } from "../logica/eventos_en_vivo.js";
import { esAdministrador, usuarioDeLaPeticion } from "../logica/sesion.js";

// SOLO EN DESARROLLO: vuelve todo a los datos de ejemplo (ocupación, incidencias, avisos y
// lecturas). Sirve para repetir una demo o una prueba desde el mismo punto de partida.
// En producción esta ruta no existe (404).
//   POST /api/pruebas/reiniciar
export async function POST(request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "No encontrado." }, { status: 404 });
  }
  if (!esAdministrador(await usuarioDeLaPeticion(request))) {
    return Response.json({ error: "Solo el administrador puede reiniciar." }, { status: 403 });
  }
  reiniciarAlmacen();
  const estacionamientos = (await listarEstacionamientos()).map(vistaPublica);
  emitir("REINICIO", { estacionamientos });
  return Response.json({ ok: true, estacionamientos });
}
