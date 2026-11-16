"use client";
// @PANTALLA Admin Edificios (/admin/edificios) — agregar, modificar y quitar edificios del catálogo
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Pantalla Administrar › Edificios
// Vista «interfaz» · NuevoEdificio y una FilaEdificio por edificio del catálogo (son los chips del Inicio).
import { useCallback, useEffect, useMemo, useState } from "react";
import { EdificioControlador } from "@/controladores/EdificioControlador";
import MenuAdmin from "@/vistas/comunes/MenuAdmin";
import FilaEdificio from "@/vistas/admin/FilaEdificio";
import NuevoEdificio from "@/vistas/admin/NuevoEdificio";
import estilos from "@/estilos/formularios.module.css";

export default function PantallaEdificios() {
  const controlador = useMemo(() => new EdificioControlador(), []);
  const [edificios, setEdificios] = useState(null);
  const cargar = useCallback(() => controlador.listar().then(setEdificios), [controlador]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <main className={`${estilos.pagina} ancha`}>
      <h1>Administrar</h1>
      <MenuAdmin />

      <NuevoEdificio alAgregar={cargar} />

      {edificios && edificios.length === 0 ? (
        <p className={estilos.ayuda}>Todavía no hay edificios en el catálogo.</p>
      ) : (
        <ul className={estilos.lista}>
          {(edificios ?? []).map((e) => (
            <FilaEdificio key={`${e.id}-${e.nombre}-${e.ubicacion}`} edificio={e} alCambiar={cargar} />
          ))}
        </ul>
      )}
    </main>
  );
}
