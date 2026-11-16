// Medidas3D · Medidas y colores de la maqueta 3D (1 unidad = 1 metro).
export class Medidas3D {
  static ALTO_PISO = 3.5; // m por piso en los edificios
  static ALTO_PISO_SAMBILITO = 3.2;
  static ESPESOR_LOSA = 0.3; // losa de los estacionamientos sobre el suelo
  static ALTO_TOTEM = 12;
  static ESCALA_CARRO = 1.7; // el carro del modelo mide 2,6 m; uno real, ~4,4 m
  static CANTIDAD_ARBOLES = 60;
  static MAX_CARROS_EN_MOVIMIENTO = 8;

  static VIA = {
    principal: { ancho: 7, color: 0x272f3d, elevacion: 0.16 },
    acceso: { ancho: 5.5, color: 0x272f3d, elevacion: 0.16 },
    interna: { ancho: 4.5, color: 0x2b3340, elevacion: 0.15 },
    avenida: { ancho: 10, color: 0x3a3f47, elevacion: 0.12 },
    ramal: { ancho: 6, color: 0x3a3f47, elevacion: 0.12 },
    autopista: { ancho: 11, color: 0x30343b, elevacion: 0.12 },
    peatonal: { ancho: 2.2, color: 0xc9bfa5, elevacion: 0.1 },
  };

  static COLOR_EDIFICIO = {
    aulas: 0xe7dcc6,
    administrativo: 0xd6d3cd,
    biblioteca: 0xc9a27e,
    laboratorios: 0xc7d2da,
    capilla: 0xf3eee4,
    auditorio: 0xb5694a,
    comida: 0xe8b46a,
    otro: 0xb9b3a7,
  };

  static COLOR_CANCHA = { fútbol: 0x3f8f3f, béisbol: 0x4a9440, baloncesto: 0x3b6ea5 };
  static COLORES_CARROS = [0xd97706, 0xdc2626, 0x0284c7, 0x475569, 0xf8fafc, 0x16a34a, 0x7c3aed, 0x1f2937, 0xa3a3a3];
  static ICONO_INCIDENCIA = { bateria_descargada: "🔋", conos_atravesados: "🚧", vehiculo_mal_estacionado: "🚗" };

  // Semáforo del proyecto (D-009): verde = hay puesto (libres ≥ 1), rojo = no hay puesto.
  static colorSemaforo(libres) {
    return libres > 0 ? 0x2f9e57 : 0xd93a2e;
  }

  // El mismo semáforo en CSS (panel de control): verde = hay puesto, rojo = no hay, gris = cerrado.
  static colorSemaforoCss(e) {
    if (!e.activo) return "#8e8e93";
    return e.libres > 0 ? "#2f9e57" : "#d93a2e";
  }

  // El valor dentro de [min, max].
  static limitar(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // El cartel tiene 512 px de ancho: los nombres largos se acortan.
  static nombreParaCartel(est) {
    if (est.soloProfesores) return `Prof. ${est.nombre.split("·").pop().trim()}`;
    return (est.etiqueta ?? est.nombre)
      .replace(" (principal)", "")
      .replace(/ \((\w+)\)$/, (_, zona) => ` ${zona[0].toUpperCase()}${zona.slice(1)}`);
  }
}
