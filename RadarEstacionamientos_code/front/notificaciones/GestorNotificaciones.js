// @HU-8.1 Activar las notificaciones · Manuel — lógica de permisos y notificación de prueba
// HU 8.1 · Lógica de las notificaciones del navegador: pide el permiso, recuerda la
// respuesta (paso 2.2) y envía la notificación de prueba (CA1). Corre solo en el navegador.
import { Notificacion } from "./Notificacion.js";

/**
 * Coordina permiso del navegador, preferencia en localStorage,
 * registro del Service Worker y el envío de notificaciones (HU 8.1).
 *
 * Las APIs del navegador se leen al usar cada método para no romper el
 * render del servidor de Next.js. En pruebas se inyectan por el constructor.
 * Lo usa el componente Notificaciones (Inicio y Perfil). [notificaciones]
 */
export class GestorNotificaciones {
  static CLAVE_PREFERENCIA = "notificaciones_preferencia";
  static PREFERENCIA_ACTIVADAS = "activadas";
  static PREFERENCIA_BLOQUEADAS = "bloqueadas";
  // Si el Service Worker no queda activo en este tiempo, se deja de esperar (no se cuelga).
  static ESPERA_MAXIMA_MS = 10000;
  static RUTA_SERVICE_WORKER = "/sw.js";

  /**
   * Guarda las APIs inyectadas (en pruebas); en el navegador queda null y se usan las reales. [notificaciones]
   * @param {{ notificationApi?: object, navigatorApi?: object, almacenamiento?: Storage, avisar?: Function } | null} apis
   */
  constructor(apis = null) {
    this.apis = apis;
  }

