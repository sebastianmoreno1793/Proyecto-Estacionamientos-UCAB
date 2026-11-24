// Vista · Cómo se escriben las cifras y fechas en pantalla (no decide nada del negocio).
export class Formato {
  static #hora = new Intl.DateTimeFormat("es-VE", { timeZone: "America/Caracas", dateStyle: "short", timeStyle: "short" });

  // «1 libre», «12 libres».
  static libres(n) {
    return `${n} ${n === 1 ? "libre" : "libres"}`;
  }

  // «350 m» o «1,2 km».
  static distancia(metros) {
    return metros < 1000 ? `${metros} m` : `${(metros / 1000).toFixed(1).replace(".", ",")} km`;
  }

  // Fecha ISO → fecha y hora cortas de Caracas.
  static fechaHora(iso) {
    return Formato.#hora.format(new Date(iso));
  }

  // Nombre corto de un edificio para los chips del Inicio: «Edificio de Aulas» → «Aulas».
  static nombreCorto(nombre) {
    return String(nombre ?? "").replace(/^Edificio\s+(de\s+)?/i, "") || nombre;
  }
}
