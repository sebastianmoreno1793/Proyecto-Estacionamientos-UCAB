// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Colores del semáforo: verde «Hay puesto», rojo «No hay puesto» y gris «Cerrado» (D-007, D-009)
// Vista · Colores del semáforo. QUÉ estado tiene cada estacionamiento lo decide el back (modelo
// Semaforo, campo `semaforo` del DTO); aquí solo se elige cómo se pinta. `color` lleva texto blanco
// encima (≥ 4,5:1); `relleno` es para áreas. Estos colores se usan solo para la ocupación.
export class ColoresSemaforo {
  static HAY_PUESTO = { nivel: "hay", texto: "Hay puesto", color: "#1e7b4f", relleno: "#2f9e57" };
  static NO_HAY_PUESTO = { nivel: "no-hay", texto: "No hay puesto", color: "#b42318", relleno: "#d93a2e" };
  static CERRADO = { nivel: "cerrado", texto: "Cerrado", color: "#6c6c70", relleno: "#8e8e93" };
  static LEYENDA = [ColoresSemaforo.HAY_PUESTO, ColoresSemaforo.NO_HAY_PUESTO, ColoresSemaforo.CERRADO];

  // { nivel, texto, color, relleno } del estacionamiento (EstacionamientoDTO con su `semaforo`).
  static de(estacionamiento) {
    const nivel = estacionamiento?.semaforo?.nivel ?? (estacionamiento?.activo === false ? "cerrado" : estacionamiento?.libres > 0 ? "hay" : "no-hay");
    return ColoresSemaforo.LEYENDA.find((n) => n.nivel === nivel) ?? ColoresSemaforo.CERRADO;
  }
}
