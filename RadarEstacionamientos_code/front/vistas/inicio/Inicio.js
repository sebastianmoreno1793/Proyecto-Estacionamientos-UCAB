"use client";
// @PANTALLA Inicio › Contenido: botones de edificios, tarjeta «Más cerca», total de libres y estacionamientos con su semáforo
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Rejilla de Inicio con libres y estado de cada estacionamiento
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Botones de edificios y «Más cerca» en Inicio

// Pantalla de Inicio (D-007 v2). Junta tres HU en una sola vista, sin textos de relleno:
//  - HU 7.2: el usuario toca el edificio al que va (chips) y aparece la tarjeta oscura con el
//    estacionamiento libre más cercano. La pide SugerenciaControlador (fetch a /api/sugerencia).
//  - HU 4.2: el total de puestos libres en grande, con un anillo verde (con puesto) y rojo
//    (sin puesto), y una tarjeta por estacionamiento con su semáforo en texto.
//  - HU 4.3 (canal en vivo): cuando llega un aviso por /api/eventos, se vuelve a pedir todo.
//
//   navegador ─fetch GET /api/estacionamientos─▶ app/api/estacionamientos/route.js
//   navegador ─fetch GET /api/sugerencia?edificio=<id>─▶ app/api/sugerencia/route.js
//   navegador ◀─EventSource /api/eventos (AVISO, ESTACIONAMIENTO, REINICIO)

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EstacionamientoControlador } from "@/controladores/EstacionamientoControlador";
import { SugerenciaControlador } from "@/controladores/SugerenciaControlador";
import { ColoresSemaforo } from "@/vistas/comunes/ColoresSemaforo";
import { Formato } from "@/vistas/comunes/Formato";
import { Icono } from "@/vistas/comunes/Iconos";

