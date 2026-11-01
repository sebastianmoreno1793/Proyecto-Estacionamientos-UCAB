"use client";

// Menú de control del simulador: todo lo que se puede hacerle a la app base, agrupado en
// pestañas. Cada botón termina en una llamada a la API pública de la app (ver el Registro).

import { useEffect, useState } from "react";
import { TIPOS_DE_INCIDENCIA } from "@/lib/cliente_base";

const PESTANAS = [
  { id: "garita", texto: "🚗 Garita" },
  { id: "incidencias", texto: "⚠️ Incidencias" },
  { id: "admin", texto: "🛠️ Administración" },
  { id: "escenarios", texto: "🎬 Escenarios" },
  { id: "registro", texto: "📜 Registro" },
  { id: "postman", texto: "🔌 Postman" },
];

// El mismo semáforo de la app (D-009): verde = hay puesto, rojo = no hay puesto, gris = cerrado.
function colorSemaforo(e) {
  if (!e.activo) return "#8e8e93";
  return e.libres > 0 ? "#2f9e57" : "#d93a2e";
}

function BarraOcupacion({ estacionamiento }) {
  return (
    <div className="barra-ocupacion" aria-hidden="true">
      <span style={{ width: `${estacionamiento.activo ? estacionamiento.porcentaje : 0}%`, background: colorSemaforo(estacionamiento) }} />
    </div>
  );
}

function Marcas({ estacionamiento, incidencias }) {
  const pendientes = incidencias.filter((i) => i.estacionamientoId === estacionamiento.id).length;
  return (
    <span style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {estacionamiento.soloProfesores && <span className="marca marca-profesores">Profesores</span>}
      {!estacionamiento.activo && <span className="marca marca-cerrado">Cerrado</span>}
      {pendientes > 0 && <span className="marca marca-incidencia">⚠️ {pendientes}</span>}
    </span>
  );
}

function Elegido({ estacionamientos, incidencias, seleccionado, acciones }) {
  const e = estacionamientos.find((x) => x.id === seleccionado);
  return (
    <section className="tarjeta">
      <label className="campo">
        Estacionamiento (o haz clic en el mapa)
        <select value={seleccionado ?? ""} onChange={(ev) => acciones.seleccionar(ev.target.value)}>
          {estacionamientos.map((x) => (
            <option key={x.id} value={x.id}>
              {x.etiqueta}
              {x.activo ? "" : " (cerrado)"}
            </option>
          ))}
        </select>
      </label>
      {e && (
        <>
          <div className="elegido">
            <span className="semaforo" style={{ background: colorSemaforo(e), color: colorSemaforo(e) }} />
            <div>
              <strong>{e.activo ? `${e.libres} libres de ${e.capacidad}` : "Cerrado por el administrador"}</strong>
              <div className="tenue">
                {e.ocupados} ocupados · {e.porcentaje}% · {e.pisos ? `${e.pisos} pisos` : "al aire libre"}
              </div>
            </div>
            <Marcas estacionamiento={e} incidencias={incidencias} />
          </div>
          <BarraOcupacion estacionamiento={e} />
        </>
      )}
    </section>
  );
}

