import { NextResponse } from "next/server";
import { obtenerAlmacen } from "@/lib/almacen";
import { puestosLibres } from "@/lib/estacionamientos/reglas";
import { emitirEventoSimulacion } from "../stream/route";

export const dynamic = "force-dynamic";

// HU 3.1 Recibir avisos de entrada y salida (vía Postman o interfaz)
// y notificar en vivo al mapa 3D (HU 3.2).
export async function POST(request) {
  try {
    const cuerpo = await request.json();
    const { estacionamientoId = "est-playa", tipo = "ENTRADA", placa = "UCAB-01" } = cuerpo;

    const tipoNormalizado = String(tipo).toUpperCase().trim();
    if (!["ENTRADA", "SALIDA"].includes(tipoNormalizado)) {
      return NextResponse.json(
        { error: "Tipo inválido: debe ser 'ENTRADA' o 'SALIDA'." },
        { status: 400 }
      );
    }

    const almacen = obtenerAlmacen();
    const estacionamiento = almacen.estacionamientos.find((e) => e.id === estacionamientoId);

    if (!estacionamiento) {
      return NextResponse.json(
        { error: `El estacionamiento '${estacionamientoId}' no existe.` },
        { status: 404 }
      );
    }

    if (!estacionamiento.activo) {
      return NextResponse.json(
        { error: `El estacionamiento '${estacionamiento.nombre}' está desactivado actualmente.` },
        { status: 400 }
      );
    }

    // Actualizar ocupación
    if (tipoNormalizado === "ENTRADA") {
      if (estacionamiento.ocupados >= estacionamiento.capacidad) {
        return NextResponse.json(
          {
            error: `El estacionamiento '${estacionamiento.nombre}' está lleno (capacidad máxima alcanzada).`,
            estacionamiento,
          },
          { status: 409 }
        );
      }
      estacionamiento.ocupados += 1;
    } else {
      estacionamiento.ocupados = Math.max(0, estacionamiento.ocupados - 1);
    }

    const libres = puestosLibres(estacionamiento);
    const porcentaje = Math.round((estacionamiento.ocupados / estacionamiento.capacidad) * 100);

    const resultado = {
      ok: true,
      mensaje: `Registrada ${tipoNormalizado} en ${estacionamiento.nombre}`,
      evento: {
        tipo: tipoNormalizado,
        estacionamientoId,
        nombre: estacionamiento.nombre,
        placa: String(placa).toUpperCase(),
        timestamp: new Date().toISOString(),
      },
      estacionamiento: {
        id: estacionamiento.id,
        nombre: estacionamiento.nombre,
        capacidad: estacionamiento.capacidad,
        ocupados: estacionamiento.ocupados,
        puestosLibres: libres,
        porcentajeOcupacion: porcentaje,
      },
    };

    // Emitir al lienzo 3D
    emitirEventoSimulacion(resultado);

    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando el evento de simulación: " + error.message },
      { status: 500 }
    );
  }
}
