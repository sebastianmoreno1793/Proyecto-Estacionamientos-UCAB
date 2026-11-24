// @HU-3.2 Simular sensores y placas · Aaron — Prueba que la placa leída quede con su hora y no se duplique
// Pruebas de unidad de los servicios GaritaServicio y EventosEnVivoServicio. Se corren con: npm test
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../datos/basedatos/AlmacenEnMemoria.js";
import { Fabrica } from "../../Fabrica.js";
import { LecturaDePlacaDTO } from "../../logica/dto/LecturaDePlacaDTO.js";

let servicios;
beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  servicios = new Fabrica().servicios;
});

test("la lectura queda con la hora y no se duplica si el lector la reintenta", async () => {
  const ahora = new Date("2026-10-13T14:00:00Z");
  const pedido = LecturaDePlacaDTO.desdeCuerpo({ placa: "ab-123 cd", sentido: "entrada", idLectura: "garita-1" });
  const { lectura } = await servicios.garitaServicio.registrar(pedido, ahora);
  assert.deepEqual([lectura.placa, lectura.sentido, lectura.hora], ["AB123CD", "ENTRADA", ahora.toISOString()]);
  assert.equal((await servicios.garitaServicio.registrar(pedido)).repetida, true);
  assert.equal((await servicios.garitaServicio.ultimas()).length, 1);
});

test("al canal en vivo va el sentido, nunca la placa", async () => {
  const recibidos = [];
  const salir = servicios.eventos.suscribir((m) => recibidos.push(m));
  await servicios.garitaServicio.registrar(LecturaDePlacaDTO.desdeCuerpo({ placa: "AB123CD", sentido: "SALIDA" }));
  salir();
  assert.equal(recibidos[0].clase, "LECTURA_GARITA");
  assert.equal(JSON.stringify(recibidos).includes("AB123CD"), false);
});

test("canal en vivo: quien está suscrito recibe cada cambio con su clase y hora, y deja de recibir al salir", () => {
  const recibidos = [];
  const salir = servicios.eventos.suscribir((m) => recibidos.push(m));
  servicios.eventos.emitir("AVISO", { estacionamiento: { id: "est-labs" } });
  salir();
  servicios.eventos.emitir("AVISO", {});
  assert.equal(recibidos.length, 1);
  assert.equal(recibidos[0].clase, "AVISO");
  assert.ok(recibidos[0].hora);
});
