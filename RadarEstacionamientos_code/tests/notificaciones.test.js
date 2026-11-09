// HU 8.1 Activar notificaciones (modelo orientado a objetos).
// Se corre con: npm test

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { Notificacion } from "../lib/notificaciones/Notificacion.js";
import { GestorNotificaciones } from "../lib/notificaciones/gestorNotificaciones.js";

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
      titulo: "Radar UCAB 🚗",
      cuerpo: "Hay un puesto libre",
      icono: "/icono-192.png",
      url: "/",
    });

    assert.deepEqual(notificacion.aOpcionesDeVisualizacion(), {
      body: "Hay un puesto libre",
      icon: "/icono-192.png",
      data: { url: "/" },
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
    assert.equal(mostradas[0].titulo, "Radar UCAB 🚗");
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

  test("con [OK] guarda activadas, registra el SW y dispara la notificación de prueba", async () => {
    const { apis, notificacionesMostradas } = crearApis({ resultadoPermiso: "granted" });
    const gestor = new GestorNotificaciones(apis);

    assert.equal(await gestor.pedirPermiso(), "granted");
    assert.equal(
      gestor.obtenerPreferencia(),
      GestorNotificaciones.PREFERENCIA_ACTIVADAS,
    );
    assert.equal(apis.rutaRegistrada, GestorNotificaciones.RUTA_SERVICE_WORKER);
    assert.equal(notificacionesMostradas.length, 1);
    assert.equal(notificacionesMostradas[0].titulo, "Radar UCAB 🚗");
  });

  test("con [cancelar] guarda bloqueadas y no registra el Service Worker", async () => {
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

  test("rechaza con un error controlado si el Service Worker no queda listo", async () => {
    const { apis } = crearApis();
    apis.timeoutServiceWorkerMs = 5;
    apis.navigatorApi.serviceWorker.ready = new Promise(() => {});
    const gestor = new GestorNotificaciones(apis);

    await assert.rejects(
      gestor.registrarServiceWorker(),
      /tiempo de espera para activar el Service Worker/,
    );
  });
});
