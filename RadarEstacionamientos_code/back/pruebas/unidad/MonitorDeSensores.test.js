// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Prueba la táctica de timeout del sensor que deja de avisar
// Pruebas de unidad de la táctica MonitorDeSensores. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { MonitorDeSensores } from "../../logica/tacticas/MonitorDeSensores.js";

const inicio = new Date("2026-11-13T12:00:00Z");
const despues = (minutos) => new Date(inicio.getTime() + minutos * 60000);

test("antes del tiempo límite ningún sensor está caído", () => {
  const m = new MonitorDeSensores({ tiempoLimiteMinutos: 10, ahora: inicio });
  assert.deepEqual(m.sensoresSinAviso(["a", "b"], despues(9)), []);
});

test("el sensor que no avisa en más del tiempo límite se da por caído; el que avisó no", () => {
  const m = new MonitorDeSensores({ tiempoLimiteMinutos: 10, ahora: inicio });
  m.recibioAviso("a", despues(5));
  const caidos = m.sensoresSinAviso(["a", "b"], despues(11));
  assert.deepEqual(caidos.map((c) => c.estacionamientoId), ["b"]);
  assert.equal(caidos[0].ultimoAviso, null);
  assert.equal(caidos[0].minutosSinAviso, 11);
});

test("cada aviso reinicia el reloj de su sensor", () => {
  const m = new MonitorDeSensores({ tiempoLimiteMinutos: 10, ahora: inicio });
  m.recibioAviso("a", despues(1));
  assert.equal(m.estaCaido("a", despues(12)), true);
  m.recibioAviso("a", despues(12));
  assert.equal(m.estaCaido("a", despues(15)), false);
  assert.equal(m.ultimoAvisoDe("a").toISOString(), despues(12).toISOString());
});

test("por defecto el tiempo límite es de 30 minutos", () => {
  assert.equal(new MonitorDeSensores().tiempoLimiteMinutos, Number(process.env.TIEMPO_LIMITE_SENSOR_MIN) || 30);
});
