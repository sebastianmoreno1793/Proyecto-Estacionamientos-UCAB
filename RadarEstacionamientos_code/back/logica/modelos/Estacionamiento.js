// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Una entrada ocupa un puesto y una salida lo libera; nunca menos de 0 ni más que la capacidad
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Calcula los libres, el porcentaje y el semáforo
// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Guarda la forma (polígono y pisos) para dibujarlo
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Cambia la capacidad y abre o cierra; si la capacidad queda por debajo de los ocupados, hay 0 libres
// Modelo · Un estacionamiento del campus. Su estado es privado y solo cambia con sus métodos.
import { ErrorDeNegocio } from "./ErrorDeNegocio.js";
import { Movimiento } from "./Movimiento.js";
import { Semaforo } from "./Semaforo.js";

export class Estacionamiento {
  #id;
  #nombre;
  #etiqueta;
  #soloProfesores;
  #capacidad;
  #ocupados;
  #activo;
  #poligono;
  #pisos;

  constructor({ id, nombre, etiqueta = nombre, soloProfesores = false, capacidad, ocupados = 0, activo = true, poligono = [], pisos = null }) {
    this.#id = id;
    this.#nombre = nombre;
    this.#etiqueta = etiqueta;
    this.#soloProfesores = soloProfesores;
    this.#capacidad = capacidad;
    this.#ocupados = ocupados;
    this.#activo = activo;
    this.#poligono = poligono.map((p) => [...p]);
    this.#pisos = pisos;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get etiqueta() { return this.#etiqueta; }
  get soloProfesores() { return this.#soloProfesores; }
  get capacidad() { return this.#capacidad; }
  get ocupados() { return this.#ocupados; }
  get activo() { return this.#activo; }
  get poligono() { return this.#poligono.map((p) => [...p]); }
  get pisos() { return this.#pisos; }

  // @HU-4.2 Consultar el semáforo de ocupación · Aaron
  // @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
  // REGLA: capacidad menos ocupados, nunca menos de 0 ni más que la capacidad.
  libres() {
    return Math.min(this.#capacidad, Math.max(0, this.#capacidad - this.#ocupados));
  }

  // @HU-4.2 Consultar el semáforo de ocupación · Aaron
  // Porcentaje de ocupación, entre 0 y 100.
  porcentaje() {
    if (!(this.#capacidad > 0)) return 100;
    return Math.round((Math.min(this.#capacidad, Math.max(0, this.#ocupados)) / this.#capacidad) * 100);
  }

  // @HU-4.2 Consultar el semáforo de ocupación · Aaron
  semaforo() {
    return Semaforo.segun({ libres: this.libres(), activo: this.#activo });
  }

  estaAbierto() {
    return this.#activo;
  }

  // @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — dice por qué un aviso no se puede aplicar
  // REGLA DE NEGOCIO: devuelve el motivo por el que no se puede registrar el movimiento
  // («tipo», «lleno» o «vacio») o null si sí se puede. Un estacionamiento cerrado también cuenta
  // sus avisos: los carros siguen entrando y saliendo aunque no se muestre.
  motivoDeRechazo(tipo) {
    if (!Movimiento.TIPOS.includes(tipo)) return "tipo";
    if (tipo === Movimiento.ENTRADA && this.#ocupados >= this.#capacidad) return "lleno";
    if (tipo === Movimiento.SALIDA && this.#ocupados <= 0) return "vacio";
    return null;
  }

  // Texto del rechazo para quien mandó el aviso.
  mensajeDeRechazo(motivo) {
    const mensajes = {
      tipo: "El tipo debe ser ENTRADA o SALIDA.",
      lleno: `${this.#etiqueta} está lleno.`,
      vacio: `En ${this.#etiqueta} no hay carros para salir.`,
    };
    return mensajes[motivo] ?? "Aviso rechazado.";
  }

  // @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — entrada ocupa un puesto
  registrarEntrada() {
    this.#exigirQueSePueda(Movimiento.ENTRADA);
    this.#ocupados += 1;
  }

  // @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — salida libera un puesto
  registrarSalida() {
    this.#exigirQueSePueda(Movimiento.SALIDA);
    this.#ocupados -= 1;
  }

  // Aplica una ENTRADA o una SALIDA.
  registrarMovimiento(tipo) {
    if (tipo === Movimiento.SALIDA) this.registrarSalida();
    else this.registrarEntrada();
  }

  #exigirQueSePueda(tipo) {
    const motivo = this.motivoDeRechazo(tipo);
    if (motivo) throw new ErrorDeNegocio(this.mensajeDeRechazo(motivo), motivo);
  }

  // @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
  // Fija la capacidad nueva. Si queda por debajo de los carros que ya están dentro, los libres
  // quedan en 0 (y el semáforo en rojo) hasta que salgan.
  cambiarCapacidad(capacidad) {
    this.#capacidad = capacidad;
  }

  // @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian
  abrir() {
    this.#activo = true;
  }

  // @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — un cerrado no se sugiere ni se reporta
  cerrar() {
    this.#activo = false;
  }

  // Algunos lugares tienen varias zonas con el mismo nombre (Presambilito, Pádel). La etiqueta
  // añade la zona sacada del id: la zona cuyo id es la base de las demás es la «principal»
  // (est-padel) y el resto toma lo que sigue (est-padel-norte → «norte»).
  static etiquetasUnicas(lista) {
    return lista.map((e) => {
      const grupo = lista.filter((o) => o.nombre === e.nombre);
      if (grupo.length === 1) return e.nombre;
      const base = grupo.find((b) => grupo.every((o) => o === b || o.id.startsWith(`${b.id}-`)));
      const zona = !base ? e.id : e === base ? "principal" : e.id.slice(base.id.length + 1);
      return `${e.nombre} (${zona})`;
    });
  }

  // Del registro guardado al modelo y de vuelta (lo usa EstacionamientoRepositorio).
  static desde(registro) {
    return new Estacionamiento(registro);
  }

  aRegistro() {
    return {
      id: this.#id,
      nombre: this.#nombre,
      etiqueta: this.#etiqueta,
      soloProfesores: this.#soloProfesores,
      capacidad: this.#capacidad,
      ocupados: this.#ocupados,
      activo: this.#activo,
      poligono: this.poligono,
      pisos: this.#pisos,
    };
  }
}
