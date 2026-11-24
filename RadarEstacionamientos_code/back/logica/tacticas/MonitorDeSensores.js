// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Detecta el sensor que dejó de avisar (timeout)
// Táctica de DISPONIBILIDAD · Detectar fallas con timeout. Cada aviso de un sensor reinicia su
// reloj. Si pasa más del tiempo límite sin que un estacionamiento avise nada, su sensor se da por
// caído y el administrador lo ve en Administrar › Garita. El sistema sigue funcionando con los demás.
// El tiempo límite sale de TIEMPO_LIMITE_SENSOR_MIN (minutos); si no está, 30 minutos.

export class MonitorDeSensores {
  static MINUTOS_POR_DEFECTO = 30;

  #tiempoLimiteMs;
  #inicio;
  #ultimoAviso = new Map(); // estacionamientoId → fecha del último aviso

  constructor({ tiempoLimiteMinutos = MonitorDeSensores.minutosConfigurados(), ahora = new Date() } = {}) {
    this.#tiempoLimiteMs = tiempoLimiteMinutos * 60 * 1000;
    this.#inicio = ahora;
  }

  static minutosConfigurados() {
    const minutos = Number(process.env.TIEMPO_LIMITE_SENSOR_MIN);
    return minutos > 0 ? minutos : MonitorDeSensores.MINUTOS_POR_DEFECTO;
  }

  get tiempoLimiteMinutos() {
    return this.#tiempoLimiteMs / 60000;
  }

  // @HU-3.1 Recibir avisos de entrada y salida · Aaron — reinicia el reloj de ese sensor
  recibioAviso(estacionamientoId, ahora = new Date()) {
    this.#ultimoAviso.set(estacionamientoId, ahora);
  }

  // Un sensor que nunca avisó cuenta desde que arrancó el servidor.
  ultimoAvisoDe(estacionamientoId) {
    return this.#ultimoAviso.get(estacionamientoId) ?? null;
  }

  estaCaido(estacionamientoId, ahora = new Date()) {
    const desde = this.#ultimoAviso.get(estacionamientoId) ?? this.#inicio;
    return ahora - desde > this.#tiempoLimiteMs;
  }

  // De los ids que se le pasan, los que pasaron el tiempo límite sin avisar.
  // Devuelve [{ estacionamientoId, ultimoAviso (ISO o null), minutosSinAviso }].
  sensoresSinAviso(ids, ahora = new Date()) {
    return ids
      .filter((id) => this.estaCaido(id, ahora))
      .map((id) => {
        const ultimo = this.#ultimoAviso.get(id) ?? null;
        return {
          estacionamientoId: id,
          ultimoAviso: ultimo ? ultimo.toISOString() : null,
          minutosSinAviso: Math.floor((ahora - (ultimo ?? this.#inicio)) / 60000),
        };
      });
  }

  reiniciar(ahora = new Date()) {
    this.#ultimoAviso.clear();
    this.#inicio = ahora;
  }
}
