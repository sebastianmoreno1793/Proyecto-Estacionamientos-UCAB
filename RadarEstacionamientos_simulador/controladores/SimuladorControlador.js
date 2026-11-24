// SimuladorControlador · El control del simulador: guarda lo que se ve (estacionamientos,
// incidencias, registro, tarea en curso), escucha el canal en vivo de la app base, convierte lo
// que pasa en el mundo 3D en llamadas a la API y corre los escenarios de prueba.
//
// Regla de oro: el simulador NO toca la app por dentro. Todo va por su API pública (la misma que
// usarían los sensores, el lector de placas, Postman o un usuario) y lo que pasa en la app llega
// de vuelta por su canal en vivo (GET /api/eventos).
//
// La página lo usa con useSyncExternalStore(suscribir, instantanea): cada cambio crea un estado
// nuevo y avisa a quien esté suscrito.
import { ClienteAppBase } from "../conexion_app/ClienteAppBase.js";
import { GeneradorDeEscenarios } from "../escenarios_prueba/GeneradorDeEscenarios.js";

export class SimuladorControlador {
  static MAX_REGISTRO = 120; // entradas del registro (como la consola de Postman)
  static MAX_ORDENES = 40; // órdenes que se guardan para el mundo 3D

  static ESTADO_INICIAL = Object.freeze({
    estacionamientos: [],
    incidencias: [],
    conexion: "conectando", // conectando · conectada · sin_conexion
    seleccionado: null,
    placa: "AB123CD",
    registro: [],
    tarea: null, // escenario en curso: { nombre, hechos, total }
    ordenes: null, // lote de órdenes para el mundo 3D
  });

  #api;
  #escenarios;
  #estado = SimuladorControlador.ESTADO_INICIAL;
  #suscriptores = new Set();
  #misAvisos = new Set(); // avisos que mandó este simulador (no se re-animan)
  #misLecturas = new Set();
  #secuencia = 0;
  #cancelar = false;

  constructor({ api = new ClienteAppBase(), escenarios = new GeneradorDeEscenarios() } = {}) {
    this.#api = api;
    this.#escenarios = escenarios;
  }

  // ---------- Para useSyncExternalStore ----------

  suscribir = (alCambiar) => {
    this.#suscriptores.add(alCambiar);
    return () => this.#suscriptores.delete(alCambiar);
  };

  instantanea = () => this.#estado;

  // ---------- Lo que se ve, calculado del estado ----------

  // Los estacionamientos como los dibuja el mundo 3D: con su selección y sus incidencias.
  static paraElMapa({ estacionamientos, incidencias, seleccionado }) {
    return estacionamientos.map((e) => ({
      ...e,
      seleccionado: e.id === seleccionado,
      incidencias: incidencias.filter((i) => i.estacionamientoId === e.id),
    }));
  }

  // Cifras de la barra de arriba.
  static resumen({ estacionamientos, incidencias }) {
    const activos = estacionamientos.filter((e) => e.activo);
    const capacidad = activos.reduce((s, e) => s + e.capacidad, 0);
    const ocupados = activos.reduce((s, e) => s + Math.min(e.ocupados, e.capacidad), 0);
    return {
      libres: activos.reduce((s, e) => s + e.libres, 0),
      porcentaje: capacidad ? Math.round((ocupados / capacidad) * 100) : 0,
      cerrados: estacionamientos.length - activos.length,
      incidencias: incidencias.filter((i) => i.estado === "pendiente").length,
    };
  }

  // ---------- Estado de la app base y canal en vivo ----------

  cargarEstado = async () => {
    const r = await this.#api.estacionamientos();
    if (!r.ok) {
      this.#cambiar({ conexion: "sin_conexion" });
      return;
    }
    this.#fusionar(r.datos.estacionamientos);
    this.#cambiar({ seleccionado: this.#estado.seleccionado ?? r.datos.estacionamientos[0]?.id ?? null });
    const ri = await this.#api.incidencias();
    if (ri.ok) this.#cambiar({ incidencias: ri.datos.incidencias });
  };