function PestanaGarita({ placa, tarea, acciones, elegido }) {
  return (
    <>
      <section className="tarjeta">
        <h2>Un carro en la garita</h2>
        <div className="fila">
          <label className="campo">
            Placa
            <input
              value={placa}
              maxLength={7}
              onChange={(e) => acciones.cambiarPlaca(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
            />
          </label>
          <button className="boton" style={{ flex: "0 0 auto" }} onClick={acciones.placaAlAzar} title="Placa al azar">
            🎲
          </button>
        </div>
        <div className="fila">
          <button className="boton boton-verde" onClick={acciones.entrada} disabled={!elegido}>
            🚗 Entrada
          </button>
          <button className="boton boton-rojo" onClick={acciones.salida} disabled={!elegido}>
            🚙 Salida
          </button>
        </div>
        <button className="boton boton-ambar" onClick={acciones.rafaga} disabled={!elegido || Boolean(tarea)}>
          ⚡ Ráfaga: 5 carros seguidos
        </button>
        <p className="ayuda">
          El carro recorre las vías reales. Al pasar la talanquera, el lector envía la placa a{" "}
          <code>POST /api/garita/lecturas</code>; al estacionarse (o al salir), el sensor avisa a{" "}
          <code>POST /api/avisos</code>. La app base decide si lo acepta: un estacionamiento lleno o cerrado
          rechaza el aviso y lo verás en rojo en el Registro.
        </p>
      </section>
    </>
  );
}

function PestanaIncidencias({ estacionamientos, incidencias, seleccionado, tarea, acciones, elegido }) {
  const etiqueta = (id) => estacionamientos.find((e) => e.id === id)?.etiqueta ?? id;
  const recientes = [...incidencias].reverse();
  return (
    <>
      <section className="tarjeta">
        <h2>Reportar en {elegido?.etiqueta ?? "…"}</h2>
        {TIPOS_DE_INCIDENCIA.map((t) => (
          <button
            key={t.id}
            className="boton boton-naranja boton-grande"
            onClick={() => acciones.reportarIncidencia(t.id)}
            disabled={!elegido}
          >
            <span style={{ fontSize: "1.3rem" }}>{t.icono}</span>
            <span>
              {t.nombre}
              <small>POST /api/incidencias · tipo {t.id}</small>
            </span>
          </button>
        ))}
        <div className="fila">
          <button className="boton" onClick={acciones.incidenciaAlAzar}>
            🎲 Una al azar
          </button>
          <button className="boton" onClick={acciones.olaDeIncidencias} disabled={Boolean(tarea)}>
            🌪️ Ola de 3
          </button>
        </div>
        <p className="ayuda">
          Se reportan como el usuario de prueba de la app, igual que con el formulario «Reportar
          incidencia». Un estacionamiento cerrado las rechaza (regla de la HU 9.1).
        </p>
      </section>

      <section className="tarjeta">
        <h2>Pendientes ({incidencias.length})</h2>
        {recientes.length === 0 ? (
          <p className="ayuda">No hay incidencias. Las que reporte cualquier persona en la app también aparecen aquí.</p>
        ) : (
          <ul className="lista">
            {recientes.map((i) => (
              <li key={i.id}>
                <button
                  className={`item ${i.estacionamientoId === seleccionado ? "item-elegido" : ""}`}
                  onClick={() => acciones.seleccionar(i.estacionamientoId)}
                >
                  <span className="item-cabecera">
                    <strong>
                      {TIPOS_DE_INCIDENCIA.find((t) => t.id === i.tipo)?.icono} {i.nombreTipo}
                    </strong>
                    <span className="marca marca-incidencia">{i.estado}</span>
                  </span>
                  <span className="tenue">
                    {etiqueta(i.estacionamientoId)} · {new Date(i.reportadaEn).toLocaleTimeString("es-VE")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function PestanaAdministracion({ estacionamientos, incidencias, seleccionado, acciones, elegido }) {
  const [capacidad, setCapacidad] = useState("");
  useEffect(() => setCapacidad(elegido ? String(elegido.capacidad) : ""), [elegido?.id, elegido?.capacidad]);

  return (
    <>
      {elegido && (
        <section className="tarjeta">
          <h2>{elegido.etiqueta}</h2>
          <div className="fila">
            <label className="campo">
              Capacidad (puestos)
              <input type="number" min={1} max={2000} value={capacidad} onChange={(e) => setCapacidad(e.target.value)} />
            </label>
            <button
              className="boton boton-azul"
              style={{ flex: "0 0 auto" }}
              onClick={() => acciones.cambiarEstacionamiento(elegido.id, { capacidad })}
              disabled={capacidad === String(elegido.capacidad)}
            >
              Guardar
            </button>
          </div>
          <button
            className={`boton ${elegido.activo ? "boton-rojo" : "boton-verde"}`}
            onClick={() => acciones.cambiarEstacionamiento(elegido.id, { activo: !elegido.activo })}
          >
            {elegido.activo ? "⛔ Cerrar (desactivar)" : "✅ Abrir (activar)"}
          </button>
          <p className="ayuda">
            <code>PATCH /api/estacionamientos/{elegido.id}</code> · mismas reglas que la página de administración
            (HU 5.4): los libres se recalculan con la nueva capacidad y un estacionamiento cerrado no se sugiere.
          </p>
        </section>
      )}

      <section className="tarjeta">
        <h2>Estado del campus</h2>
        <ul className="lista">
          {estacionamientos.map((e) => (
            <li key={e.id}>
              <button
                className={`item ${e.id === seleccionado ? "item-elegido" : ""}`}
                onClick={() => acciones.seleccionar(e.id)}
              >
                <span className="item-cabecera">
                  <strong>{e.etiqueta}</strong>
                  <Marcas estacionamiento={e} incidencias={incidencias} />
                </span>
                <BarraOcupacion estacionamiento={e} />
                <span className="tenue">
                  {e.activo ? `${e.libres} libres de ${e.capacidad} · ${e.porcentaje}%` : `Cerrado · ${e.capacidad} puestos`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

const ESCENARIOS = [
  {
    accion: "horaPico",
    titulo: "🌅 Hora pico de las 10:00 a.m.",
    detalle: "24 carros llegan a la garita, repartidos según los puestos libres. Animados.",
    clase: "boton-verde",
  },
  {
    accion: "finDeClases",
    titulo: "🏁 Fin de clases de las 2:00 p.m.",
    detalle: "20 carros salen, repartidos según los ocupados. Animados.",
    clase: "boton-rojo",
  },
  {
    accion: "llenar",
    titulo: "🟥 Llenar el campus",
    detalle: "Un aviso de entrada por cada puesto libre (sin animar). Todo queda en rojo.",
    clase: "boton-naranja",
  },
  {
    accion: "vaciar",
    titulo: "🟩 Vaciar el campus",
    detalle: "Un aviso de salida por cada carro (sin animar). Todo queda en verde.",
    clase: "boton-azul",
  },
  {
    accion: "olaDeIncidencias",
    titulo: "🌪️ Ola de incidencias",
    detalle: "3 incidencias al azar en estacionamientos abiertos.",
    clase: "boton",
  },
];

function PestanaEscenarios({ tarea, acciones }) {
  return (
    <>
      {tarea && (
        <section className="tarjeta">
          <h2>{tarea.nombre}</h2>
          <div className="progreso">
            <span style={{ width: `${(tarea.hechos / tarea.total) * 100}%` }} />
          </div>
          <div className="item-cabecera">
            <span className="tenue">
              {tarea.hechos} de {tarea.total}
            </span>
            <button className="boton boton-fantasma" onClick={acciones.detener}>
              ⏹ Detener
            </button>
          </div>
        </section>
      )}
      <section className="tarjeta">
        <h2>Escenarios de prueba</h2>
        {ESCENARIOS.map((e) => (
          <button
            key={e.accion}
            className={`boton boton-grande ${e.clase}`}
            onClick={acciones[e.accion]}
            disabled={Boolean(tarea)}
          >
            <span>
              {e.titulo}
              <small>{e.detalle}</small>
            </span>
          </button>
        ))}
        <p className="ayuda">
          Nada se fija "a mano": cada escenario manda avisos uno por uno, como lo harían los sensores, y la app
          base aplica sus reglas (nunca más carros que puestos, ni menos de cero).
        </p>
      </section>
      <section className="tarjeta">
        <h2>Volver al inicio</h2>
        <button className="boton boton-fantasma" onClick={acciones.reiniciar} disabled={Boolean(tarea)}>
          🔄 Reiniciar la app base
        </button>
        <p className="ayuda">
          <code>POST /api/pruebas/reiniciar</code> · solo existe en desarrollo: vuelve a los datos de ejemplo y borra
          incidencias, avisos y placas leídas.
        </p>
      </section>
    </>
  );
}

function PestanaRegistro({ registro, acciones }) {
  return (
    <section className="tarjeta">
      <div className="item-cabecera">
        <h2>Registro ({registro.length})</h2>
        <button className="boton boton-fantasma" onClick={acciones.limpiarRegistro} disabled={registro.length === 0}>
          Limpiar
        </button>
      </div>
      <p className="ayuda">Verde: la app aceptó la llamada. Rojo: la rechazó. Azul: algo que pasó en la app.</p>
      {registro.length === 0 ? (
        <p className="ayuda">Todavía no hay llamadas.</p>
      ) : (
        <ul className="lista">
          {registro.map((r) => (
            <li key={r.id} className={`item registro-${r.clase}`}>
              <span className="item-cabecera">
                <span>{r.texto}</span>
                <span className="tenue">{r.hora}</span>
              </span>
              {r.detalle && <span className="codigo">{r.detalle}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PestanaPostman({ urlAppBase, seleccionado, placa }) {
  const id = seleccionado ?? "est-playa";
  const llamadas = [
    {
      titulo: "Aviso de un sensor (HU 3.1)",
      texto: `POST ${urlAppBase}/api/avisos\nx-clave-sensor: clave-de-desarrollo\n\n{ "estacionamientoId": "${id}", "tipo": "ENTRADA" }`,
    },
    {
      titulo: "Lectura de placa en la garita (HU 3.2)",
      texto: `POST ${urlAppBase}/api/garita/lecturas\nx-clave-sensor: clave-de-desarrollo\n\n{ "placa": "${placa}", "sentido": "ENTRADA" }`,
    },
    {
      titulo: "Reportar una incidencia (HU 9.1)",
      texto: `POST ${urlAppBase}/api/incidencias\n\n{ "estacionamientoId": "${id}", "tipo": "conos_atravesados" }`,
    },
    {
      titulo: "Cerrar un estacionamiento (HU 5.4)",
      texto: `PATCH ${urlAppBase}/api/estacionamientos/${id}\n\n{ "activo": false }`,
    },
    { titulo: "Estado de los estacionamientos", texto: `GET ${urlAppBase}/api/estacionamientos` },
    { titulo: "Canal en vivo", texto: `GET ${urlAppBase}/api/eventos   (text/event-stream)` },
  ];
  return (
    <section className="tarjeta">
      <h2>Llamar a la app base desde Postman</h2>
      <p className="ayuda">
        Lo que mandes desde Postman llega a la app base como un aviso real, y el simulador lo dibuja (marcador rosa).
        Colección lista para importar: <code>RadarEstacionamientos_simulador/postman/</code>.
      </p>
      {llamadas.map((l) => (
        <div key={l.titulo} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div className="item-cabecera">
            <strong style={{ fontSize: "0.8rem" }}>{l.titulo}</strong>
            <button className="boton boton-fantasma" onClick={() => navigator.clipboard?.writeText(l.texto)}>
              Copiar
            </button>
          </div>
          <pre className="codigo">{l.texto}</pre>
        </div>
      ))}
    </section>
  );
}

export default function PanelDeControl({ hidden, urlAppBase, estacionamientos, incidencias, seleccionado, placa, registro, tarea, acciones }) {
  const [pestana, setPestana] = useState("garita");
  const elegido = estacionamientos.find((e) => e.id === seleccionado);
  const comunes = { estacionamientos, incidencias, seleccionado, acciones, elegido, tarea };

  return (
    <aside className="menu" hidden={hidden} aria-label="Menú del simulador">
      <div className="pestanas" role="tablist">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            role="tab"
            className="pestana"
            aria-selected={pestana === p.id}
            onClick={() => setPestana(p.id)}
          >
            {p.texto}
            {p.id === "incidencias" && incidencias.length > 0 ? ` (${incidencias.length})` : ""}
          </button>
        ))}
      </div>
      <div className="contenido-menu" role="tabpanel">
        {estacionamientos.length === 0 ? (
          <p className="ayuda">Esperando a la app base…</p>
        ) : (
          <>
            {["garita", "incidencias", "admin"].includes(pestana) && <Elegido {...comunes} />}
            {pestana === "garita" && <PestanaGarita placa={placa} {...comunes} />}
            {pestana === "incidencias" && <PestanaIncidencias {...comunes} />}
            {pestana === "admin" && <PestanaAdministracion {...comunes} />}
            {pestana === "escenarios" && <PestanaEscenarios {...comunes} />}
            {pestana === "registro" && <PestanaRegistro registro={registro} acciones={acciones} />}
            {pestana === "postman" && <PestanaPostman urlAppBase={urlAppBase} seleccionado={seleccionado} placa={placa} />}
          </>
        )}
      </div>
    </aside>
  );
}
