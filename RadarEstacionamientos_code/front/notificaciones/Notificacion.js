/**
 * Notificación web que el sistema puede mostrar al usuario. [notificaciones]
 */
export class Notificacion {
  /**
   * Crea la notificación con título, cuerpo, ícono y la URL que abre al tocarla. [notificaciones]
   * @param {{ titulo: string, cuerpo: string, icono?: string, url?: string }} datos
   */
  constructor({ titulo, cuerpo, icono = "/icono-192.png", url = "/" }) {
    this.titulo = titulo;
    this.cuerpo = cuerpo;
    this.icono = icono;
    this.url = url;
  }

  /**
   * Convierte la notificación al formato de `registration.showNotification()`. [notificaciones]
   * @returns {{ body: string, icon: string, data: { url: string } }}
   */
  aOpcionesDeVisualizacion() {
    return {
      body: this.cuerpo,
      icon: this.icono,
      data: { url: this.url },
    };
  }

  /**
   * Muestra esta notificación a través de un Service Worker ya activo.
   * La llama GestorNotificaciones al enviar la prueba. [notificaciones]
   * @param {ServiceWorkerRegistration} registro
   * @returns {Promise<void>}
   */
  async mostrarEn(registro) {
    if (!registro) return;
    await registro.showNotification(this.titulo, this.aOpcionesDeVisualizacion());
  }

  /**
   * Crea la notificación de prueba que se dispara al activar el permiso (HU 8.1). [notificaciones]
   * @returns {Notificacion}
   */
  static dePrueba() {
    return new Notificacion({
      titulo: "Radar UCAB",
      cuerpo:
        "¡Notificaciones configuradas correctamente! Te avisaremos cuando haya puestos disponibles.",
      icono: "/icono-192.png",
      url: "/",
    });
  }
}
