// Endpoint del back. La URL la conecta el front en front/app/api/pruebas/reiniciar/route.js.
import { reiniciarAlmacen } from "../comun/almacen.js";
import { listarEstacionamientos, vistaPublica } from "../logica/estacionamientos/datos.js";
import { emitir } from "../comun/eventos_en_vivo.js";
import { esAdministrador, usuarioDeLaPeticion } from "../seguridad/sesion.js";

// SOLO EN DESARROLLO: vuelve todo a los datos de ejemplo (ocupación, incidencias, avisos y
// lecturas). Sirve para repetir una demo o una prueba desde el mismo punto de partida.
// En producción esta ruta no existe (404).
//   POST /api/pruebas/reiniciar
// POST /api/pruebas/reiniciar · Vuelve a los datos de ejemplo; solo administrador y fuera de producción. Responde 200, 403 o 404. [api] [postman] [sesion] [en-vivo]
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
