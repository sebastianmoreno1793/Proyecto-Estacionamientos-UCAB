// Fábrica · Crea UNA sola vez cada pieza del back y las conecta, de abajo hacia arriba:
// repositorios → tácticas → servicios → controladores. Las rutas (front/app/api/**/route.js) piden
// aquí su controlador. Vive en globalThis para que sobreviva a las recargas de `next dev`.
// Las pruebas automáticas crean su propia Fábrica con `new Fabrica()`.
import { AvisoRechazadoRepositorio } from "./repositorios/AvisoRechazadoRepositorio.js";
import { EdificioRepositorio } from "./repositorios/EdificioRepositorio.js";
import { EstacionamientoRepositorio } from "./repositorios/EstacionamientoRepositorio.js";
import { IncidenciaRepositorio } from "./repositorios/IncidenciaRepositorio.js";
import { LecturaDePlacaRepositorio } from "./repositorios/LecturaDePlacaRepositorio.js";
import { MovimientoRepositorio } from "./repositorios/MovimientoRepositorio.js";
import { SesionRepositorio } from "./repositorios/SesionRepositorio.js";
import { UsuarioRepositorio } from "./repositorios/UsuarioRepositorio.js";
import { VehiculoRepositorio } from "./repositorios/VehiculoRepositorio.js";
import { AutenticadorDeSensores } from "./tacticas/AutenticadorDeSensores.js";
import { ControlDeAcceso } from "./tacticas/ControlDeAcceso.js";
import { FiltroDeAvisos } from "./tacticas/FiltroDeAvisos.js";
import { MonitorDeSensores } from "./tacticas/MonitorDeSensores.js";
import { AforoServicio } from "./servicios/AforoServicio.js";
import { CuentaServicio } from "./servicios/CuentaServicio.js";
import { EdificioServicio } from "./servicios/EdificioServicio.js";
import { EstacionamientoServicio } from "./servicios/EstacionamientoServicio.js";
import { EventosEnVivoServicio } from "./servicios/EventosEnVivoServicio.js";
import { GaritaServicio } from "./servicios/GaritaServicio.js";
import { IncidenciaServicio } from "./servicios/IncidenciaServicio.js";
import { PruebasServicio } from "./servicios/PruebasServicio.js";
import { SugerenciaServicio } from "./servicios/SugerenciaServicio.js";
import { VehiculoServicio } from "./servicios/VehiculoServicio.js";
import { AvisoControlador } from "./controladores/AvisoControlador.js";
import { CuentaControlador } from "./controladores/CuentaControlador.js";
import { EdificioControlador } from "./controladores/EdificioControlador.js";
import { EstacionamientoControlador } from "./controladores/EstacionamientoControlador.js";
import { EventoControlador } from "./controladores/EventoControlador.js";
import { GaritaControlador } from "./controladores/GaritaControlador.js";
import { IncidenciaControlador } from "./controladores/IncidenciaControlador.js";
import { PruebasControlador } from "./controladores/PruebasControlador.js";
import { SugerenciaControlador } from "./controladores/SugerenciaControlador.js";
import { VehiculoControlador } from "./controladores/VehiculoControlador.js";

export class Fabrica {
  // La única Fábrica de la app (la usan las rutas).
  static obtener() {
    globalThis.__radarFabrica ??= new Fabrica();
    return globalThis.__radarFabrica;
  }

  constructor({ filtro = {}, monitor = {} } = {}) {
    // Repositorios (lo único que toca los datos).
    const repositorios = {
      estacionamientoRepositorio: new EstacionamientoRepositorio(),
      movimientoRepositorio: new MovimientoRepositorio(),
      avisoRechazadoRepositorio: new AvisoRechazadoRepositorio(),
      lecturaDePlacaRepositorio: new LecturaDePlacaRepositorio(),
      incidenciaRepositorio: new IncidenciaRepositorio(),
      edificioRepositorio: new EdificioRepositorio(),
      usuarioRepositorio: new UsuarioRepositorio(),
      sesionRepositorio: new SesionRepositorio(),
      vehiculoRepositorio: new VehiculoRepositorio(),
    };
    const eventos = new EventosEnVivoServicio();

    // Tácticas de disponibilidad.
    const filtroDeAvisos = new FiltroDeAvisos(repositorios.avisoRechazadoRepositorio, filtro);
    const monitorDeSensores = new MonitorDeSensores(monitor);

    // Servicios (reglas de negocio de cada HU).
    const cuentaServicio = new CuentaServicio(repositorios);
    const estacionamientoServicio = new EstacionamientoServicio({ ...repositorios, eventos });
    this.servicios = {
      aforoServicio: new AforoServicio({ ...repositorios, filtroDeAvisos, monitorDeSensores, eventos }),
      cuentaServicio,
      edificioServicio: new EdificioServicio(repositorios),
      estacionamientoServicio,
      garitaServicio: new GaritaServicio({ ...repositorios, eventos }),
      incidenciaServicio: new IncidenciaServicio({ ...repositorios, eventos }),
      pruebasServicio: new PruebasServicio({ ...repositorios, estacionamientoServicio, filtroDeAvisos, monitorDeSensores, eventos }),
      sugerenciaServicio: new SugerenciaServicio(repositorios),
      vehiculoServicio: new VehiculoServicio(repositorios),
      eventos,
    };

    // Tácticas de seguridad.
    const autenticadorDeSensores = new AutenticadorDeSensores();
    const controlDeAcceso = new ControlDeAcceso(cuentaServicio);
    this.tacticas = { autenticadorDeSensores, controlDeAcceso, filtroDeAvisos, monitorDeSensores };

    // Controladores (los llaman las rutas).
    const piezas = { ...this.servicios, autenticadorDeSensores, controlDeAcceso };
    this.avisoControlador = new AvisoControlador(piezas);
    this.cuentaControlador = new CuentaControlador(piezas);
    this.edificioControlador = new EdificioControlador(piezas);
    this.estacionamientoControlador = new EstacionamientoControlador(piezas);
    this.eventoControlador = new EventoControlador(piezas);
    this.garitaControlador = new GaritaControlador(piezas);
    this.incidenciaControlador = new IncidenciaControlador(piezas);
    this.pruebasControlador = new PruebasControlador(piezas);
    this.sugerenciaControlador = new SugerenciaControlador(piezas);
    this.vehiculoControlador = new VehiculoControlador(piezas);
  }
}
