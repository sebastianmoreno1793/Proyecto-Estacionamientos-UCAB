// SimuladorControlador con una app base falsa: qué llamadas hace y qué estado deja.
// Se corre con: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { SimuladorControlador } from "../controladores/SimuladorControlador.js";
import { GeneradorDeEscenarios } from "../escenarios_prueba/GeneradorDeEscenarios.js";
import { Aleatorio } from "../mapa_3d/Aleatorio.js";

const CAMPUS = [
  { id: "a", etiqueta: "A", activo: true, capacidad: 10, ocupados: 8, libres: 2, porcentaje: 80 },
  { id: "b", etiqueta: "B", activo: false, capacidad: 5, ocupados: 0, libres: 5, porcentaje: 0 },
];

// App base falsa: responde bien y guarda cada llamada.
function appFalsa() {
  const llamadas = [];
  const respuesta = (datos) => ({ ok: true, estado: 200, datos, metodo: "POST", ruta: "/api/x", ms: 1 });
  return {
    llamadas,
    estacionamientos: async () => respuesta({ estacionamientos: CAMPUS }),
    incidencias: async () => respuesta({ incidencias: [] }),
    aviso: async (estacionamientoId, tipo, idAviso) => {
      llamadas.push({ estacionamientoId, tipo, idAviso });
      return respuesta({ estacionamiento: { ...CAMPUS[0], ocupados: 9, libres: 1 } });
    },
  };
}

const nuevo = (api) => new SimuladorControlador({ api, escenarios: new GeneradorDeEscenarios(new Aleatorio(1)) });

test("al cargar toma los estacionamientos de la app y elige el primero", async () => {
  const simulador = nuevo(appFalsa());
  await simulador.cargarEstado();
  const estado = simulador.instantanea();
  assert.equal(estado.estacionamientos.length, 2);
  assert.equal(estado.seleccionado, "a");
});

test("el resumen solo cuenta los estacionamientos abiertos", () => {
  const resumen = SimuladorControlador.resumen({ estacionamientos: CAMPUS, incidencias: [{ estado: "pendiente" }] });
  assert.deepEqual(resumen, { libres: 2, porcentaje: 80, cerrados: 1, incidencias: 1 });
});

test("cuando el sensor del mundo 3D ve un carro, se manda el aviso y se anota", async () => {
  const api = appFalsa();
  const simulador = nuevo(api);
  let avisos = 0;
  simulador.suscribir(() => avisos++);
  await simulador.cargarEstado();
  await simulador.alDispararEvento({ tipo: "AVISO", estacionamientoId: "a", movimiento: "ENTRADA", idAviso: "x1" });
  assert.deepEqual(api.llamadas, [{ estacionamientoId: "a", tipo: "ENTRADA", idAviso: "x1" }]);
  const { estacionamientos, registro } = simulador.instantanea();
  assert.equal(estacionamientos.find((e) => e.id === "a").libres, 1);
  assert.match(registro[0].texto, /Entró a A · 1 libres/);
  assert.ok(avisos > 0, "avisa a la página de cada cambio");
});

test("«Llenar el campus» manda una entrada por puesto libre de los abiertos", async () => {
  const api = appFalsa();
  const simulador = nuevo(api);
  await simulador.cargarEstado();
  await simulador.acciones.llenar();
  assert.equal(api.llamadas.length, 2);
  assert.ok(api.llamadas.every((l) => l.estacionamientoId === "a" && l.tipo === "ENTRADA"));
  assert.equal(simulador.instantanea().tarea, null);
});
