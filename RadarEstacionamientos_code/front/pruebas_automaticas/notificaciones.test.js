// @HU-8.1 Activar las notificaciones · Manuel — Prueba el permiso y la notificación de prueba
// HU 8.1 Activar notificaciones (modelo orientado a objetos).
// Se corre con: npm test

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { Notificacion } from "../notificaciones_del_navegador/Notificacion.js";
import { GestorNotificaciones } from "../notificaciones_del_navegador/GestorNotificaciones.js";

function crearAlmacenamiento() {
  const datos = {};
  return {
    setItem(clave, valor) {
      datos[clave] = String(valor);
    },
    getItem(clave) {
      return Object.hasOwn(datos, clave) ? datos[clave] : null;
    },
  };
}

function crearApis({ permisoInicial = "default", resultadoPermiso = "granted" } = {}) {
  const notificacionesMostradas = [];
  const registro = {
    scope: "/",
    showNotification: async (titulo, opciones) => {
      notificacionesMostradas.push({ titulo, opciones });
    },
  };

  const notificationApi = {
    permission: permisoInicial,
    requestPermission: async () => {
      notificationApi.permission = resultadoPermiso;
      return resultadoPermiso;
    },
  };

  const avisos = [];
  const apis = {
    notificationApi,
    navigatorApi: {
      serviceWorker: {
        register: async (ruta) => {
          apis.rutaRegistrada = ruta;
          return registro;
        },
        ready: Promise.resolve(registro),
      },
    },
    almacenamiento: crearAlmacenamiento(),
    avisar: (mensaje) => avisos.push(mensaje),
    rutaRegistrada: null,
  };

  return { apis, avisos, notificacionesMostradas, registro };
}

describe("Notificacion", () => {
  test("arma las opciones de showNotification", () => {
    const notificacion = new Notificacion({
      titulo: "Radar UCAB",
      cuerpo: "Hay un puesto libre",
      icono: "/icono-192.png",
    });

    assert.deepEqual(notificacion.aOpcionesDeVisualizacion(), {
      body: "Hay un puesto libre",
      icon: "/icono-192.png",
    });
  });

  test("se muestra a través del registro del Service Worker", async () => {
    const mostradas = [];
    const notificacion = Notificacion.dePrueba();
    await notificacion.mostrarEn({
      showNotification: async (titulo, opciones) => {
        mostradas.push({ titulo, opciones });
      },
    });

    assert.equal(mostradas.length, 1);
    assert.equal(mostradas[0].titulo, "Radar UCAB");
    assert.match(mostradas[0].opciones.body, /configuradas correctamente/);
  });
});

describe("GestorNotificaciones", () => {
  test("indica unsupported cuando el navegador no tiene la API", async () => {
    const avisos = [];
    const gestor = new GestorNotificaciones({
      notificationApi: null,
      avisar: (mensaje) => avisos.push(mensaje),
    });

    assert.equal(gestor.obtenerEstadoPermiso(), "unsupported");
    assert.equal(await gestor.pedirPermiso(), "unsupported");
    assert.equal(avisos.length, 1);
  });

  test("CA1: con «Permitir» guarda activadas, registra el SW y dispara la notificación de prueba", async () => {
    const { apis, notificacionesMostradas } = crearApis({ resultadoPermiso: "granted" });
    const gestor = new GestorNotificaciones(apis);

    assert.equal(await gestor.pedirPermiso(), "granted");
    assert.equal(
      gestor.obtenerPreferencia(),
      GestorNotificaciones.PREFERENCIA_ACTIVADAS,
    );
    assert.equal(apis.rutaRegistrada, GestorNotificaciones.RUTA_SERVICE_WORKER);
    assert.equal(notificacionesMostradas.length, 1);
    assert.equal(notificacionesMostradas[0].titulo, "Radar UCAB");
  });

  test("CA2: si bloquea en el navegador guarda bloqueadas y no registra el Service Worker", async () => {
    const { apis, notificacionesMostradas } = crearApis({ resultadoPermiso: "denied" });
    const gestor = new GestorNotificaciones(apis);

    assert.equal(await gestor.pedirPermiso(), "denied");
    assert.equal(
      gestor.obtenerPreferencia(),
      GestorNotificaciones.PREFERENCIA_BLOQUEADAS,
    );
    assert.equal(apis.rutaRegistrada, null);
    assert.equal(notificacionesMostradas.length, 0);
  });

  test("si el usuario cierra el diálogo no guarda preferencia", async () => {
    const { apis, notificacionesMostradas } = crearApis({ resultadoPermiso: "default" });
    const gestor = new GestorNotificaciones(apis);

    assert.equal(await gestor.pedirPermiso(), "default");
    assert.equal(gestor.obtenerPreferencia(), null);
    assert.equal(notificacionesMostradas.length, 0);
  });

  test("no envía la notificación de prueba sin permiso concedido", async () => {
    const { apis, notificacionesMostradas } = crearApis({ permisoInicial: "denied" });
    const gestor = new GestorNotificaciones(apis);

    await gestor.enviarNotificacionPrueba();
    assert.equal(notificacionesMostradas.length, 0);
  });

  test("CA2: con «Bloquear» en el Radar guarda bloqueadas, sin prueba y sin preguntarle al navegador", () => {
    const { apis, notificacionesMostradas } = crearApis();
    const gestor = new GestorNotificaciones(apis);

    gestor.bloquear();
    assert.equal(gestor.obtenerPreferencia(), GestorNotificaciones.PREFERENCIA_BLOQUEADAS);
    assert.equal(apis.notificationApi.permission, "default"); // se puede activar después
    assert.equal(notificacionesMostradas.length, 0);
  });

  test("si el Service Worker nunca queda activo, no se queda esperando", async (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    const { apis, notificacionesMostradas } = crearApis({ permisoInicial: "granted" });
    apis.navigatorApi.serviceWorker.ready = new Promise(() => {}); // el registro falló
    const gestor = new GestorNotificaciones(apis);

    const envio = gestor.enviarNotificacionPrueba();
    t.mock.timers.tick(GestorNotificaciones.ESPERA_MAXIMA_MS);
    assert.equal(await envio, false);
    assert.equal(notificacionesMostradas.length, 0);
  });
});