  // Dice si corre en `next dev` sin APIs inyectadas; en pruebas se comporta como en producción. [notificaciones]
  #enDesarrollo() {
    return !this.apis && process.env.NODE_ENV !== "production";
  }

  // Devuelve la API Notification del navegador (o la inyectada), o null si no existe. [notificaciones]
  #apiNotificacion() {
    if (this.apis) return this.apis.notificationApi ?? null;
    if (typeof window === "undefined" || typeof Notification === "undefined") {
      return null;
    }
    return Notification;
  }

  // Devuelve el objeto navigator (o el inyectado), o null si corre en el servidor. [notificaciones]
  #navegador() {
    if (this.apis) return this.apis.navigatorApi ?? null;
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return null;
    }
    return navigator;
  }

  // Devuelve localStorage (o el inyectado), donde se guarda la preferencia del usuario. [notificaciones]
  #almacenamiento() {
    if (this.apis) return this.apis.almacenamiento ?? null;
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }
    return localStorage;
  }

  // Pasa un mensaje informativo a la función inyectada o lo escribe en la consola. [notificaciones]
  #avisar(mensaje) {
    if (this.apis?.avisar) {
      this.apis.avisar(mensaje);
      return;
    }
    // Sin alert(): el componente muestra el mensaje en la página según el estado que devolvemos.
    console.info(mensaje);
  }

  // Dice si el navegador tiene notificaciones web. [notificaciones]
  soportaNotificaciones() {
    return this.#apiNotificacion() != null;
  }

  // Dice si el navegador permite registrar un Service Worker. [notificaciones]
  soportaServiceWorker() {
    const navegador = this.#navegador();
    return Boolean(navegador && "serviceWorker" in navegador);
  }

  /**
   * Devuelve el permiso del navegador: default, granted, denied o unsupported. [notificaciones]
   * @returns {NotificationPermission | "unsupported"}
   */
  obtenerEstadoPermiso() {
    const api = this.#apiNotificacion();
    if (!api) return "unsupported";
    return api.permission;
  }

  /**
   * Guarda en localStorage la decisión del usuario (activadas o bloqueadas), HU 8.1. [notificaciones]
   * @param {string} valor
   */
  guardarPreferencia(valor) {
    this.#almacenamiento()?.setItem(GestorNotificaciones.CLAVE_PREFERENCIA, valor);
  }

  // Lee de localStorage la decisión guardada, o null si nunca respondió. [notificaciones]
  obtenerPreferencia() {
    return this.#almacenamiento()?.getItem(GestorNotificaciones.CLAVE_PREFERENCIA) ?? null;
  }

  // @HU-8.1 Activar las notificaciones · Manuel — paso 2.2: preguntar solo si nunca respondió
  /**
   * Paso 2.2 del escenario: la solicitud solo se muestra si el navegador todavía no preguntó y el usuario no
   * respondió antes en este navegador (ni «Permitir» ni «Bloquear»). [notificaciones]
   */
  debeMostrarSolicitud() {
    return this.obtenerEstadoPermiso() === "default" && !this.obtenerPreferencia();
  }

  // @HU-8.1 Activar las notificaciones · Manuel — CA2
  /**
   * «Bloquear» en la solicitud del Radar (CA2 de la HU 8.1): se registran como bloqueadas sin
   * preguntarle al navegador, así el usuario puede activarlas después desde su perfil. [notificaciones]
   */
  bloquear() {
    this.guardarPreferencia(GestorNotificaciones.PREFERENCIA_BLOQUEADAS);
  }

  /**
   * Espera a que el Service Worker esté activo, pero no para siempre: si el registro falló,
   * `serviceWorker.ready` nunca se cumple, así que a los ESPERA_MAXIMA_MS devuelve null. [notificaciones]
   * @returns {Promise<ServiceWorkerRegistration|null>}
   */
  async #esperarServiceWorkerActivo() {
    let temporizador;
    const limite = new Promise((resolver) => {
      temporizador = setTimeout(() => resolver(null), GestorNotificaciones.ESPERA_MAXIMA_MS);
    });
    try {
      return await Promise.race([this.#navegador().serviceWorker.ready, limite]);
    } finally {
      clearTimeout(temporizador);
    }
  }

  /**
   * Registra `/sw.js` (el único de la PWA, D-008) y espera a que el worker quede activo.
   * La llama pedirPermiso cuando el usuario acepta. [notificaciones]
   * @returns {Promise<ServiceWorkerRegistration|null>}
   */
  async registrarServiceWorker() {
    if (!this.soportaServiceWorker()) return null;
    // En `next dev` no se registra (igual que ActualizacionPWA): el SW guardaría código viejo en caché.
    if (this.#enDesarrollo()) return (await this.#navegador().serviceWorker.getRegistration()) ?? null;

    try {
      const registro = await this.#navegador().serviceWorker.register(
        GestorNotificaciones.RUTA_SERVICE_WORKER,
      );
      return (await this.#esperarServiceWorkerActivo()) ? registro : null;
    } catch (error) {
      console.error("Error al registrar el Service Worker:", error);
      return null;
    }
  }

  // @HU-8.1 Activar las notificaciones · Manuel — la notificación de prueba
  /**
   * Muestra la notificación local de prueba con el Service Worker activo (CA1). [notificaciones]
   * @returns {Promise<boolean>} true si se mostró.
   */
  async enviarNotificacionPrueba() {
    if (!this.soportaServiceWorker()) return false;
    if (this.obtenerEstadoPermiso() !== "granted") return false;

    const notificacion = Notificacion.dePrueba();
    if (this.#enDesarrollo()) {
      // Sin SW en desarrollo: si no hay uno registrado, la prueba sale directo del navegador.
      const registro = await this.#navegador().serviceWorker.getRegistration();
      if (registro) await notificacion.mostrarEn(registro);
      else {
        try {
          new (this.#apiNotificacion())(notificacion.titulo, notificacion.aOpcionesDeVisualizacion());
        } catch {
          return false; // Chrome en Android no deja crearla sin Service Worker
        }
      }
      return true;
    }
    const registro = await this.#esperarServiceWorkerActivo();
    if (!registro) return false;
    await notificacion.mostrarEn(registro);
    return true;
  }

  // @HU-8.1 Activar las notificaciones · Manuel — CA1
  /**
   * Solicita el permiso al usuario. Si concede (`[OK]`), activa preferencia,
   * registra el Service Worker y dispara la notificación de prueba.
   * Si niega (`[cancelar]`), guarda la preferencia como bloqueadas.
   * La llama el botón Permitir del componente Notificaciones (HU 8.1). [notificaciones]
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

    this.pruebaEnviada = false;
    if (permiso === "granted") {
      this.guardarPreferencia(GestorNotificaciones.PREFERENCIA_ACTIVADAS);
      await this.registrarServiceWorker();
      // CA1: una sola notificación de prueba. Se recuerda si salió, para no decir «te enviamos» en falso.
      this.pruebaEnviada = await this.enviarNotificacionPrueba();
    } else if (permiso === "denied") {
      this.guardarPreferencia(GestorNotificaciones.PREFERENCIA_BLOQUEADAS);
    }

    return permiso;
  }
}

export const gestorNotificaciones = new GestorNotificaciones();
