// Endpoints del back. Las URL las conecta el front en front/app/api/estacionamientos/route.js
// (GET) y front/app/api/estacionamientos/[id]/route.js (PATCH).
import { ESTACIONAMIENTOS } from "../campus/estacionamientos.js";
import { cambiarEstacionamiento, listarEstacionamientos, vistaPublica } from "../logica/estacionamientos/datos.js";
import { emitir } from "../comun/eventos_en_vivo.js";
import { esAdministrador, usuarioDeLaPeticion } from "../seguridad/sesion.js";

// Estado de los estacionamientos para el mapa y el semáforo (HU 4.2), con su forma (HU 5.1).
//   GET /api/estacionamientos
// GET /api/estacionamientos · Devuelve los estacionamientos con libres, porcentaje y polígono (HU 4.2 y 5.1). Responde 200. [api] [postman]
export async function GET(request) {
  const forma = Object.fromEntries(ESTACIONAMIENTOS.map(({ id, poligono, pisos }) => [id, { poligono, pisos }]));
  const estacionamientos = (await listarEstacionamientos()).map((e) => ({ ...vistaPublica(e), ...forma[e.id] }));
  return Response.json({ estacionamientos });
}

// HU 5.4 (antes 10.1) Habilitar estacionamientos y fijar su capacidad. Mismas reglas que la
// página de administración; solo para el administrador.
//   PATCH /api/estacionamientos/est-labs   { "capacidad": 40, "activo": false }
// Lo que no se envía se queda como está.
// PATCH /api/estacionamientos/:id · Cambia capacidad o abierto/cerrado, solo el administrador (HU 5.4). Responde 200, 400, 403 o 404. [api] [postman] [sesion] [en-vivo]
export async function PATCH(request, { params }) {
  if (!esAdministrador(await usuarioDeLaPeticion(request))) {
    return Response.json({ error: "Solo el administrador puede cambiar los estacionamientos." }, { status: 403 });
  }
  const { id } = await params;
  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return Response.json({ error: "El cuerpo debe ser un objeto JSON." }, { status: 400 });
  }
  // «activo» tiene que ser true o false. Con Boolean("false") quedaría abierto sin querer.
  if (cuerpo.activo !== undefined && typeof cuerpo.activo !== "boolean") {
    return Response.json({ error: "«activo» debe ser true o false (sin comillas)." }, { status: 400 });
  }

  const actual = (await listarEstacionamientos()).find((e) => e.id === id);
  if (!actual) return Response.json({ error: "Ese estacionamiento no existe." }, { status: 404 });

  const resultado = await cambiarEstacionamiento(id, {
    capacidad: cuerpo.capacidad ?? actual.capacidad,
    activo: cuerpo.activo ?? actual.activo,
  });
  if (resultado.error) return Response.json({ error: resultado.error }, { status: 400 });

  const estacionamiento = vistaPublica(resultado.estacionamiento);
  emitir("ESTACIONAMIENTO", { estacionamiento });
  return Response.json({ estacionamiento });
}
