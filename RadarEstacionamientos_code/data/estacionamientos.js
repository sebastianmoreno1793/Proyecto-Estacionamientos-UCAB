// Estacionamientos del Campus Montalbán que se dibujan en el mapa (HU 5.1).
//
// Fuentes (campo `fuente` de cada estacionamiento):
//   satelital          trazado sobre la imagen satelital Esri World Imagery
//   marcado por German zona que German Alfonzo marcó sobre el mapa (05/oct/26)
//   OpenStreetMap      área de OpenStreetMap (© colaboradores de OSM, ODbL)
//
// ⚠️ Las formas son aproximadas (margen de unos 10 m) y los nombres son
// descriptivos, por confirmar con la visita al campus (preguntas_abiertas.md #4).
// Para corregir, solo se cambia esta lista; el mapa no se toca.
//
// Cada estacionamiento:
//   id       identificador único, sin espacios (lo usarán HU 4.1, 7.2, 10.1)
//   nombre   lo que ve el usuario en el mapa
//   fuente   de dónde sale la forma
//   poligono esquinas del área como [latitud, longitud], en orden
//   osm      (opcional) id del área en OpenStreetMap

export const CENTRO_CAMPUS = [10.4637, -66.9770];
export const ZOOM_INICIAL = 17;

export const ESTACIONAMIENTOS = [
  {
    id: "est-norte",
    nombre: "Estacionamiento Norte (Centro Cultural)",
    fuente: "satelital",
    poligono: [
      [10.465917, -66.976881],
      [10.466001, -66.976706],
      [10.466064, -66.97614],
      [10.465945, -66.975678],
      [10.465805, -66.975594],
      [10.465721, -66.975853],
      [10.465686, -66.976426],
      [10.465721, -66.976853],
    ],
  },
  {
    id: "est-postgrado",
    nombre: "Estacionamiento Postgrado",
    fuente: "satelital",
    poligono: [
      [10.464434, -66.978575],
      [10.464434, -66.977945],
      [10.464154, -66.977833],
      [10.463692, -66.977833],
      [10.463664, -66.978344],
      [10.463979, -66.978547],
    ],
  },
  {
    id: "est-teheran",
    nombre: "Estacionamiento Teherán (Laboratorios)",
    fuente: "satelital",
    poligono: [
      [10.465287, -66.975139],
      [10.465343, -66.974593],
      [10.465259, -66.973851],
      [10.465063, -66.973851],
      [10.465028, -66.974481],
      [10.465063, -66.975111],
    ],
  },
  {
    id: "est-capilla",
    nombre: "Puestos de la Capilla",
    fuente: "marcado por German",
    poligono: [
      [10.46474, -66.975009],
      [10.464661, -66.975025],
      [10.464617, -66.975091],
      [10.464635, -66.975168],
      [10.464705, -66.975211],
      [10.464784, -66.975195],
      [10.464828, -66.975129],
      [10.46481, -66.975052],
    ],
  },
  {
    id: "est-cincuentenario",
    nombre: "Estacionamiento Cincuentenario",
    fuente: "satelital",
    poligono: [
      [10.463405, -66.978323],
      [10.463475, -66.977567],
      [10.463405, -66.977077],
      [10.463006, -66.977028],
      [10.463006, -66.978337],
    ],
  },
  {
    id: "est-techado",
    nombre: "Estacionamiento techado",
    fuente: "OpenStreetMap",
    osm: 680700245,
    poligono: [
      [10.463802, -66.976418],
      [10.463358, -66.976289],
      [10.463186, -66.976899],
      [10.463629, -66.977029],
    ],
  },
  {
    id: "est-franja",
    nombre: "Puestos junto al techado",
    fuente: "marcado por German",
    poligono: [
      [10.463884, -66.976282],
      [10.463926, -66.976096],
      [10.463314, -66.975955],
      [10.463263, -66.976154],
    ],
  },
  {
    id: "est-sur",
    nombre: "Estacionamiento Sur",
    fuente: "satelital",
    poligono: [
      [10.463811, -66.976301],
      [10.463951, -66.976],
      [10.464119, -66.975258],
      [10.464154, -66.974999],
      [10.463811, -66.974971],
      [10.463524, -66.975258],
      [10.463377, -66.976],
      [10.463377, -66.976301],
    ],
  },
  {
    id: "est-sureste",
    nombre: "Estacionamiento Sureste",
    fuente: "marcado por German",
    poligono: [
      [10.464263, -66.974981],
      [10.464365, -66.974405],
      [10.463931, -66.974311],
      [10.463821, -66.974841],
    ],
  },
  {
    id: "est-padel",
    nombre: "Estacionamiento Canchas de Pádel",
    fuente: "satelital",
    poligono: [
      [10.46155, -66.980611],
      [10.461836, -66.98044],
      [10.46215, -66.980297],
      [10.46235, -66.980097],
      [10.462264, -66.98004],
      [10.462007, -66.980183],
      [10.461693, -66.980297],
      [10.461464, -66.980383],
      [10.461379, -66.980525],
    ],
  },
];
