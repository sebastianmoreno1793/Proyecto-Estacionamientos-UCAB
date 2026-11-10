"use client";

// Render de la maqueta del campus para la app (D-007 › Maqueta). Herramienta de desarrollo:
// dibuja la maqueta una vez, la muestra y, con «Exportar», guarda la imagen y la proyección
// en `exportes/` para copiarlas a `RadarEstacionamientos_code/front/public/maqueta/`.

import { useCallback, useEffect, useState } from "react";
import MaquetaRender from "@/componentes_visuales/MaquetaRender";

export default function PaginaMaqueta() {
  const [estacionamientos, setEstacionamientos] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState("Pidiendo los estacionamientos a la app base…");

  useEffect(() => {
    fetch("/api/base/estacionamientos")
      .then((r) => {
        if (!r.ok) throw new Error(`La app base respondió ${r.status}`);
        return r.json();
      })
      .then(({ estacionamientos }) => {
        setEstacionamientos(estacionamientos);
        setEstado("Dibujando la maqueta…");
      })
      .catch(() => setEstado("No se pudo hablar con la app base (¿está corriendo en :3000?)."));
  }, []);

  const alTerminar = useCallback((r) => {
    setResultado(r);
    setEstado("Lista. Revisa la imagen y pulsa «Exportar».");
  }, []);

  async function exportar() {
    setEstado("Exportando…");
    const respuesta = await fetch("/api/exportar-maqueta", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(resultado),
    });
    const cuerpo = await respuesta.json();
    setEstado(respuesta.ok ? `Exportada: ${cuerpo.archivos.join(" y ")}` : `Error: ${cuerpo.error}`);
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