// @HU-4.2 Consultar el semáforo de ocupación · Aaron
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel
// Muestra la pantalla de Inicio (ruta /): chips de edificios, el estacionamiento más cercano y los puestos libres.
// Junta la HU 7.2 (sugerencia), la HU 4.2 (puestos libres) y la HU 4.3 (canal en vivo). Toda la lógica
// está en EstacionamientoControlador y SugerenciaControlador; esta vista solo dibuja.
export default function Inicio() {
  const estacionamientoControlador = useMemo(() => new EstacionamientoControlador(), []);
  const sugerenciaControlador = useMemo(() => new SugerenciaControlador(), []);
  const [edificios, setEdificios] = useState([]);
  const [estacionamientos, setEstacionamientos] = useState(null);
  const [edificio, setEdificio] = useState(null);
  const [sugerencia, setSugerencia] = useState(null);
  const [sinDatos, setSinDatos] = useState(false); // la primera carga de puestos falló

  // Trae los edificios con ubicación (HU 6.1) y elige el de la última vez o el primero; corre al montar.
  useEffect(() => {
    sugerenciaControlador.edificios({ soloConUbicacion: true }).then((lista) => {
      setEdificios(lista);
      const guardado = sugerenciaControlador.edificioGuardado();
      setEdificio(lista.some((e) => e.id === guardado) ? guardado : (lista[0]?.id ?? null));
    });
  }, [sugerenciaControlador]);

  // Carga los estacionamientos y abre el canal en vivo /api/eventos; corre una sola vez, al montar.
  // Si llega AVISO, ESTACIONAMIENTO o REINICIO, vuelve a cargar las cifras. HU 4.3. [en-vivo]
  useEffect(() => {
    let activo = true;
    let ultima = 0; // número de la última petición: si llega una respuesta vieja, se ignora
    // @FETCH Inicio › GET /api/estacionamientos — pide los puestos libres de cada estacionamiento (y otra vez cada vez que el canal en vivo avisa un cambio)
    const cargar = async () => {
      const numero = ++ultima;
      const r = await estacionamientoControlador.listar();
      if (!activo || numero !== ultima) return;
      if (r.ok) setEstacionamientos(r.estacionamientos); // sin red se quedan las cifras de antes
      setSinDatos(!r.ok);
    };
    // La primera carga la hace alConectar al conectarse el canal en vivo (y cada vez que reconecta).
    // @FETCH Inicio › canal en vivo /api/eventos (EventSource) — se queda escuchando y avisa cuando entra o sale un carro
    const dejarDeEscuchar = estacionamientoControlador.escucharCambios(cargar, { alConectar: cargar });
    // Al salir de la pantalla, deja de actualizar y cierra el canal en vivo. [en-vivo]
    return () => {
      activo = false;
      dejarDeEscuchar();
    };
  }, [estacionamientoControlador]);

  // Pide la sugerencia (fetch GET /api/sugerencia?edificio=<id>) cuando cambia el edificio elegido o los
  // puestos libres. HU 7.2. [fetch]
  useEffect(() => {
    if (!edificio) return;
    let activo = true;
    // @FETCH Inicio › GET /api/sugerencia — pide el estacionamiento libre más cercano al edificio que tocaste («Más cerca»)
    sugerenciaControlador.sugerir(edificio).then((r) => {
      if (activo) setSugerencia(r.interfaz === "MensajeSugerencia" ? r.sugerencia : { error: r.error });
    });
    // Si cambia el edificio antes de que llegue la respuesta, ignora la respuesta vieja.
    return () => {
      activo = false;
    };
  }, [edificio, estacionamientos, sugerenciaControlador]);

  // Marca el edificio que tocó el usuario (el controlador lo recuerda para la próxima vez).
  function elegir(id) {
    setEdificio(id);
    sugerenciaControlador.recordarEdificio(id);
  }

  const abiertos = (estacionamientos ?? []).filter((e) => e.activo);
  const total = abiertos.reduce((suma, e) => suma + e.libres, 0);
  const conPuesto = abiertos.filter((e) => e.libres > 0).length;
  const ordenados = [...(estacionamientos ?? [])].sort(
    (a, b) => Number(b.activo) - Number(a.activo) || b.libres - a.libres,
  );

  return (
    <main className="pantalla">
      <div className="chips" role="group" aria-label="Edificio al que vas">
        {edificios.map((e) => (
          <button
            key={e.id}
            type="button"
            className="chip"
            aria-pressed={edificio === e.id}
            onClick={() => elegir(e.id)}
          >
            {edificio === e.id && <Icono nombre="edificio" />}
            {Formato.nombreCorto(e.nombre)}
          </button>
        ))}
      </div>

      {/* Teléfono: todo en una columna. Computador: sugerencia y total a la izquierda, la rejilla a la derecha. */}
      <div className="inicio-cuerpo">
        <div className="inicio-lado">
          <div aria-live="polite">
            {sugerencia?.sugerido && (
              <Link
                href={`/mapa?estacionamiento=${encodeURIComponent(sugerencia.sugerido.id)}`}
                className="tarjeta-grande tarjeta-noche"
              >
                <span className="suave">Más cerca</span>
                <span className="titulo-tarjeta">{sugerencia.sugerido.nombre}</span>
                <span className="fila">
                  <span>
                    <span className="punto" style={{ background: ColoresSemaforo.HAY_PUESTO.relleno }} aria-hidden="true" />
                    {Formato.libres(sugerencia.sugerido.libres)}
                  </span>
                  <span className="suave">{Formato.distancia(sugerencia.sugerido.distancia)}</span>
                </span>
              </Link>
            )}
            {sugerencia?.error && <p className="mensaje-error">{sugerencia.error}</p>}
            {/* La pantalla /sugerencia muestra además las alternativas (HU 7.2). */}
            {sugerencia?.sugerido && (
              <Link href="/sugerencia" className="boton-texto">
                Ver alternativas
              </Link>
            )}
          </div>

          {sinDatos && !estacionamientos && (
            <p className="mensaje-error" role="alert">
              No se pudieron cargar los estacionamientos. Se reintenta solo al volver la conexión.
            </p>
          )}
          <section className="tarjeta-grande fila" aria-label="Puestos libres en el campus">
            <div>
              <div className="cifra-xl">{estacionamientos ? total : "—"}</div>
              <div className="suave">{total === 1 ? "puesto libre" : "puestos libres"}</div>
            </div>
            <div
              className="anillo"
              style={{ "--hay": `${abiertos.length ? Math.round((conPuesto / abiertos.length) * 100) : 0}%` }}
              role="img"
              aria-label={`${conPuesto} con puesto y ${abiertos.length - conPuesto} sin puesto`}
            />
          </section>
        </div>
        <ul className="cuadricula">
          {ordenados.map((e) => {
            const nivel = ColoresSemaforo.de(e);
            return (
              <li key={e.id}>
                <Link
                  href={`/mapa?estacionamiento=${encodeURIComponent(e.id)}`}
                  className={`tarjeta-grande tarjeta-puesto${e.activo ? "" : " cerrado"}`}
                >
                  <span className="nombre-puesto">{e.etiqueta ?? e.nombre}</span>
                  {e.activo ? (
                    <span>
                      <span className="cifra-l">{e.libres}</span>
                      <span className="suave"> {e.libres === 1 ? "libre" : "libres"}</span>
                    </span>
                  ) : null}
                  <span className="suave">
                    <span className="punto" style={{ background: nivel.relleno }} aria-hidden="true" />
                    {e.activo ? nivel.texto : ColoresSemaforo.CERRADO.texto}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
