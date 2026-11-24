// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Lo que cualquiera puede ver: libres, porcentaje y semáforo, sin datos personales
// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Con la forma (polígono y pisos) para dibujarlo
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Los cambios que manda el administrador
// DTO · Estacionamiento. Nunca sale el modelo «bruto»: va al mapa, a la API y al canal en vivo.
export class EstacionamientoDTO {
  constructor(datos) {
    Object.assign(this, datos);
  }

  // conForma: añade polígono y pisos (GET /api/estacionamientos, para el mapa).
  static desdeModelo(e, { conForma = false } = {}) {
    return new EstacionamientoDTO({
      id: e.id,
      nombre: e.nombre,
      etiqueta: e.etiqueta,
      soloProfesores: e.soloProfesores,
      capacidad: e.capacidad,
      ocupados: e.ocupados,
      libres: e.libres(),
      porcentaje: e.porcentaje(),
      activo: e.activo,
      semaforo: e.semaforo().aJSON(),
      ...(conForma ? { poligono: e.poligono } : {}),
      ...(conForma && e.pisos ? { pisos: e.pisos } : {}),
    });
  }

  // PATCH /api/estacionamientos/:id { capacidad?, activo? }: lo que no viene se queda como está.
  // Solo pasa la capacidad a número y toma «activo» si es true o false (el formato lo revisa el front).
  static cambiosDesdeCuerpo(cuerpo) {
    return {
      capacidad: cuerpo.capacidad === undefined || cuerpo.capacidad === null ? undefined : Number(cuerpo.capacidad),
      activo: typeof cuerpo.activo === "boolean" ? cuerpo.activo : undefined,
    };
  }
}
