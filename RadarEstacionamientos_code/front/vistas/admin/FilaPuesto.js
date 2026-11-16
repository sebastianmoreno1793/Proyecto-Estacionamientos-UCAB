"use client";
// @PANTALLA Admin Puestos › Fila de un estacionamiento con «−» / «+» y el interruptor «Activo»
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Fila de un estacionamiento con su capacidad y el interruptor «Activo»

// HU 5.4 Modificar la capacidad y el estado de un estacionamiento (solo administrador).
// D-007 v2: sin botón «Guardar». El interruptor abre o cierra, y «−» / «+» cambian la capacidad;
// el cambio se envía solo (EstacionamientoControlador valida con CapacidadValidador y lo manda por fetch; el back avisa al mapa por el canal en vivo).

import { useActionState, useMemo, useRef } from "react";
import { EstacionamientoControlador } from "@/controladores/EstacionamientoControlador";
import { CapacidadValidador } from "@/validadores/CapacidadValidador";
import MensajeDatosNoValidos from "@/vistas/comunes/MensajeDatosNoValidos";
import MensajeCambiosGuardados from "@/vistas/admin/MensajeCambiosGuardados";
import estilos from "@/estilos/formularios.module.css";

const CAPACIDAD_MAXIMA = CapacidadValidador.CAPACIDAD_MAXIMA;

const ESPERA_MS = 700; // varios toques seguidos en «+» se mandan juntos

// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
// Muestra un estacionamiento en /admin/puestos con su interruptor (abierto o cerrado) y su capacidad. HU 5.4.
// Cada cambio se manda solo a EstacionamientoControlador.cambiar() (fetch PATCH). [fetch]
export default function FilaPuesto({ estacionamiento }) {
  const { id, etiqueta, soloProfesores, capacidad, activo, libres } = estacionamiento;
  const controlador = useMemo(() => new EstacionamientoControlador(), []);
  const [estado, accion, pendiente] = useActionState((_anterior, formulario) => controlador.cambiar(id, formulario), {});
  const formulario = useRef(null);
  const campo = useRef(null);
  const espera = useRef(null);

  // Envía el formulario sin que el administrador pulse «Guardar». [fetch]
  const enviar = () => formulario.current?.requestSubmit();

  // Suma o resta un puesto a la capacidad (entre 1 y el máximo) y espera 700 ms antes de enviar,
  // así varios toques seguidos en «−» o «+» se mandan juntos.
  function ajustar(cambio) {
    const actual = Number(campo.current.value) || capacidad;
    campo.current.value = Math.min(CAPACIDAD_MAXIMA, Math.max(1, actual + cambio));
    clearTimeout(espera.current);
    espera.current = setTimeout(enviar, ESPERA_MS);
  }

  return (
    <li className={`${estilos.tarjeta} ${activo ? "" : estilos.inactivo}`}>
      {/* noValidate apaga los avisos del navegador: los mensajes los da CapacidadValidador. */}
      <form ref={formulario} action={accion} style={{ display: "contents" }} noValidate>
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

      {estado.interfaz === "MensajeCambiosGuardados" ? (
        <MensajeCambiosGuardados mensaje={estado.mensaje} />
      ) : (
        <MensajeDatosNoValidos error={estado.error} />
      )}
    </li>
  );
}
