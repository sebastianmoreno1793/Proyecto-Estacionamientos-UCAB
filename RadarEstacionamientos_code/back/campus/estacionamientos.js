// Estacionamientos del Campus Montalbán que se dibujan en el mapa (HU 5.1).
//
// Nombres: los que usa la comunidad UCAB, indicados por German Alfonzo (05/oct/26).
//
// Fuentes (campo `fuente` de cada estacionamiento):
//   satelital          trazado sobre la imagen satelital Esri World Imagery
//   marcado por German zona que German Alfonzo marcó sobre el mapa (05/oct/26)
//   OpenStreetMap      área de OpenStreetMap (© colaboradores de OSM, ODbL)
//
// ⚠️ Las formas son aproximadas (margen de unos 10 m). Se confirman con la
// visita al campus (preguntas_abiertas.md #4 y #5). Para corregir, solo se
// cambia esta lista; el mapa no se toca.
//
// Cada estacionamiento:
//   id              identificador único, sin espacios (lo usan las HU 4.1, 5.4 y 7.2)
//   nombre          lo que ve el usuario en el mapa (puede repetirse si el lugar
//                   tiene varias zonas, como Presambilito o Pádel)
//   soloProfesores  (opcional) true si los puestos son solo para profesores (HU 7.3)
//   pisos           (opcional) número de pisos, si el estacionamiento es un edificio
//   fuente          de dónde sale la forma
//   poligono        esquinas del área como [latitud, longitud], en orden
//   osm             (opcional) id del área en OpenStreetMap

export const CENTRO_CAMPUS = [10.4637, -66.9770];
export const ZOOM_INICIAL = 17;

export const ESTACIONAMIENTOS = [
  {
    id: "est-playa",
    nombre: "Playa",
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
    nombre: "Postgrado",
    fuente: "satelital",
    poligono: [
      [10.464434, -66.978575],
      [10.464434, -66.97806],
      [10.463692, -66.97806],
      [10.463664, -66.978344],
      [10.463979, -66.978547],
    ],
  },
  {
    id: "est-centro-estudiantes",
    nombre: "Centro de Estudiantes",
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
    id: "est-labs",
    nombre: "Labs",
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
    nombre: "Cincuentenario",
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
    id: "est-sambilito",
    nombre: "Sambilito",
    pisos: 3,
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
    id: "est-presambilito-oeste",
    nombre: "Presambilito",
    fuente: "marcado por German",
    poligono: [
      [10.463884, -66.976282],
      [10.463926, -66.976096],
      [10.463314, -66.975955],
      [10.463263, -66.976154],
    ],
  },
  {
    id: "est-presambilito",
    nombre: "Presambilito",
    fuente: "satelital",
    poligono: [
      [10.463811, -66.976301],
      [10.4639, -66.976],
      [10.464017, -66.97542],
      [10.463492, -66.97542],
      [10.463377, -66.976],
      [10.463377, -66.976301],
    ],
  },
  {
    id: "est-padel",
    nombre: "Pádel",
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
  {
    id: "est-padel-norte",
    nombre: "Pádel",
    fuente: "marcado por German",
    poligono: [
      [10.462637, -66.979607],
      [10.462921, -66.979581],
      [10.463083, -66.979298],
      [10.463147, -66.978893],
      [10.463041, -66.978651],
      [10.462896, -66.978587],
      [10.462758, -66.978894],
      [10.462637, -66.979218],
    ],
  },
  {
    id: "prof-centro-cultural",
    nombre: "Profesores · Centro Cultural",
    soloProfesores: true,
    fuente: "marcado por German",
    poligono: [
      [10.465229, -66.977202],
      [10.465432, -66.977185],
      [10.465553, -66.976942],
      [10.465593, -66.976376],
      [10.465472, -66.976279],
      [10.465285, -66.976458],
      [10.465229, -66.976782],
    ],
  },
  {
    id: "prof-postgrado",
    nombre: "Profesores · Postgrado",
    soloProfesores: true,
    fuente: "marcado por German",
    poligono: [
      [10.464419, -66.978039],
      [10.4645, -66.977836],
      [10.464338, -66.977715],
      [10.464054, -66.977636],
      [10.46377, -66.977758],
      [10.46373, -66.97792],
      [10.463852, -66.978041],
      [10.464135, -66.978064],
    ],
  },
  {
    id: "prof-aulas",
    nombre: "Profesores · Aulas",
    soloProfesores: true,
    fuente: "marcado por German",
    poligono: [
      [10.463932, -66.976949],
      [10.464053, -66.976463],
      [10.464174, -66.975815],
      [10.464336, -66.97533],
      [10.464441, -66.974965],
      [10.464173, -66.974966],
      [10.464092, -66.975331],
      [10.463971, -66.975978],
      [10.463826, -66.976626],
      [10.46377, -66.976949],
    ],
  },
  {
    id: "prof-presambilito",
    nombre: "Profesores · Presambilito",
    soloProfesores: true,
    fuente: "marcado por German",
    poligono: [
      [10.464017, -66.97542],
      [10.46405, -66.975258],
      [10.46412, -66.974999],
      [10.463811, -66.974971],
      [10.463524, -66.975258],
      [10.463492, -66.97542],
    ],
  },
];
