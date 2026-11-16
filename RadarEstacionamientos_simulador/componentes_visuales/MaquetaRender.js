"use client";
// @PANTALLA Simulador Maqueta › Render del campus visto desde arriba

// Componente de React del render de la MAQUETA del campus para la app (D-007 › Maqueta). El
// render lo hace MaquetaDelCampus (escena_3d/); aquí solo vive el contenedor.
//
// Al terminar, `onListo({ imagen, datos })` entrega la imagen (JPEG) y la proyección: dónde
// cae cada estacionamiento y cada edificio en la imagen, en píxeles. Con eso la app pinta el
// semáforo encima sin volver a dibujar el campus.

import { useEffect, useRef } from "react";
import { MaquetaDelCampus } from "@/escena_3d/MaquetaDelCampus";

export default function MaquetaRender({ estacionamientos, ancho = 2400, alto = 1560, onListo }) {
  const contenedor = useRef(null);

  useEffect(() => {
    if (!estacionamientos?.length || !contenedor.current) return;
    const maqueta = new MaquetaDelCampus(contenedor.current, { ancho, alto });
    onListo?.(maqueta.renderizar(estacionamientos));
    return () => maqueta.destruir();
  }, [estacionamientos, ancho, alto, onListo]);

  return <div ref={contenedor} className="maqueta-render" />;
}
