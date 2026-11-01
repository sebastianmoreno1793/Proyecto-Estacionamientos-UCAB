"use client";

// Registra el service worker único (D-008) y avisa cuando hay una versión nueva: espera a que
// el usuario pulse «Actualizar», como en Thinkdy y Te Cambio. Solo en producción: en
// `next dev` un service worker guardaría versiones viejas mientras se programa.

import { useEffect, useState } from "react";

export default function RegistroPWA() {
  const [esperando, setEsperando] = useState(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    let recargando = false;
    const alCambiar = () => {
      if (recargando) return;
      recargando = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", alCambiar);

    navigator.serviceWorker.register("/sw.js").then((registro) => {
      if (registro.waiting && navigator.serviceWorker.controller) setEsperando(registro.waiting);
      registro.addEventListener("updatefound", () => {
        const nuevo = registro.installing;
        nuevo?.addEventListener("statechange", () => {
          if (nuevo.state === "installed" && navigator.serviceWorker.controller) setEsperando(nuevo);
        });
      });
      // Busca versiones nuevas al volver a la app.
      const revisar = () => document.visibilityState === "visible" && registro.update();
      document.addEventListener("visibilitychange", revisar);
    });

    return () => navigator.serviceWorker.removeEventListener("controllerchange", alCambiar);
  }, []);

  if (!esperando) return null;
  return (
    <div className="aviso-flotante" role="status">
      <p>Hay una versión nueva del Radar.</p>
      <button type="button" className="boton-principal" onClick={() => esperando.postMessage({ tipo: "ACTUALIZAR" })}>
        Actualizar
      </button>
    </div>
  );
}
