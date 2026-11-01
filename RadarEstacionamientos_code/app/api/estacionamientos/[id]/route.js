import { NextResponse } from "next/server";
import { cambiarEstacionamiento, listarEstacionamientos, vistaPublica } from "@/lib/estacionamientos/datos";
import { emitir } from "@/lib/eventos_en_vivo";
import { esAdministrador, obtenerUsuarioActual } from "@/lib/sesion";

export const dynamic = "force-dynamic";

// HU 5.4 (antes 10.1) Habilitar estacionamientos y fijar su capacidad. Mismas reglas que la
// página de administración; solo para el administrador.
//   PATCH /api/estacionamientos/est-labs   { "capacidad": 40, "activo": false }
// Lo que no se envía se queda como está.
export async function PATCH(request, { params }) {
  if (!esAdministrador(await obtenerUsuarioActual())) {
    return NextResponse.json({ error: "Solo el administrador puede cambiar los estacionamientos." }, { status: 403 });
  }
  const { id } = await params;
  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo) return NextResponse.json({ error: "El cuerpo debe ser JSON." }, { status: 400 });

  const actual = (await listarEstacionamientos()).find((e) => e.id === id);
  if (!actual) return NextResponse.json({ error: "Ese estacionamiento no existe." }, { status: 404 });

  const resultado = await cambiarEstacionamiento(id, {
    capacidad: cuerpo.capacidad ?? actual.capacidad,
    activo: cuerpo.activo ?? actual.activo,
  });
  if (resultado.error) return NextResponse.json({ error: resultado.error }, { status: 400 });

  const estacionamiento = vistaPublica(resultado.estacionamiento);
  emitir("ESTACIONAMIENTO", { estacionamiento });
  return NextResponse.json({ estacionamiento });
}
