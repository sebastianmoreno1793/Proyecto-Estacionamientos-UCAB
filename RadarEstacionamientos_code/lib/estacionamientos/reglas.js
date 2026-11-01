// Reglas de los estacionamientos. Funciones puras: no leen ni guardan datos.

export const CAPACIDAD_MAXIMA = 2000;

// Nunca menos de 0 ni más que la capacidad. Si el administrador baja la capacidad
// por debajo de los carros que ya están dentro, quedan 0 libres hasta que salgan.
export function puestosLibres({ capacidad, ocupados }) {
  return Math.min(capacidad, Math.max(0, capacidad - ocupados));
}

// Porcentaje para el semáforo (HU 4.2). Nunca pasa de 100, igual que los libres nunca bajan de 0.
export function porcentajeDeOcupacion({ capacidad, ocupados }) {
  if (!(capacidad > 0)) return 100;
  return Math.round((Math.min(capacidad, Math.max(0, ocupados)) / capacidad) * 100);
}

export const TIPOS_DE_MOVIMIENTO = ["ENTRADA", "SALIDA"];

// HU 4.1: una entrada ocupa un puesto y una salida lo libera. Un aviso que rompería los
// límites (lleno, vacío) o que llega de un estacionamiento desactivado se rechaza.
export function aplicarMovimiento(estacionamiento, tipo) {
  if (!TIPOS_DE_MOVIMIENTO.includes(tipo)) {
    return { error: "El tipo debe ser ENTRADA o SALIDA.", motivo: "tipo" };
  }
  const { etiqueta, nombre, activo, capacidad, ocupados } = estacionamiento;
  const cual = etiqueta ?? nombre;
  if (!activo) return { error: `${cual} está desactivado.`, motivo: "desactivado" };
  if (tipo === "ENTRADA" && ocupados >= capacidad) {
    return { error: `${cual} está lleno.`, motivo: "lleno" };
  }
  if (tipo === "SALIDA" && ocupados <= 0) {
    return { error: `En ${cual} no hay carros para salir.`, motivo: "vacio" };
  }
  return { ocupados: ocupados + (tipo === "ENTRADA" ? 1 : -1) };
}

export function validarCapacidad(valor) {
  const texto = String(valor ?? "").trim();
  if (!/^\d+$/.test(texto)) {
    return { error: "La capacidad debe ser un número entero de puestos." };
  }
  const capacidad = Number(texto);
  if (capacidad < 1) {
    return { error: "La capacidad debe ser de al menos 1 puesto. Para cerrarlo, desactívalo." };
  }
  if (capacidad > CAPACIDAD_MAXIMA) {
    return { error: `La capacidad no puede pasar de ${CAPACIDAD_MAXIMA} puestos.` };
  }
  return { capacidad };
}

// HU 10.1: un estacionamiento desactivado no se sugiere. La HU 7.2 parte de esta lista
// y le añade lo suyo (puestos libres y cercanía al edificio).
export function estacionamientosSugeribles(estacionamientos) {
  return estacionamientos.filter((e) => e.activo);
}

// Algunos lugares tienen varias zonas con el mismo nombre (Presambilito, Pádel). Para
// distinguirlas en las listas, la etiqueta añade la zona sacada del id: la zona cuyo id
// es la base de las demás es la "principal" (est-padel), y el resto toma lo que sigue
// (est-padel-norte → "norte").
export function etiquetasUnicas(estacionamientos) {
  return estacionamientos.map((e) => {
    const grupo = estacionamientos.filter((o) => o.nombre === e.nombre);
    if (grupo.length === 1) return e.nombre;
    const base = grupo.find((b) => grupo.every((o) => o === b || o.id.startsWith(`${b.id}-`)));
    const zona = !base ? e.id : e === base ? "principal" : e.id.slice(base.id.length + 1);
    return `${e.nombre} (${zona})`;
  });
}
