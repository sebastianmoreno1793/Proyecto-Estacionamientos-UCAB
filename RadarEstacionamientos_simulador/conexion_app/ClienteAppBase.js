// @HU-3.2 Simular sensores y placas · Aaron — llamadas del simulador a la API de la app
// ClienteAppBase · Llamadas a la app base desde el navegador del simulador, a través del puente
// `/api/base/...` (PuenteAppBase). Cada llamada devuelve también lo que el registro necesita
// para mostrarla como en Postman: método, ruta, estado HTTP y tiempo.
export class ClienteAppBase {
  static URL_EVENTOS = "/api/base/eventos";

  // Los mismos tipos que la app base (back/logica/modelos/Incidencia.js), con su ícono para los botones.
  static TIPOS_DE_INCIDENCIA = [
    { id: "bateria_descargada", nombre: "Batería descargada", icono: "🔋" },
    { id: "conos_atravesados", nombre: "Conos atravesados", icono: "🚧" },
    { id: "vehiculo_mal_estacionado", nombre: "Vehículo mal estacionado", icono: "🚗" },
  ];

  estacionamientos() {
    return this.#llamar("GET", "estacionamientos");
  }

  incidencias() {
    return this.#llamar("GET", "incidencias");
  }

  // @HU-3.1 Recibir avisos de entrada y salida · Aaron — POST /api/avisos
  aviso(estacionamientoId, tipo, idAviso) {
    return this.#llamar("POST", "avisos", { estacionamientoId, tipo, idAviso });
  }

  // @HU-3.2 Simular sensores y placas · Aaron — POST /api/garita/lecturas
  lecturaDePlaca(placa, sentido, idLectura) {
    return this.#llamar("POST", "garita/lecturas", { placa, sentido, idLectura });
  }

  reportarIncidencia(estacionamientoId, tipo) {
    return this.#llamar("POST", "incidencias", { estacionamientoId, tipo });
  }

  cambiarEstacionamiento(id, cambios) {
    return this.#llamar("PATCH", `estacionamientos/${id}`, cambios);
  }

  reiniciar() {
    return this.#llamar("POST", "pruebas/reiniciar");
  }

  // Solo en desarrollo (página /maqueta): guarda la imagen y la proyección en exportes/.
  // No pasa por el puente: es una ruta del propio simulador.
  async exportarMaqueta(resultado) {
    // @FETCH Simulador Maqueta › POST /api/exportar-maqueta — guarda la imagen del campus para usarla en el Mapa de la app
    const respuesta = await fetch("/api/exportar-maqueta", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(resultado),
    });
    return { ok: respuesta.ok, datos: await respuesta.json().catch(() => null) };
  }

  async #llamar(metodo, ruta, cuerpo) {
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
}
