// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Prueba la táctica que ignora los avisos defectuosos y marca el sensor con falla
// Pruebas de unidad de la táctica FiltroDeAvisos. Se corren con: npm test
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../datos/basedatos/AlmacenEnMemoria.js";
import { Estacionamiento } from "../../logica/modelos/Estacionamiento.js";
import { AvisoRechazadoRepositorio } from "../../datos/repositorios/AvisoRechazadoRepositorio.js";
import { FiltroDeAvisos } from "../../logica/tacticas/FiltroDeAvisos.js";

let repositorio;
let filtro;
const lleno = () => new Estacionamiento({ id: "est-x", nombre: "X", capacidad: 10, ocupados: 10 });
const entrada = { estacionamientoId: "est-x", tipo: "ENTRADA" };

beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  repositorio = new AvisoRechazadoRepositorio();
  filtro = new FiltroDeAvisos(repositorio, { limite: 3 });
});

test("un aviso normal pasa", async () => {
  assert.deepEqual(await filtro.revisar({ ...entrada, tipo: "SALIDA" }, lleno()), { aceptado: true });
});

test("un aviso imposible se ignora sin detener nada y queda registrado con su motivo", async () => {
  const r = await filtro.revisar(entrada, lleno());
  assert.equal(r.aceptado, false);
  assert.equal(r.motivo, "lleno");
  const [rechazo] = await repositorio.listar();
  assert.equal(rechazo.motivo, "lleno");
  assert.ok(rechazo.esAnomalia());
});

test("un estacionamiento que no existe se rechaza (no_existe) y no cuenta como anomalía del sensor", async () => {
  const r = await filtro.revisar({ estacionamientoId: "zzz", tipo: "ENTRADA" }, null);
  assert.equal(r.motivo, "no_existe");
  assert.deepEqual(filtro.sensoresConFalla(), []);
});

test("con N anomalías seguidas marca el sensor con falla (una sola vez)", async () => {
  const resultados = [];
  for (let i = 0; i < 4; i++) resultados.push(await filtro.revisar(entrada, lleno()));
  assert.deepEqual(resultados.map((r) => r.sensorConFalla), [false, false, true, true]);
  assert.deepEqual(resultados.map((r) => r.nuevaFalla), [false, false, true, false]);
  assert.deepEqual(filtro.sensoresConFalla(), ["est-x"]);
});

test("un aviso bueno reinicia la cuenta y quita la marca de falla", async () => {
  for (let i = 0; i < 3; i++) await filtro.revisar(entrada, lleno());
  await filtro.revisar({ ...entrada, tipo: "SALIDA" }, lleno());
  assert.deepEqual(filtro.sensoresConFalla(), []);
  assert.equal((await filtro.revisar(entrada, lleno())).anomaliasSeguidas, 1);
});