// Criterios de aceptación de la HU 8.1 (antes en back/pruebas_automaticas/criterios_sprint1.test.js).
describe("HU 8.1 · Activar las notificaciones", () => {
  function crearApis(resultadoPermiso = "granted") {
    const guardado = {};
    const mostradas = [];
    const registro = { showNotification: async (titulo) => mostradas.push(titulo) };
    const notificationApi = {
      permission: "default",
      requestPermission: async () => (notificationApi.permission = resultadoPermiso),
    };
    return {
      mostradas,
      apis: {
        notificationApi,
        navigatorApi: { serviceWorker: { register: async () => registro, ready: Promise.resolve(registro) } },
        almacenamiento: { setItem: (k, v) => (guardado[k] = v), getItem: (k) => guardado[k] ?? null },
        avisar: () => {},
      },
    };
  }

  test("CA1: «Permitir» envía una sola notificación de prueba y lo recuerda", async () => {
    const { apis, mostradas } = crearApis("granted");
    const gestor = new GestorNotificaciones(apis);
    await gestor.pedirPermiso();
    assert.equal(mostradas.length, 1);
    assert.equal(gestor.pruebaEnviada, true);
  });

  test("paso 2.2: si ya respondió «Permitir» o «Bloquear», no se vuelve a preguntar", async () => {
    const permitio = crearApis("granted");
    assert.equal(new GestorNotificaciones(permitio.apis).debeMostrarSolicitud(), true);
    await new GestorNotificaciones(permitio.apis).pedirPermiso();
    assert.equal(new GestorNotificaciones(permitio.apis).debeMostrarSolicitud(), false); // otra visita
    assert.equal(permitio.mostradas.length, 1); // y no llega otra prueba

    const bloqueo = crearApis();
    new GestorNotificaciones(bloqueo.apis).bloquear();
    assert.equal(new GestorNotificaciones(bloqueo.apis).debeMostrarSolicitud(), false);
  });

  test("CA3: desde Perfil se desactivan y se reactivan (bloqueadas → activadas)", async () => {
    const { apis, mostradas } = crearApis("granted");
    const gestor = new GestorNotificaciones(apis);
    await gestor.pedirPermiso(); // activas
    assert.equal(gestor.obtenerPreferencia(), GestorNotificaciones.PREFERENCIA_ACTIVADAS);

    gestor.bloquear(); // apaga el interruptor de Perfil
    assert.equal(gestor.obtenerPreferencia(), GestorNotificaciones.PREFERENCIA_BLOQUEADAS);

    // lo vuelve a encender: el navegador ya dio permiso, así que solo cambia la preferencia
    assert.equal(gestor.obtenerEstadoPermiso(), "granted");
    gestor.guardarPreferencia(GestorNotificaciones.PREFERENCIA_ACTIVADAS);
    assert.equal(gestor.obtenerPreferencia(), GestorNotificaciones.PREFERENCIA_ACTIVADAS);
    assert.equal(mostradas.length, 1); // la prueba no se repite
  });

  test("si cierra el diálogo sin responder, se le vuelve a preguntar la próxima vez", async () => {
    const { apis } = crearApis("default");
    await new GestorNotificaciones(apis).pedirPermiso();
    assert.equal(new GestorNotificaciones(apis).debeMostrarSolicitud(), true);
  });
});
