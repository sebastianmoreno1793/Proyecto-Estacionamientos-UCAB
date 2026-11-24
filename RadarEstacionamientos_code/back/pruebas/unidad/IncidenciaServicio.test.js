// @HU-9.1 Crear una incidencia · Sebastian — Prueba que la incidencia se guarde pendiente y solo en estacionamientos abiertos
// Pruebas de unidad del servicio IncidenciaServicio. Se corren con: npm test
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../datos/basedatos/AlmacenEnMemoria.js";
import { Fabrica } from "../../Fabrica.js";
import { IncidenciaDTO } from "../../logica/dto/IncidenciaDTO.js";

let servicios;
const usuario = { correo: "admin.prueba@ucab.edu.ve" };
const pedido = (estacionamientoId, tipo = "conos_atravesados") => IncidenciaDTO.desdeCuerpo({ estacionamientoId, tipo });

beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  servicios = new Fabrica().servicios;
});

test("queda registrada como pendiente, con la hora y la etiqueta del estacionamiento", async () => {
  const ahora = new Date("2026-10-12T13:45:00Z");
  const i = await servicios.incidenciaServicio.reportar(pedido("est-playa"), usuario, ahora);
  assert.deepEqual([i.estacionamiento, i.estado, i.reportadaEn], ["Playa", "pendiente", ahora.toISOString()]);
  assert.equal((await servicios.incidenciaServicio.listar()).length, 1);
});

test("lo que devuelve no trae el correo de quien reporta", async () => {
  const i = await servicios.incidenciaServicio.reportar(pedido("est-playa"), usuario);
  assert.equal(JSON.stringify(i).includes("@"), false);
});

test("no se registra en un estacionamiento que no existe ni en uno cerrado", async () => {
  await assert.rejects(servicios.incidenciaServicio.reportar(pedido("no-existe"), usuario), { motivo: "no_existe" });
  await servicios.estacionamientoServicio.cambiar("est-labs", { activo: false });
  await assert.rejects(servicios.incidenciaServicio.reportar(pedido("est-labs"), usuario), { motivo: "cerrado" });
  assert.equal((await servicios.incidenciaServicio.listar()).length, 0);
});

test("ofrece los tres tipos de problema", () => {
  assert.equal(servicios.incidenciaServicio.tipos().length, 3);
});
