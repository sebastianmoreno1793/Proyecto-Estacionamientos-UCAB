// Servicio · Canal en vivo (Server-Sent Events, GET /api/eventos, HU 4.3): avisa al instante a quien
// esté mirando que algo cambió. Lo usan el mapa, el Inicio y cualquier cliente externo (simulador).
// ⚠️ Lo que se emite lo ve cualquiera conectado: solo DTO públicos, nunca placas ni correos.
// Los suscriptores viven en globalThis para que sobrevivan a las recargas de `next dev`.

export class EventosEnVivoServicio {
  static #suscriptores() {
    globalThis.__radarSuscriptores ??= new Set();
    return globalThis.__radarSuscriptores;
  }

  // Agrega un cliente al canal; devuelve una función para darlo de baja.
  suscribir(enviar) {
    const suscriptores = EventosEnVivoServicio.#suscriptores();
    suscriptores.add(enviar);
    return () => suscriptores.delete(enviar);
  }

  // Envía { clase, hora, ...datos } a todos y quita a los que fallen. Clases: AVISO, LECTURA_GARITA,
  // INCIDENCIA, ESTACIONAMIENTO, SENSOR_CON_FALLA, REINICIO.
  emitir(clase, datos = {}) {
    const mensaje = JSON.parse(JSON.stringify({ clase, hora: new Date().toISOString(), ...datos }));
    const suscriptores = EventosEnVivoServicio.#suscriptores();
    for (const enviar of suscriptores) {
      try {
        enviar(mensaje);
      } catch {
        suscriptores.delete(enviar);
      }
    }
    return mensaje;
  }
}
