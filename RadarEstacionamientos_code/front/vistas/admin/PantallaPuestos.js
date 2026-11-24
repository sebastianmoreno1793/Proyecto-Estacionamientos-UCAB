"use client";
// @PANTALLA Admin Puestos (/admin/puestos) — capacidad y abierto o cerrado de cada estacionamiento
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Pantalla Administrar › Puestos
// Vista «interfaz» · Una FilaPuesto por estacionamiento. Se mantiene al día con el canal en vivo.
import { useEffect, useMemo, useState } from "react";
import { EstacionamientoControlador } from "@/controladores/EstacionamientoControlador";
import MenuAdmin from "@/vistas/comunes/MenuAdmin";
import MensajeDatosNoValidos from "@/vistas/comunes/MensajeDatosNoValidos";
import FilaPuesto from "@/vistas/admin/FilaPuesto";
import estilos from "@/estilos/formularios.module.css";

export default function PantallaPuestos() {
  const controlador = useMemo(() => new EstacionamientoControlador(), []);
  const [lista, setLista] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const r = await controlador.listar();
      if (r.ok) setLista(r.estacionamientos);
      setError(r.ok ? null : r.error);
    };
    cargar();
    return controlador.escucharCambios(cargar); // [en-vivo] lo que cambie otro administrador o un sensor
  }, [controlador]);

  return (
    <main className={`${estilos.pagina} ancha`}>
      <h1>Administrar</h1>
      <MenuAdmin />
      <MensajeDatosNoValidos error={error} />
      <ul className={estilos.lista}>
        {(lista ?? []).map((e) => (
          <FilaPuesto key={`${e.id}-${e.capacidad}-${e.activo}`} estacionamiento={e} />
        ))}
      </ul>
    </main>
  );
}
