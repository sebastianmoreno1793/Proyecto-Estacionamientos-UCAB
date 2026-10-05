"use client";

// Mapa del Campus Montalbán con todos los estacionamientos dibujados y con su nombre (HU 5.1).
// Usa Leaflet + OpenStreetMap: gratis, sin cuenta con facturación (D-005, en revisión).
// Los colores del semáforo NO van aquí: en R1 los muestra la HU 4.2 y en R2 la HU 5.2.

import { useEffect, useRef } from "react";
import {
  CENTRO_CAMPUS,
  ZOOM_INICIAL,
  ESTACIONAMIENTOS,
} from "@/data/estacionamientos";

export default function MapaCampus() {
  const contenedor = useRef(null);

  useEffect(() => {
    let mapa;
    let cancelado = false;

    // Leaflet usa `window`, así que se carga solo en el navegador.
    import("leaflet").then(({ default: L }) => {
      if (cancelado || !contenedor.current) return;

      mapa = L.map(contenedor.current).setView(CENTRO_CAMPUS, ZOOM_INICIAL);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa);

      const capas = ESTACIONAMIENTOS.map((est) =>
        L.polygon(est.poligono, {
          color: "#1d4ed8",
          weight: 2,
          fillOpacity: 0.25,
        })
          .bindTooltip(est.nombre, {
            permanent: true,
            direction: "center",
            className: "etiqueta-estacionamiento",
          })
          .addTo(mapa)
      );

      // Encuadra todos los estacionamientos, en computador o en celular.
      if (capas.length > 0) {
        mapa.fitBounds(L.featureGroup(capas).getBounds(), { padding: [24, 24] });
      }
    });

    return () => {
      cancelado = true;
      if (mapa) mapa.remove();
    };
  }, []);

  return (
    <div
      ref={contenedor}
      className="mapa-campus"
      role="region"
      aria-label="Mapa del Campus Montalbán con los estacionamientos"
    />
  );
}
