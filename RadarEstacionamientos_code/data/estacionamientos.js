// Estacionamientos del Campus Montalbán que se dibujan en el mapa (HU 5.1).
//
// Fuente: OpenStreetMap (© colaboradores de OpenStreetMap, licencia ODbL).
// ⚠️ Lista INCOMPLETA: faltan los estacionamientos que OpenStreetMap no tiene
// dibujados (por ejemplo, el de las canchas de pádel). Se completa con la
// visita al campus (preguntas_abiertas.md #4). Para corregir, solo se cambia
// esta lista; el mapa no se toca.
//
// Cada estacionamiento:
//   id       identificador único, sin espacios (lo usarán HU 4.1, 7.2, 10.1)
//   nombre   lo que ve el usuario en el mapa
//   poligono esquinas del área como [latitud, longitud], en orden
//   osm      id del área en OpenStreetMap (way), para poder revisarla

export const CENTRO_CAMPUS = [10.4648, -66.9745];
export const ZOOM_INICIAL = 17;

export const ESTACIONAMIENTOS = [
  {
    id: "est-b",
    nombre: "Estacionamiento B",
    osm: 220598789,
    poligono: [
      [10.466241, -66.972082],
      [10.466772, -66.970944],
      [10.46728, -66.971188],
      [10.466699, -66.972435],
      [10.466623, -66.972398],
      [10.466543, -66.97236],
      [10.466593, -66.972252],
    ],
  },
  {
    id: "est-c",
    nombre: "Estacionamiento C",
    osm: 915297686,
    poligono: [
      [10.467641, -66.973666],
      [10.46761, -66.973731],
      [10.467672, -66.973761],
      [10.46763, -66.97385],
      [10.466791, -66.973437],
      [10.466864, -66.973283],
    ],
  },
  {
    // En OpenStreetMap figura como estacionamiento de varios pisos, sin nombre.
    id: "est-cincuentenario",
    nombre: "Estacionamiento junto al Cincuentenario (nombre por confirmar)",
    osm: 680700245,
    poligono: [
      [10.463802, -66.976418],
      [10.463358, -66.976289],
      [10.463186, -66.976899],
      [10.463629, -66.977029],
    ],
  },
];
