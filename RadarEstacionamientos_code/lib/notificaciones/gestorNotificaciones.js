import { Notificacion } from "./Notificacion.js";

/**
 * Coordina permiso del navegador, preferencia en localStorage,
 * registro del Service Worker y el envío de notificaciones (HU 8.1).
 *
 * Las APIs del navegador se leen al usar cada método para no romper el
 * render del servidor de Next.js. En pruebas se inyectan por el constructor.
 */
export class GestorNotificaciones {
  static CLAVE_PREFERENCIA = "notificaciones_preferencia";
  static PREFERENCIA_ACTIVADAS = "activadas";
  static PREFERENCIA_BLOQUEADAS = "bloqueadas";
  static RUTA_SERVICE_WORKER = "/sw.js";

  /**
   * @param {{ notificationApi?: object, navigatorApi?: object, almacenamiento?: Storage, avisar?: Function } | null} apis
   */
  constructor(apis = null) {
    this.apis = apis;
  }

  #apiNotificacion() {
    if (this.apis) return this.apis.notificationApi ?? null;
    if (typeof window === "undefined" || typeof Notification === "undefined") {
      return null;
    }
    return Notification;
  }

  #navegador() {
    if (this.apis) return this.apis.navigatorApi ?? null;
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return null;
    }
    return navigator;
  }

  #almacenamiento() {
    if (this.apis) return this.apis.almacenamiento ?? null;
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }
    return localStorage;
  }

  #avisar(mensaje) {
    if (this.apis?.avisar) {
      this.apis.avisar(mensaje);
      return;
    }
    if (typeof alert === "function") {
      alert(mensaje);
    }
  }

  soportaNotificaciones() {
    return this.#apiNotificacion() != null;
  }

  soportaServiceWorker() {
    const navegador = this.#navegador();
    return Boolean(navegador && "serviceWorker" in navegador);
  }

  /**
   * @returns {NotificationPermission | "unsupported"}
   */
  obtenerEstadoPermiso() {
    const api = this.#apiNotificacion();
    if (!api) return "unsupported";
    return api.permission;
  }

  /**
   * Persiste la decisión del usuario para la HU 8.1.
   * @param {string} valor
   */
  guardarPreferencia(valor) {
    this.#almacenamiento()?.setItem(GestorNotificaciones.CLAVE_PREFERENCIA, valor);
  }

  obtenerPreferencia() {
    return this.#almacenamiento()?.getItem(GestorNotificaciones.CLAVE_PREFERENCIA) ?? null;
  }

  /**
   * Registra `/sw.js` y espera a que el worker quede activo.
   * @returns {Promise<ServiceWorkerRegistration|null>}
   */
  async registrarServiceWorker() {
    if (!this.soportaServiceWorker()) return null;

    try {
      const registro = await this.#navegador().serviceWorker.register(
        GestorNotificaciones.RUTA_SERVICE_WORKER,
      );
      await this.#navegador().serviceWorker.ready;
      return registro;
    } catch (error) {
      console.error("Error al registrar el Service Worker:", error);
      return null;
    }
  }

  /**
   * Muestra la notificación local de prueba con el Service Worker activo.
   * @returns {Promise<void>}
   */
  async enviarNotificacionPrueba() {
    if (!this.soportaServiceWorker()) return;
    if (this.obtenerEstadoPermiso() !== "granted") return;

    const registro = await this.#navegador().serviceWorker.ready;
    await Notificacion.dePrueba().mostrarEn(registro);
  }

  /**
   * Solicita el permiso al usuario. Si concede (`[OK]`), activa preferencia,
   * registra el Service Worker y dispara la notificación de prueba.
   * Si niega (`[cancelar]`), guarda la preferencia como bloqueadas.
   *
   * @returns {Promise<NotificationPermission | "unsupported">}
   */
  async pedirPermiso() {
    const api = this.#apiNotificacion();
    if (!api) {
      this.#avisar("Este navegador no soporta notificaciones web.");
      return "unsupported";
    }

    const permiso = await api.requestPermission();

    if (permiso === "granted") {
      this.guardarPreferencia(GestorNotificaciones.PREFERENCIA_ACTIVADAS);
      await this.registrarServiceWorker();
      await this.enviarNotificacionPrueba();
    } else if (permiso === "denied") {
      this.guardarPreferencia(GestorNotificaciones.PREFERENCIA_BLOQUEADAS);
    }

    return permiso;
  }
}

export const gestorNotificaciones = new GestorNotificaciones();
