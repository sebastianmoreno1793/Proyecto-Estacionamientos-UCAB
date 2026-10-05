// Capacidad y ocupación de EJEMPLO, no reales: falta confirmar la capacidad de cada
// estacionamiento (preguntas_abiertas.md #4). Los ocupados los calculará la HU 4.1 a
// partir de las entradas y salidas; aquí solo sirven para ver la página funcionando.
// Los estacionamientos (id y nombre) salen de `data/estacionamientos.js` (HU 5.1).
export const CAPACIDAD_DE_EJEMPLO = {
  "est-b": { capacidad: 80, ocupados: 66 },
  "est-c": { capacidad: 60, ocupados: 58 },
  "est-cincuentenario": { capacidad: 300, ocupados: 120 },
};

// Para un estacionamiento que se agregue al mapa y todavía no tenga capacidad aquí.
export const CAPACIDAD_POR_DEFECTO = { capacidad: 50, ocupados: 0 };
