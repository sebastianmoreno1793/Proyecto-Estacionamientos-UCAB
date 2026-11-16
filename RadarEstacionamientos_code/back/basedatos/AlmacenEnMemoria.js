// Almacén EN MEMORIA, temporal mientras el equipo elige la base de datos. Solo lo usan los
// repositorios (back/repositorios/): al llegar la base de datos se cambian ellos y nada más.
// Guarda registros simples (objetos), como lo haría una tabla; los modelos los arman los repositorios.
// Vive en globalThis para que sobreviva a las recargas de `next dev`.
import { ESTACIONAMIENTOS } from "./datos_iniciales/estacionamientos.js";
import { CAPACIDAD_DE_EJEMPLO, CAPACIDAD_POR_DEFECTO } from "./datos_iniciales/capacidad_inicial.js";
import { EDIFICIOS } from "./datos_iniciales/edificios.js";
import { USUARIOS_DE_PRUEBA } from "./datos_iniciales/usuarios_de_prueba.js";
import { Estacionamiento } from "../modelos/Estacionamiento.js";
import { Usuario } from "../modelos/Usuario.js";

const CLAVE_GLOBAL = "__radarAlmacenEnMemoria";

// Tablas que vuelven a los datos de ejemplo con «reiniciar» (POST /api/pruebas/reiniciar).
const TABLAS_DEL_CAMPUS = ["estacionamientos", "movimientos", "avisosRechazados", "lecturasDePlaca", "incidencias", "edificios"];
// Tablas que sobreviven al reinicio, para no cerrarle la sesión a nadie.
const TABLAS_DE_CUENTAS = ["usuarios", "sesiones", "vehiculos"];

export class AlmacenEnMemoria {
  // Devuelve la tabla (una lista de registros). La crea la primera vez.
  static tabla(nombre) {
    const almacen = AlmacenEnMemoria.#obtener();
    if (!almacen[nombre]) throw new Error(`No existe la tabla «${nombre}».`);
    return almacen[nombre];
  }

  // Vuelve a los datos de ejemplo del campus (ocupación, incidencias, avisos, lecturas y edificios).
  static reiniciar() {
    Object.assign(AlmacenEnMemoria.#obtener(), AlmacenEnMemoria.#datosDelCampus());
  }

  // Borra también usuarios, sesiones y vehículos (lo usan las pruebas automáticas).
  static reiniciarTodo() {
    globalThis[CLAVE_GLOBAL] = { ...AlmacenEnMemoria.#datosDelCampus(), ...AlmacenEnMemoria.#datosDeCuentas() };
  }

  static #obtener() {
    globalThis[CLAVE_GLOBAL] ??= { ...AlmacenEnMemoria.#datosDelCampus(), ...AlmacenEnMemoria.#datosDeCuentas() };
    return globalThis[CLAVE_GLOBAL];
  }

  // Estacionamientos del mapa con su capacidad de ejemplo, todos abiertos; listas vacías y el
  // catálogo inicial de edificios.
  static #datosDelCampus() {
    const etiquetas = Estacionamiento.etiquetasUnicas(ESTACIONAMIENTOS);
    return {
      estacionamientos: ESTACIONAMIENTOS.map(({ id, nombre, soloProfesores = false, poligono, pisos = null }, i) => ({
        id,
        nombre,
        etiqueta: etiquetas[i],
        soloProfesores,
        ...(CAPACIDAD_DE_EJEMPLO[id] ?? CAPACIDAD_POR_DEFECTO),
        activo: true,
        poligono: poligono.map((p) => [...p]),
        pisos,
      })),
      movimientos: [],
      avisosRechazados: [],
      lecturasDePlaca: [],
      incidencias: [],
      edificios: EDIFICIOS.map((e) => ({ ...e, ubicacion: e.ubicacion ? [...e.ubicacion] : null })),
    };
  }

  // En desarrollo empieza con las cuentas de prueba (USUARIOS_DE_PRUEBA); en producción, vacío.
  static #datosDeCuentas() {
    const usuarios =
      process.env.NODE_ENV === "production" ? [] : USUARIOS_DE_PRUEBA.map((cuenta) => Usuario.crear(cuenta).aRegistro());
    return { usuarios, sesiones: [], vehiculos: [] };
  }

  static get TABLAS() {
    return [...TABLAS_DEL_CAMPUS, ...TABLAS_DE_CUENTAS];
  }
}