  // Escucha el canal en vivo de la app base: así se ve también lo que hacen Postman, otros
  // simuladores o las personas que usan la app. Devuelve la función para dejar de escuchar.
  conectar() {
    this.cargarEstado();
    // @FETCH Simulador › canal en vivo /api/eventos (EventSource) — escucha lo que pasa en la app para mostrarlo en el registro
    const fuente = new EventSource(ClienteAppBase.URL_EVENTOS);
    fuente.onerror = () => this.#cambiar({ conexion: "sin_conexion" });
    fuente.onmessage = (e) => {
      try {
        this.#alMensaje(JSON.parse(e.data));
      } catch {
        // mensaje que no es JSON: se ignora
      }
    };
    return () => fuente.close();
  }

  #alMensaje(m) {
    switch (m.clase) {
      case "CONEXION":
        this.#cambiar({ conexion: "conectada" });
        this.cargarEstado(); // al (re)conectar, se pone al día
        break;
      case "AVISO": {
        const { movimiento, estacionamiento } = m;
        this.#fusionar([estacionamiento]);
        if (!this.#misAvisos.has(movimiento.idAviso)) {
          this.#ordenar({ tipo: movimiento.tipo, estacionamientoId: movimiento.estacionamientoId, origen: "externo" });
          this.#anotar({
            clase: "evento",
            texto: `📡 Aviso externo: ${movimiento.tipo === "ENTRADA" ? "entrada en" : "salida de"} ${estacionamiento.etiqueta}`,
            detalle: `${estacionamiento.libres} libres · ${estacionamiento.porcentaje}%`,
          });
        }
        break;
      }
      case "LECTURA_GARITA":
        if (!this.#misLecturas.has(m.idLectura)) {
          this.#anotar({ clase: "evento", texto: `📷 La garita leyó una placa (${m.sentido.toLowerCase()}) desde otro cliente` });
        }
        break;
      case "INCIDENCIA":
        this.#agregarIncidencia(m.incidencia);
        this.#ordenar({ tipo: "ENFOCAR", estacionamientoId: m.incidencia.estacionamientoId });
        this.#anotar({ clase: "evento", texto: `⚠️ Incidencia: ${m.incidencia.nombreTipo}`, detalle: m.incidencia.estacionamientoId });
        break;
      case "ESTACIONAMIENTO":
        this.#fusionar([m.estacionamiento]);
        this.#anotar({ clase: "evento", texto: `🛠️ ${SimuladorControlador.#describirCambio(m.estacionamiento)}` });
        break;
      case "REINICIO":
        this.#fusionar(m.estacionamientos);
        this.#cambiar({ incidencias: [] });
        this.#anotar({ clase: "evento", texto: "🔄 La app base volvió a los datos de ejemplo" });
        break;
      default:
    }
  }

  // ---------- Lo que pasa en el mundo 3D se convierte en llamadas a la app base ----------

  alDispararEvento = async (evento) => {
    if (evento.tipo === "SELECCIONAR") {
      this.#cambiar({ seleccionado: evento.estacionamientoId });
      return;
    }
    if (evento.tipo === "LECTURA_PLACA") {
      this.#misLecturas.add(evento.idLectura);
      const r = await this.#api.lecturaDePlaca(evento.placa, evento.sentido, evento.idLectura);
      this.#anotarLlamada(r, r.ok ? `📷 Garita: placa ${evento.placa} (${evento.sentido.toLowerCase()})` : undefined);
      return;
    }
    if (evento.tipo === "AVISO") {
      this.#misAvisos.add(evento.idAviso); // antes de enviarlo: el eco del canal llega rápido
      const r = await this.#api.aviso(evento.estacionamientoId, evento.movimiento, evento.idAviso);
      if (r.ok) {
        const e = r.datos.estacionamiento;
        this.#fusionar([e]);
        this.#anotarLlamada(r, `${evento.movimiento === "ENTRADA" ? "🟢 Entró a" : "🔴 Salió de"} ${e.etiqueta} · ${e.libres} libres`);
      } else {
        this.#anotarLlamada(r);
        this.cargarEstado(); // el mapa vuelve a lo que dice la app
      }
    }
  };

  // ---------- Acciones del menú (PanelDeControl) ----------

  acciones = {
    seleccionar: (id) => {
      this.#cambiar({ seleccionado: id });
      this.#ordenar({ tipo: "ENFOCAR", estacionamientoId: id });
    },
    cambiarPlaca: (placa) => this.#cambiar({ placa }),
    placaAlAzar: () => this.#cambiar({ placa: this.#escenarios.placaAleatoria() }),
    entrada: () => this.#mandarCarro("ENTRADA"),
    salida: () => this.#mandarCarro("SALIDA"),
    rafaga: () => {
      const id = this.#estado.seleccionado;
      return this.#correrTarea(
        `Ráfaga en ${this.#etiquetaDe(id)}`,
        Array.from({ length: 5 }, () => async () => this.#mandarCarro("ENTRADA", id, this.#escenarios.placaAleatoria())),
        { pausa: 1200 },
      );
    },

    reportarIncidencia: async (tipo, estacionamientoId = this.#estado.seleccionado) => {
      const r = await this.#api.reportarIncidencia(estacionamientoId, tipo);
      if (r.ok) this.#agregarIncidencia(r.datos.incidencia);
      this.#anotarLlamada(r, r.ok ? `⚠️ ${r.datos.incidencia.nombreTipo} en ${this.#etiquetaDe(estacionamientoId)}` : undefined);
    },
    incidenciaAlAzar: async () => {
      const azar = this.#escenarios.incidenciaAleatoria(this.#estado.estacionamientos, ClienteAppBase.TIPOS_DE_INCIDENCIA);
      if (azar) await this.acciones.reportarIncidencia(azar.tipo, azar.estacionamientoId);
    },
    olaDeIncidencias: () =>
      this.#correrTarea("Ola de incidencias", Array.from({ length: 3 }, () => () => this.acciones.incidenciaAlAzar()), { pausa: 900 }),

    cambiarEstacionamiento: async (id, cambios) => {
      const r = await this.#api.cambiarEstacionamiento(id, cambios);
      if (r.ok) this.#fusionar([r.datos.estacionamiento]);
      this.#anotarLlamada(r, r.ok ? `🛠️ ${SimuladorControlador.#describirCambio(r.datos.estacionamiento)}` : undefined);
    },

    horaPico: () => {
      const ids = this.#escenarios.repartirLlegadas(this.#estado.estacionamientos, 24);
      return this.#correrTarea(
        "Hora pico de las 10:00 a.m.",
        ids.map((id) => async () => this.#mandarCarro("ENTRADA", id, this.#escenarios.placaAleatoria())),
        { pausa: 650 },
      );
    },
    finDeClases: () => {
      const ids = this.#escenarios.repartirSalidas(this.#estado.estacionamientos, 20);
      return this.#correrTarea(
        "Fin de clases de las 2:00 p.m.",
        ids.map((id) => async () => this.#mandarCarro("SALIDA", id, this.#escenarios.placaAleatoria())),
        { pausa: 650 },
      );
    },
    // Llenar y vaciar: cientos de avisos sin animación, directo a la API (como muchos sensores).
    llenar: () =>
      this.#correrTarea("Llenar el campus", GeneradorDeEscenarios.avisosParaLlenar(this.#estado.estacionamientos).map((a) => () => this.#avisoDirecto(a)), {
        enParalelo: 6,
      }),
    vaciar: () =>
      this.#correrTarea("Vaciar el campus", GeneradorDeEscenarios.avisosParaVaciar(this.#estado.estacionamientos).map((a) => () => this.#avisoDirecto(a)), {
        enParalelo: 6,
      }),
    reiniciar: async () => {
      const r = await this.#api.reiniciar();
      if (r.ok) {
        this.#fusionar(r.datos.estacionamientos);
        this.#cambiar({ incidencias: [] });
      }
      this.#anotarLlamada(r, r.ok ? "🔄 App base reiniciada con los datos de ejemplo" : undefined);
    },
    detener: () => {
      this.#cancelar = true;
    },
    limpiarRegistro: () => this.#cambiar({ registro: [] }),
  };

  // ---------- Por dentro ----------

  #cambiar(cambios) {
    this.#estado = { ...this.#estado, ...cambios };
    for (const alCambiar of this.#suscriptores) alCambiar();
  }

  #etiquetaDe(id) {
    return this.#estado.estacionamientos.find((e) => e.id === id)?.etiqueta ?? id;
  }

  static #describirCambio(e) {
    return `${e.etiqueta}: ${e.activo ? "activo" : "desactivado"}, ${e.capacidad} puestos`;
  }

  // Mezcla lo que llegó de la app base con lo que ya se tenía (la primera vez, lo toma entero).
  #fusionar(nuevos) {
    const porId = new Map(nuevos.map((e) => [e.id, e]));
    const previo = this.#estado.estacionamientos;
    this.#cambiar({
      estacionamientos: previo.length === 0 ? nuevos : previo.map((e) => (porId.has(e.id) ? { ...e, ...porId.get(e.id) } : e)),
    });
  }

  #agregarIncidencia(incidencia) {
    const { incidencias } = this.#estado;
    if (!incidencias.some((i) => i.id === incidencia.id)) this.#cambiar({ incidencias: [...incidencias, incidencia] });
  }

  #anotar(entrada) {
    const hora = new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const registro = [{ id: crypto.randomUUID(), hora, ...entrada }, ...this.#estado.registro].slice(0, SimuladorControlador.MAX_REGISTRO);
    this.#cambiar({ registro });
  }

  #anotarLlamada(r, texto) {
    this.#anotar({
      clase: r.ok ? "ok" : "error",
      texto: texto ?? r.datos?.error ?? "Sin respuesta",
      detalle: `${r.metodo} ${r.ruta} · ${r.estado || "sin conexión"} · ${r.ms} ms`,
    });
  }

  // Órdenes para el mundo 3D, en lote con `seq` creciente para que no se pierda ninguna.
  #ordenar(orden) {
    const conSecuencia = { ...orden, seq: ++this.#secuencia };
    const previas = this.#estado.ordenes?.ordenes ?? [];
    this.#cambiar({ ordenes: { ordenes: [...previas.slice(-SimuladorControlador.MAX_ORDENES), conSecuencia] } });
  }

  // Un carro del simulador entra o sale: el mundo 3D lo anima y, al pasar, manda los avisos.
  #mandarCarro(tipo, estacionamientoId = this.#estado.seleccionado, placa = this.#estado.placa) {
    if (!estacionamientoId) return;
    this.#ordenar({ tipo, estacionamientoId, placa, origen: "simulador", idAviso: crypto.randomUUID() });
    this.#cambiar({ placa: this.#escenarios.placaAleatoria() });
  }

  async #avisoDirecto({ estacionamientoId, tipo }) {
    const idAviso = crypto.randomUUID();
    this.#misAvisos.add(idAviso);
    const r = await this.#api.aviso(estacionamientoId, tipo, idAviso);
    if (!r.ok) this.#anotarLlamada(r);
  }

  // Corre los pasos de un escenario (de a `enParalelo`, con `pausa` ms entre uno y otro); se puede detener.
  async #correrTarea(nombre, pasos, { pausa = 0, enParalelo = 1 } = {}) {
    if (pasos.length === 0) {
      this.#anotar({ clase: "error", texto: `${nombre}: no hay nada que hacer con el estado actual del campus.` });
      return;
    }
    this.#cancelar = false;
    this.#cambiar({ tarea: { nombre, hechos: 0, total: pasos.length } });
    let hechos = 0;
    let siguiente = 0;
    const trabajador = async () => {
      while (siguiente < pasos.length && !this.#cancelar) {
        const paso = pasos[siguiente++];
        await paso();
        hechos++;
        if (hechos % 5 === 0 || hechos === pasos.length) this.#cambiar({ tarea: { nombre, hechos, total: pasos.length } });
        if (pausa) await new Promise((listo) => setTimeout(listo, pausa));
      }
    };
    await Promise.all(Array.from({ length: enParalelo }, trabajador));
    this.#anotar({
      clase: this.#cancelar ? "error" : "ok",
      texto: `${this.#cancelar ? "⏹ Detenido" : "🎬 Listo"}: ${nombre} (${hechos} de ${pasos.length})`,
    });
    this.#cambiar({ tarea: null });
  }
}
