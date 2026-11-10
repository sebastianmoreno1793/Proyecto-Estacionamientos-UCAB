"use client";
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — fila con capacidad y «Activo»

// HU 5.4 Modificar la capacidad y el estado de un estacionamiento (solo administrador).
// D-007 v2: sin botón «Guardar». El interruptor abre o cierra, y «−» / «+» cambian la capacidad;
// el cambio se envía solo (la acción en acciones/puestos.js valida y avisa al mapa por el canal en vivo).

import { useActionState, useRef } from "react";
import { guardarEstacionamiento } from "@/acciones/puestos";
import { CAPACIDAD_MAXIMA, puestosLibres } from "@back/logica/estacionamientos/reglas.js";
import estilos from "@/estilos/formularios.module.css";

const ESPERA_MS = 700; // varios toques seguidos en «+» se mandan juntos

// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
// Muestra un estacionamiento en /admin/puestos con su interruptor (abierto o cerrado) y su capacidad. HU 5.4.
// Cada cambio se manda solo a la acción guardarEstacionamiento. [accion]
export default function FilaPuesto({ estacionamiento }) {
  const { id, etiqueta, soloProfesores, capacidad, activo } = estacionamiento;
  const [estado, accion, pendiente] = useActionState(guardarEstacionamiento, {});
  const formulario = useRef(null);
  const campo = useRef(null);
  const espera = useRef(null);

  // Envía el formulario a la acción del servidor sin que el administrador pulse «Guardar». [accion]
  const enviar = () => formulario.current?.requestSubmit();

  // Suma o resta un puesto a la capacidad (entre 1 y el máximo) y espera 700 ms antes de enviar,
  // así varios toques seguidos en «−» o «+» se mandan juntos.
  function ajustar(cambio) {
    const actual = Number(campo.current.value) || capacidad;
    campo.current.value = Math.min(CAPACIDAD_MAXIMA, Math.max(1, actual + cambio));
    clearTimeout(espera.current);
    espera.current = setTimeout(enviar, ESPERA_MS);
  }

  const libres = puestosLibres(estacionamiento);

  return (
    <li className={`${estilos.tarjeta} ${activo ? "" : estilos.inactivo}`}>
      <form ref={formulario} action={accion} style={{ display: "contents" }}>
        <input type="hidden" name="id" value={id} />
        <div className="fila">
          <span className="nombre-puesto">
            {etiqueta}
            {soloProfesores && <span className="suave"> · Solo profesores</span>}
          </span>
          {/* La etiqueta envuelve solo el interruptor: tocar el nombre no cierra nada. */}
          <label style={{ display: "flex" }}>
            <span className="oculto-visual">Abierto</span>
            <input
              type="checkbox"
              role="switch"
              className="conmutador"
              name="activo"
              defaultChecked={estado.valores?.activo ?? activo}
              onChange={enviar}
            />
          </label>
        </div>

        <div className="fila">
          <span className="suave">
            {activo ? (
              <>
                <span className="cifra-l" style={{ color: "var(--tinta)" }}>
                  {libres}
                </span>{" "}
                {libres === 1 ? "libre" : "libres"}
              </>
            ) : (
              "Cerrado"
            )}
          </span>
          <div className="paso">
            <button type="button" onClick={() => ajustar(-1)} aria-label="Un puesto menos" disabled={pendiente}>
              −
            </button>
            <input
              ref={campo}
              type="number"
              name="capacidad"
              aria-label="Capacidad (puestos)"
              min={1}
              max={CAPACIDAD_MAXIMA}
              step={1}
              defaultValue={estado.valores?.capacidad ?? capacidad}
              onBlur={(e) => Number(e.target.value) !== capacidad && enviar()}
              required
            />
            <button type="button" onClick={() => ajustar(1)} aria-label="Un puesto más" disabled={pendiente}>
              +
            </button>
          </div>
        </div>
      </form>

      <p className="mensaje-error" role="alert">
        {estado.error}
      </p>
    </li>
  );
}
