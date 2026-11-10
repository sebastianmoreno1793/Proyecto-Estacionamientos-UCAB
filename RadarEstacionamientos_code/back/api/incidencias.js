// Endpoint del back. La URL la conecta el front en front/app/api/incidencias/route.js.
import { emitir } from "../comun/eventos_en_vivo.js";
import { listarIncidencias, registrarIncidencia, vistaPublica } from "../logica/incidencias/datos.js";
import { usuarioDeLaPeticion } from "../seguridad/sesion.js";

// HU 9.1 Reportar una incidencia. Mismas reglas que el formulario de la app.
//   GET  /api/incidencias
//   POST /api/incidencias   { "estacionamientoId": "est-playa", "tipo": "conos_atravesados" }
//   tipos: bateria_descargada · conos_atravesados · vehiculo_mal_estacionado
// GET /api/incidencias · Lista las incidencias sin el correo de quien reporta; pide sesión (HU 9.1). Responde 200 o 401. [api] [postman] [sesion]
export async function GET(request) {
  if (!(await usuarioDeLaPeticion(request))) {
    return Response.json({ error: "Inicia sesión para ver las incidencias." }, { status: 401 });
  }
  return Response.json({ incidencias: (await listarIncidencias()).map(vistaPublica) });
}

// POST /api/incidencias · Registra una incidencia a nombre del usuario con sesión (HU 9.1). Responde 201, 400 o 401. [api] [postman] [sesion] [en-vivo]
export async function POST(request) {
  const usuario = await usuarioDeLaPeticion(request);
  if (!usuario) return Response.json({ error: "Inicia sesión para reportar una incidencia." }, { status: 401 });

  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return Response.json({ error: "El cuerpo debe ser un objeto JSON." }, { status: 400 });
  }

  const resultado = await registrarIncidencia({
    estacionamientoId: cuerpo.estacionamientoId,
    tipo: cuerpo.tipo,
    reportadaPor: usuario.correo,
  });
  if (resultado.error) return Response.json({ error: resultado.error }, { status: 400 });

  const incidencia = vistaPublica(resultado.incidencia);
  emitir("INCIDENCIA", { incidencia });
  return Response.json({ incidencia }, { status: 201 });
}
