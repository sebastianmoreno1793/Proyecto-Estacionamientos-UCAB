// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Capacidad de ejemplo (todavía no real) de cada estacionamiento
// Capacidad y ocupación de EJEMPLO, no reales: falta confirmar la capacidad de cada
// estacionamiento (preguntas_abiertas.md #4). Los ocupados los calculará la HU 4.1 a
// partir de las entradas y salidas; aquí solo sirven para ver la página funcionando.
// Los estacionamientos (id, nombre, zonas de profesores) salen de `campus/estacionamientos.js` (HU 5.1).
export const CAPACIDAD_DE_EJEMPLO = {
  "est-playa": { capacidad: 150, ocupados: 120 },
  "est-postgrado": { capacidad: 60, ocupados: 52 },
  "est-centro-estudiantes": { capacidad: 80, ocupados: 30 },
  "est-labs": { capacidad: 40, ocupados: 38 },
  "est-cincuentenario": { capacidad: 100, ocupados: 60 },
  "est-sambilito": { capacidad: 300, ocupados: 210 },
  "est-presambilito-oeste": { capacidad: 30, ocupados: 12 },
  "est-presambilito": { capacidad: 60, ocupados: 55 },
  "est-padel": { capacidad: 40, ocupados: 10 },
  "est-padel-norte": { capacidad: 25, ocupados: 5 },
  "prof-centro-cultural": { capacidad: 20, ocupados: 14 },
  "prof-postgrado": { capacidad: 15, ocupados: 15 },
  "prof-aulas": { capacidad: 20, ocupados: 8 },
  "prof-presambilito": { capacidad: 30, ocupados: 29 },
};

// Para un estacionamiento que se agregue al mapa y todavía no tenga capacidad aquí.
export const CAPACIDAD_POR_DEFECTO = { capacidad: 50, ocupados: 0 };
