"use client";
// @PANTALLA Simulador › Mapa 3D del campus con los carros que entran y salen

// Componente de React del mundo virtual 3D. La escena la arma y la anima MundoVirtual3D
// (escena_3d/); aquí solo vive lo de React: el recuadro de estado, la brújula y el lienzo.
//
// El componente NO habla con la app base. Recibe su estado por props y cuenta lo que pasa
// en el mundo virtual por `onDispararEvento`; la página lo convierte en llamadas a la API.
//
// Props:
//   estacionamientos  [{ id, nombre, etiqueta, soloProfesores, capacidad, ocupados, libres,
//                        porcentaje, activo, poligono, pisos, incidencias, seleccionado }]
//                     Con la primera lista que trae polígonos se arma la escena; las
//                     siguientes solo la actualizan.
//   ultimoEvento      una orden (o un lote `{ ordenes: [...] }`, cada una con `seq`):
//                       { tipo: "ENTRADA" | "SALIDA", estacionamientoId, placa, idAviso, origen }
//                         origen "simulador": el carro es del simulador; al pasar por la
//                           garita y al llegar o salir del estacionamiento pide enviar la
//                           lectura de placa y el aviso del sensor.
//                         origen "externo": el aviso ya llegó a la app (Postman, otro
//                           simulador); el carro solo se dibuja.
//                       { tipo: "ENFOCAR", estacionamientoId }   lleva la cámara allá
//   onDispararEvento  lo que pasa en el mundo virtual (ver escena_3d/MundoVirtual3D.js)

import { useEffect, useRef, useState } from "react";
import { EstadoDelMapa } from "@/escena_3d/EstadoDelMapa";
import { MundoVirtual3D } from "@/escena_3d/MundoVirtual3D";

export default function Mapa3D({ estacionamientos = [], ultimoEvento = null, onDispararEvento = null }) {
  const mountRef = useRef(null);
  const brujulaRef = useRef(null);
  const [estado] = useState(() => new EstadoDelMapa());
  const mundo = useRef(null);
  const estacionamientosRef = useRef(estacionamientos);
  const onDispararRef = useRef(onDispararEvento);
  const [seguir, setSeguir] = useState(true);
  const [infoOverlay, setInfoOverlay] = useState("Garita lista para recibir vehículos.");

  estacionamientosRef.current = estacionamientos;
  onDispararRef.current = onDispararEvento;
  const hayDatos = estacionamientos.some((e) => e?.poligono?.length >= 3);

  useEffect(() => {
    estado.seguir = seguir;
  }, [estado, seguir]);

  // Órdenes nuevas (botones del simulador o avisos externos): quedan pendientes para la escena.
  useEffect(() => {
    for (const orden of estado.recibir(ultimoEvento)) {
      const texto = estado.describir(orden);
      if (texto) setInfoOverlay(texto);
    }
  }, [estado, ultimoEvento]);

  // Cada vez que cambia el estado de la app base, la escena se pone al día.
  useEffect(() => {
    for (const id of estado.actualizar(estacionamientos)) mundo.current?.aplicar(id);
  }, [estado, estacionamientos]);

  // La escena se arma una vez, cuando llegan los primeros polígonos.
  useEffect(() => {
    const contenedor = mountRef.current;
    if (!contenedor || !hayDatos) return;
    const escena = new MundoVirtual3D(contenedor, {
      estacionamientos: estacionamientosRef.current,
      estado,
      disparar: (evento) => onDispararRef.current?.(evento),
      informar: setInfoOverlay,
      brujula: () => brujulaRef.current,
    });
    mundo.current = escena;
    return () => {
      mundo.current = null;
      escena.destruir();
    };
  }, [estado, hayDatos]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Contenedor del lienzo Three.js */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Overlay de Estado en Pantalla */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(8px)",
          color: "#f8fafc",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          maxWidth: "330px",
          pointerEvents: "none",
          fontFamily: "system-ui, sans-serif",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
              display: "inline-block",
            }}
          />
          <strong style={{ fontSize: "0.95rem", letterSpacing: "0.02em" }}>
            Garita Virtual UCAB · 3D
          </strong>
        </div>
        <div style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.4" }}>{infoOverlay}</div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "8px",
            fontSize: "0.8rem",
            color: "#cbd5e1",
            pointerEvents: "auto",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          <input type="checkbox" checked={seguir} onChange={(e) => setSeguir(e.target.checked)} />
          Seguir al carro con la cámara
        </label>
        <div
          style={{
            fontSize: "0.75rem",
            color: "#64748b",
            marginTop: "8px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "6px",
          }}
        >
          💡 <strong>Clic</strong> en un estacionamiento para elegirlo. Arrastra para rotar, clic
          derecho para mover, rueda para el zoom. Marcador azul: carro del simulador; rosa: aviso
          externo.
          <br />
          Escala real 1:1 · Mapa © colaboradores de OpenStreetMap · Relieve SRTM (NASA)
        </div>
      </div>

      {/* Brújula: la N apunta al norte real */}
      <div
        aria-label="Brújula"
        style={{
          position: "absolute",
          left: "16px",
          bottom: "16px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "rgba(15, 23, 42, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          pointerEvents: "none",
        }}
      >
        <div
          ref={brujulaRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "3px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span style={{ color: "#ef4444", fontWeight: 800, fontSize: "0.8rem", lineHeight: 1 }}>N</span>
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "16px solid #ef4444",
              marginTop: "1px",
            }}
          />
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "16px solid #cbd5e1",
            }}
          />
        </div>
      </div>
    </div>
  );
}
