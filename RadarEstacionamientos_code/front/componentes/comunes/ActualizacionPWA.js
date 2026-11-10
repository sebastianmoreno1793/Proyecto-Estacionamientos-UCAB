"use client";

// Registra el service worker único (D-008) y avisa cuando hay una versión nueva: espera a que
// el usuario pulse «Actualizar», como en Thinkdy y Te Cambio. Solo en producción: en
// `next dev` un service worker guardaría versiones viejas mientras se programa.

import { useEffect, useState } from "react";

// Muestra el aviso «Hay una versión nueva del Radar» con el botón «Actualizar»; va en app/layout.js (toda la app).
export default function ActualizacionPWA() {
  const [esperando, setEsperando] = useState(null);

  // Registra /sw.js (solo en producción) y vigila si llega una versión nueva.
  // Corre una sola vez, al montar el componente.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    let recargando = false;
    // Recarga la página una sola vez cuando el service worker nuevo toma el control.
    const alCambiar = () => {
      if (recargando) return;
      recargando = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", alCambiar);

    // Registra el service worker y, si ya hay una versión esperando, muestra el aviso.
    navigator.serviceWorker.register("/sw.js").then((registro) => {
      if (registro.waiting && navigator.serviceWorker.controller) setEsperando(registro.waiting);
      // Cuando se descarga una versión nueva, espera a que termine de instalarse para avisar.
      registro.addEventListener("updatefound", () => {
        const nuevo = registro.installing;
        nuevo?.addEventListener("statechange", () => {
          if (nuevo.state === "installed" && navigator.serviceWorker.controller) setEsperando(nuevo);
        });
      });
      // Busca versiones nuevas cada vez que el usuario vuelve a la app.
      const revisar = () => document.visibilityState === "visible" && registro.update();
      document.addEventListener("visibilitychange", revisar);
    });

    // Deja de escuchar el cambio de service worker al desmontar el componente.
    return () => navigator.serviceWorker.removeEventListener("controllerchange", alCambiar);
  }, []);

  if (!esperando) return null;
  return (
    <div className="aviso-flotante" role="status">
      <p>Hay una versión nueva del Radar.</p>
      {/* «Actualizar» le pide al service worker nuevo que se active (mensaje ACTUALIZAR). */}
      <button type="button" className="boton-principal" onClick={() => esperando.postMessage({ tipo: "ACTUALIZAR" })}>
        Actualizar
      </button>
    </div>
  );
}
