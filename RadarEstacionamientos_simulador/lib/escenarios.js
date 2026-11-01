// Escenarios de prueba del simulador (HU 3.3). Funciones puras: deciden QUÉ avisos enviar.
// El simulador después los manda por la API de la app base, uno por uno, como lo harían los
// sensores. Nunca se fija la ocupación "a mano": la app base la calcula con cada aviso.

const LETRAS = "ABCDEFGHJKLMNPRSTUVWXYZ";

// Placa venezolana de prueba (AB123CD). No es de nadie.
export function placaAleatoria(aleatorio = Math.random) {
  const letra = () => LETRAS[Math.floor(aleatorio() * LETRAS.length)];
  return `${letra()}${letra()}${100 + Math.floor(aleatorio() * 900)}${letra()}${letra()}`;
}

function elegirPonderado(pesos, aleatorio) {
  const total = pesos.reduce((s, p) => s + p, 0);
  if (total <= 0) return -1;
  let r = aleatorio() * total;
  for (let i = 0; i < pesos.length; i++) {
    r -= pesos[i];
    if (r < 0) return i;
  }
  return pesos.length - 1;
}

const libresDe = (e) => (e.activo ? Math.max(0, e.capacidad - e.ocupados) : 0);
const ocupadosDe = (e) => (e.activo ? Math.max(0, e.ocupados) : 0);

function repartir(estacionamientos, cantidad, cupoDe, aleatorio) {
  const cupos = estacionamientos.map(cupoDe);
  const ids = [];
  for (let i = 0; i < cantidad; i++) {
    const k = elegirPonderado(cupos, aleatorio);
    if (k === -1) break;
    cupos[k]--;
    ids.push(estacionamientos[k].id);
  }
  return ids;
}

// Hora pico: llegadas repartidas en proporción a los puestos libres de cada estacionamiento
// activo. Nunca más llegadas que puestos libres.
export function repartirLlegadas(estacionamientos, cantidad, aleatorio = Math.random) {
  return repartir(estacionamientos, cantidad, libresDe, aleatorio);
}

// Fin de clases: salidas en proporción a los carros que hay en cada estacionamiento activo.
export function repartirSalidas(estacionamientos, cantidad, aleatorio = Math.random) {
  return repartir(estacionamientos, cantidad, ocupadosDe, aleatorio);
}

// Intercala los estacionamientos (uno de cada uno por turno): así el semáforo de todos
// cambia a la vez y no uno tras otro.
function intercalar(listas) {
  const salida = [];
  for (let i = 0; listas.some((l) => i < l.length); i++) {
    for (const l of listas) if (i < l.length) salida.push(l[i]);
  }
  return salida;
}

export function avisosParaLlenar(estacionamientos) {
  return intercalar(estacionamientos.map((e) => Array(libresDe(e)).fill({ estacionamientoId: e.id, tipo: "ENTRADA" })));
}

export function avisosParaVaciar(estacionamientos) {
  return intercalar(estacionamientos.map((e) => Array(ocupadosDe(e)).fill({ estacionamientoId: e.id, tipo: "SALIDA" })));
}

// Una incidencia al azar en un estacionamiento activo (la app base rechaza los desactivados).
export function incidenciaAleatoria(estacionamientos, tipos, aleatorio = Math.random) {
  const activos = estacionamientos.filter((e) => e.activo);
  if (activos.length === 0 || tipos.length === 0) return null;
  return {
    estacionamientoId: activos[Math.floor(aleatorio() * activos.length)].id,
    tipo: tipos[Math.floor(aleatorio() * tipos.length)].id,
  };
}
