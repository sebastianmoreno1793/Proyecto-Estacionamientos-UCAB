// Servicio · Canal en vivo (HU 4.3): escucha GET /api/eventos con EventSource y avisa cuando llega
// un mensaje de las clases pedidas (AVISO, ESTACIONAMIENTO, REINICIO…). [en-vivo]
export class EventosEnVivoServicio {
  #url;

  constructor(url = "/api/eventos") {
    this.#url = url;
  }

  // Llama a alRecibir(mensaje) con cada mensaje de esas clases. alConectar() corre al conectarse (y al
  // reconectar) y alCortarse() cuando se cae. Devuelve una función para dejar de escuchar.
  escuchar(clases, alRecibir, { alConectar = () => {}, alCortarse = () => {} } = {}) {
    if (typeof EventSource === "undefined") return () => {};
    const canal = new EventSource(this.#url);
    canal.onopen = () => alConectar();
    canal.onerror = () => alCortarse();
    canal.onmessage = (evento) => {
      try {
        const mensaje = JSON.parse(evento.data);
        if (clases.includes(mensaje.clase)) alRecibir(mensaje);
      } catch {
        // un mensaje que no es JSON se ignora
      }
    };
    return () => canal.close();
  }
}
