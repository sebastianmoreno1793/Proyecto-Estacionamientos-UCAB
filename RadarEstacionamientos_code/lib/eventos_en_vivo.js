// Canal en vivo de la app (Server-Sent Events, `GET /api/eventos`): avisa al instante a
// quien esté mirando que algo cambió (HU 4.3). Lo usan el mapa y cualquier cliente externo.
//
// ⚠️ Lo que se emite lo ve cualquiera conectado: nunca placas ni correos.

// En globalThis para que sobreviva a las recargas de `next dev`.
globalThis.__radarSuscriptores ??= new Set();

export function suscribir(enviar) {
  globalThis.__radarSuscriptores.add(enviar);
  return () => globalThis.__radarSuscriptores.delete(enviar);
}

export function emitir(clase, datos = {}) {
  const mensaje = { clase, hora: new Date().toISOString(), ...datos };
  for (const enviar of globalThis.__radarSuscriptores) {
    try {
      enviar(mensaje);
    } catch {
      globalThis.__radarSuscriptores.delete(enviar);
    }
  }
  return mensaje;
}
