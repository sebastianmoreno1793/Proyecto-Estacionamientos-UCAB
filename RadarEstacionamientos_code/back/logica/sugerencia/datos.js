// HU 7.2 · Junta los datos que necesita la regla: el edificio elegido (catálogo de la HU 6.1),
// los puestos libres de cada estacionamiento (HU 4.1) y su forma en el mapa (HU 5.1).
import { ESTACIONAMIENTOS } from "../../campus/estacionamientos.js";
import { listarEdificios } from "../edificios/datos.js";
import { listarEstacionamientos, vistaPublica } from "../estacionamientos/datos.js";
import { sugerirMasCercano } from "./reglas.js";

// Junta el edificio y los estacionamientos y aplica la regla de la HU 7.2.
// Devuelve { edificio, sugerido, alternativas } o { error, motivo }. [datos]
export async function sugerirParaEdificio(edificioId) {
  const edificio = (await listarEdificios()).find((e) => e.id === edificioId);
  const forma = Object.fromEntries(ESTACIONAMIENTOS.map(({ id, poligono }) => [id, poligono]));
  const estacionamientos = (await listarEstacionamientos()).map((e) => ({
    ...vistaPublica(e), // id, nombre, etiqueta, libres, activo, soloProfesores…
    poligono: forma[e.id],
  }));

  const resultado = sugerirMasCercano(edificio, estacionamientos);
  if (resultado.error) return resultado;

  // A la pantalla solo le hace falta esto (sin el polígono).
  const resumen = ({ id, nombre, etiqueta, libres, capacidad, distancia }) => ({
    id,
    nombre: etiqueta ?? nombre,
    libres,
    capacidad,
    distancia,
  });
  return {
    edificio: { id: edificio.id, nombre: edificio.nombre },
    sugerido: resumen(resultado.sugerido),
    alternativas: resultado.alternativas.map(resumen),
  };
}
