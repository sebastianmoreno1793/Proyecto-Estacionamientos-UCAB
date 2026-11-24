// Servicio · SOLO EN DESARROLLO: vuelve todo a los datos de ejemplo (ocupación, incidencias, avisos,
// lecturas y edificios) para repetir una demo o una prueba desde el mismo punto de partida. Las
// cuentas y las sesiones se conservan, para no sacar a nadie.
export class PruebasServicio {
  #repositorio;
  #estacionamientoServicio;
  #filtro;
  #monitor;
  #eventos;

  constructor({ estacionamientoRepositorio, estacionamientoServicio, filtroDeAvisos, monitorDeSensores, eventos }) {
    this.#repositorio = estacionamientoRepositorio;
    this.#estacionamientoServicio = estacionamientoServicio;
    this.#filtro = filtroDeAvisos;
    this.#monitor = monitorDeSensores;
    this.#eventos = eventos;
  }

  async reiniciar() {
    await this.#repositorio.reiniciarDatosDeEjemplo();
    this.#filtro.reiniciar();
    this.#monitor.reiniciar();
    const estacionamientos = await this.#estacionamientoServicio.listar();
    this.#eventos.emitir("REINICIO", { estacionamientos });
    return estacionamientos;
  }
}
