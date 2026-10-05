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

// Color del borde de cada estacionamiento (no es el semáforo).
const COLOR_GENERAL = "#1d4ed8";
const COLOR_PROFESORES = "#7c3aed";

export default function MapaCampus() {
  const contenedor = useRef(null);

  useEffect(() => {
    let mapa;
    let observador;
    let cancelado = false;

    // Leaflet usa `window`, así que se carga solo en el navegador.
    import("leaflet").then(({ default: L }) => {
      if (cancelado || !contenedor.current) return;

      // zoomSnap fraccionario: el campus cabe completo también en pantallas angostas.
      mapa = L.map(contenedor.current, { zoomSnap: 0.25 }).setView(
        CENTRO_CAMPUS,
        ZOOM_INICIAL
      );

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa);

      const capas = ESTACIONAMIENTOS.map((est) =>
        L.polygon(est.poligono, {
          color: est.soloProfesores ? COLOR_PROFESORES : COLOR_GENERAL,
          weight: 2,
          fillOpacity: 0.25,
        })
          .bindTooltip(est.pisos ? `${est.nombre} · ${est.pisos} pisos` : est.nombre, {
            permanent: true,
            direction: "center",
            className: "etiqueta-estacionamiento",
          })
          .addTo(mapa)
      );

      // Encuadra todos los estacionamientos, en computador o en celular.
      const encuadrar = () => {
        if (capas.length > 0) {
          mapa.fitBounds(L.featureGroup(capas).getBounds(), { padding: [24, 24] });
        }
      };
      encuadrar();

      // Si cambia el tamaño de la pantalla (girar el celular, cambiar la
      // ventana), el mapa se reajusta para que no queden estacionamientos cortados.
      observador = new ResizeObserver(() => {
        mapa.invalidateSize();
        encuadrar();
      });
      observador.observe(contenedor.current);
    });

    return () => {
      cancelado = true;
      if (observador) observador.disconnect();
      if (mapa) mapa.remove();
    };
  }, []);

  return (
    <div className="mapa-contenedor">
      <div
        ref={contenedor}
        className="mapa-campus"
        role="region"
        aria-label="Mapa del Campus Montalbán con los estacionamientos"
      />
      <ul className="leyenda" aria-label="Leyenda">
        <li>
          <span className="muestra" style={{ borderColor: COLOR_GENERAL }} />
          Estacionamiento
        </li>
        <li>
          <span className="muestra" style={{ borderColor: COLOR_PROFESORES }} />
          Solo profesores
        </li>
      </ul>
    </div>
  );
}
