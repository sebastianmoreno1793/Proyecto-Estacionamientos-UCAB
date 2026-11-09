// Catálogo INICIAL de edificios del Campus Montalbán (HU 6.1).
//
// Es solo el punto de partida: el administrador agrega, modifica o quita edificios
// desde /admin/edificios. La ubicación (centro aproximado del edificio) sale de
// OpenStreetMap (© colaboradores de OSM, ODbL) y la usarán la HU 6.2 (distancia a
// pie) y la HU 7.2 (estacionamiento más cercano). Puede faltar en edificios nuevos.
//
// Cada edificio:
//   id         identificador único, sin espacios
//   nombre     lo que ve el usuario al elegir el edificio de una materia
//   ubicacion  (opcional) [latitud, longitud]

export const EDIFICIOS = [
  { id: "edif-aulas", nombre: "Edificio de Aulas", ubicacion: [10.46425, -66.97623] },
  { id: "edif-laboratorios", nombre: "Edificio de Laboratorios", ubicacion: [10.46473, -66.9744] },
  { id: "edif-cincuentenario", nombre: "Edificio Cincuentenario", ubicacion: [10.46356, -66.97785] },
  { id: "edif-postgrado", nombre: "Edificio de Postgrado", ubicacion: [10.4643, -66.97778] },
  { id: "edif-centro-cultural", nombre: "Centro Cultural", ubicacion: [10.46512, -66.9767] },
  { id: "edif-aula-magna", nombre: "Aula Magna", ubicacion: [10.46526, -66.97565] },
];
