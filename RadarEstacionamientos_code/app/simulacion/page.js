"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Mapa3D from "@/components/Mapa3D";
import { ESTACIONAMIENTOS } from "@/data/estacionamientos";
import { etiquetasUnicas } from "@/lib/estacionamientos/reglas";

// Los 14 estacionamientos del mapa; la etiqueta distingue las zonas con el mismo nombre.
const ETIQUETAS = etiquetasUnicas(ESTACIONAMIENTOS);
const ESTACIONAMIENTOS_OPCIONES = ESTACIONAMIENTOS.map((e, i) => ({ id: e.id, nombre: ETIQUETAS[i] }));

export default function PaginaSimulacion3D() {
  const [estacionamientoId, setEstacionamientoId] = useState("est-playa");
  const [placa, setPlaca] = useState("AB123CD");
  const [cargando, setCargando] = useState(false);
  const [ultimoEvento, setUltimoEvento] = useState(null);
  const [historialEventos, setHistorialEventos] = useState([]);
  const [mostrarCurl, setMostrarCurl] = useState(false);

  // Escuchar eventos en vivo emitidos por Postman u otros clientes a través de SSE
  useEffect(() => {
    let eventSource;
    try {
      eventSource = new EventSource("/api/simulacion/stream");
      eventSource.onmessage = (e) => {
        try {
          const datos = JSON.parse(e.data);
          if (datos.tipo === "CONEXION") return;

          setUltimoEvento(datos);
          setHistorialEventos((prev) => [
            {
              id: Date.now(),
              hora: new Date().toLocaleTimeString(),
              tipo: datos.evento?.tipo || datos.tipo,
              nombre: datos.estacionamiento?.nombre || datos.evento?.nombre || datos.estacionamientoId,
              placa: datos.evento?.placa || datos.placa || "N/A",
            },
            ...prev.slice(0, 7),
          ]);
        } catch (err) {
          console.error("Error parseando evento SSE:", err);
        }
      };
    } catch (err) {
      console.warn("No se pudo iniciar EventSource:", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Generar placa aleatoria venezolana
  const generarPlacaAzar = () => {
    const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const l1 = letras[Math.floor(Math.random() * letras.length)];
    const l2 = letras[Math.floor(Math.random() * letras.length)];
    const num = Math.floor(100 + Math.random() * 900);
    const l3 = letras[Math.floor(Math.random() * letras.length)];
    const l4 = letras[Math.floor(Math.random() * letras.length)];
    setPlaca(`${l1}${l2}${num}${l3}${l4}`);
  };

  // Enviar evento de simulación a la API (lo mismo que haría Postman)
  const dispararEvento = async (tipo) => {
    setCargando(true);
    try {
      const res = await fetch("/api/simulacion/evento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estacionamientoId,
          tipo,
          placa,
        }),
      });

      const datos = await res.json();
      if (!res.ok) {
        alert(datos.error || "Error al procesar el evento");
      } else {
        generarPlacaAzar();
      }
    } catch (err) {
      alert("Error de red: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  // Ráfaga rápida de simulación (hora pico)
  const simularHoraPico = async () => {
    for (let i = 0; i < 4; i++) {
      await dispararEvento("ENTRADA");
      await new Promise((r) => setTimeout(r, 2200));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "#0b1329",
        color: "#f8fafc",
        overflow: "hidden",
      }}
    >
      {/* Barra Superior de Navegación */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          background: "#091024",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>
            Lienzo 3D · Simulador de Estacionamientos
          </h1>
          <span
            style={{
              fontSize: "0.75rem",
              background: "#1d4ed8",
              color: "#dbeafe",
              padding: "2px 8px",
              borderRadius: "12px",
              fontWeight: 600,
            }}
          >
            Borrador HU 3.2
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setMostrarCurl(!mostrarCurl)}
            style={{
              padding: "6px 12px",
              background: "rgba(255,255,255,0.06)",
              color: "#cbd5e1",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "6px",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            {mostrarCurl ? "Ocultar guía Postman" : "🔌 Ver llamada para Postman"}
          </button>
          <Link
            href="/"
            style={{
              padding: "6px 14px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            ← Volver al Mapa 2D
          </Link>
        </div>
      </header>

      {/* Guía flotante para Postman (opcional) */}
      {mostrarCurl && (
        <div
          style={{
            background: "#0f172a",
            padding: "12px 20px",
            borderBottom: "1px solid #334155",
            fontSize: "0.85rem",
            color: "#94a3b8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>Pruébalo desde Postman:</strong> Enviar <code>POST</code> a{" "}
            <code style={{ color: "#38bdf8" }}>http://localhost:3000/api/simulacion/evento</code> con JSON:
            <code style={{ color: "#facc15", marginLeft: "8px" }}>
              {`{ "estacionamientoId": "${estacionamientoId}", "tipo": "ENTRADA", "placa": "${placa}" }`}
            </code>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
            El carro en 3D se moverá automáticamente al enviar la petición.
          </span>
        </div>
      )}

      {/* Área Central: Lienzo 3D */}
      <main style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <Mapa3D ultimoEvento={ultimoEvento} />

        {/* Panel Lateral Flotante: Historial de Tráfico */}
        <aside
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "280px",
            maxHeight: "calc(100% - 140px)",
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "14px",
            zIndex: 10,
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            overflowY: "auto",
            pointerEvents: "auto",
          }}
        >
          <strong style={{ fontSize: "0.85rem", color: "#e2e8f0", display: "block", marginBottom: "8px" }}>
            Últimos eventos detectados
          </strong>
          {historialEventos.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
              No hay eventos recientes. Dispara uno con los controles o desde Postman.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
              {historialEventos.map((ev) => (
                <li
                  key={ev.id}
                  style={{
                    fontSize: "0.78rem",
                    padding: "6px 8px",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "6px",
                    borderLeft: `3px solid ${ev.tipo === "ENTRADA" ? "#22c55e" : "#ef4444"}`,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    <strong>{ev.tipo}</strong> · {ev.nombre} ({ev.placa})
                  </span>
                  <span style={{ color: "#64748b" }}>{ev.hora}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* HUD Inferior: Controles Manuales de Simulación */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(12px)",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            zIndex: 10,
            boxShadow: "0 10px 35px rgba(0,0,0,0.6)",
            maxWidth: "92vw",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Selector de Estacionamiento */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
              Estacionamiento
            </label>
            <select
              value={estacionamientoId}
              onChange={(e) => setEstacionamientoId(e.target.value)}
              style={{
                background: "#1e293b",
                color: "#f8fafc",
                border: "1px solid #334155",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              {ESTACIONAMIENTOS_OPCIONES.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Placa */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
              Placa
            </label>
            <div style={{ display: "flex", gap: "4px" }}>
              <input
                type="text"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                style={{
                  background: "#1e293b",
                  color: "#f8fafc",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  fontSize: "0.85rem",
                  width: "90px",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              />
              <button
                onClick={generarPlacaAzar}
                title="Generar placa aleatoria"
                style={{
                  background: "#334155",
                  color: "#e2e8f0",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0 8px",
                  cursor: "pointer",
                }}
              >
                🎲
              </button>
            </div>
          </div>

          {/* Botones de Acción */}
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "100%" }}>
            <button
              onClick={() => dispararEvento("ENTRADA")}
              disabled={cargando}
              style={{
                padding: "8px 16px",
                background: "#16a34a",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: cargando ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(22, 163, 74, 0.4)",
              }}
            >
              <span>🚗</span> Entrada
            </button>

            <button
              onClick={() => dispararEvento("SALIDA")}
              disabled={cargando}
              style={{
                padding: "8px 16px",
                background: "#dc2626",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: cargando ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(220, 38, 38, 0.4)",
              }}
            >
              <span>🚙</span> Salida
            </button>

            <button
              onClick={simularHoraPico}
              disabled={cargando}
              style={{
                padding: "8px 14px",
                background: "#f59e0b",
                color: "#1e1b4b",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: cargando ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>⚡</span> Ráfaga
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
