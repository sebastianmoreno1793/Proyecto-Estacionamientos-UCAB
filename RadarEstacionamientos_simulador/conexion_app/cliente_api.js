// @HU-3.2 Simular sensores y placas · Aaron — llamadas del simulador a la API de la app
// Llamadas a la app base desde el navegador del simulador, a través del puente
// `/api/base/...` (app/api/base/[...ruta]/route.js). Cada llamada devuelve también lo que
// el registro necesita para mostrarla como en Postman: método, ruta, estado HTTP y tiempo.

async function llamar(metodo, ruta, cuerpo) {
  const inicio = performance.now();
  let estado = 0;
  let datos = null;
  try {
    // @FETCH Simulador › /api/base/<ruta> — todo lo que el simulador le pide a la app pasa por aquí (avisos, placas, incidencias)
    const respuesta = await fetch(`/api/base/${ruta}`, {
      method: metodo,
      headers: cuerpo ? { "content-type": "application/json" } : undefined,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    estado = respuesta.status;
    datos = await respuesta.json().catch(() => null);
  } catch {
    datos = { error: "El simulador no responde." };
  }
  return {
    ok: estado >= 200 && estado < 300,
    estado,
    datos,
    metodo,
    ruta: `/api/${ruta}`,
    cuerpo,
    ms: Math.round(performance.now() - inicio),
  };
}

export const URL_EVENTOS = "/api/base/eventos";

// @HU-3.1 Recibir avisos de entrada y salida · Aaron — aviso → POST /api/avisos
// @HU-3.2 Simular sensores y placas · Aaron — lecturaDePlaca → POST /api/garita/lecturas
export const appBase = {
  estacionamientos: () => llamar("GET", "estacionamientos"),
  incidencias: () => llamar("GET", "incidencias"),
  aviso: (estacionamientoId, tipo, idAviso) => llamar("POST", "avisos", { estacionamientoId, tipo, idAviso }),
  lecturaDePlaca: (placa, sentido, idLectura) => llamar("POST", "garita/lecturas", { placa, sentido, idLectura }),
  reportarIncidencia: (estacionamientoId, tipo) => llamar("POST", "incidencias", { estacionamientoId, tipo }),
  cambiarEstacionamiento: (id, cambios) => llamar("PATCH", `estacionamientos/${id}`, cambios),
  reiniciar: () => llamar("POST", "pruebas/reiniciar"),
};

// Los mismos tipos que la app base (back/reglas_y_datos/incidencias/reglas.js), con su ícono para los botones.
export const TIPOS_DE_INCIDENCIA = [
  { id: "bateria_descargada", nombre: "Batería descargada", icono: "🔋" },
  { id: "conos_atravesados", nombre: "Conos atravesados", icono: "🚧" },
  { id: "vehiculo_mal_estacionado", nombre: "Vehículo mal estacionado", icono: "🚗" },
];
