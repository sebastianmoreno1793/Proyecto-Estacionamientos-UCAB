"use client";
// @PANTALLA Simulador Maqueta (/maqueta) — dibuja la imagen del campus que usa el Mapa de la app y la exporta

// Render de la maqueta del campus para la app (D-007 › Maqueta). Herramienta de desarrollo:
// dibuja la maqueta una vez, la muestra y, con «Exportar», guarda la imagen y la proyección
// en `exportes/` para copiarlas a `RadarEstacionamientos_code/front/public/maqueta/`.

import { useCallback, useEffect, useState } from "react";
import MaquetaRender from "@/componentes_visuales/MaquetaRender";
import { ClienteAppBase } from "@/conexion_app/ClienteAppBase";

const api = new ClienteAppBase();

export default function PaginaMaqueta() {
  const [estacionamientos, setEstacionamientos] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState("Pidiendo los estacionamientos a la app base…");

  useEffect(() => {
    api.estacionamientos().then((r) => {
      if (!r.ok) {
        setEstado("No se pudo hablar con la app base (¿está corriendo en :3000?).");
        return;
      }
      setEstacionamientos(r.datos.estacionamientos);
      setEstado("Dibujando la maqueta…");
    });
  }, []);

  const alTerminar = useCallback((r) => {
    setResultado(r);
    setEstado("Lista. Revisa la imagen y pulsa «Exportar».");
  }, []);

  async function exportar() {
    setEstado("Exportando…");
    const r = await api.exportarMaqueta(resultado);
    setEstado(r.ok ? `Exportada: ${r.datos.archivos.join(" y ")}` : `Error: ${r.datos?.error ?? "sin respuesta"}`);
  }

  return (
    <main style={{ padding: 16, background: "#efe9dc", minHeight: "100vh", fontFamily: "system-ui" }}>
      <p id="estado-maqueta" style={{ margin: "0 0 12px" }}>
        {estado}{" "}
        {resultado && (
          <button type="button" onClick={exportar} id="exportar-maqueta">
            Exportar
          </button>
        )}
      </p>
      {estacionamientos && <MaquetaRender estacionamientos={estacionamientos} onListo={alTerminar} />}
    </main>
  );
}
