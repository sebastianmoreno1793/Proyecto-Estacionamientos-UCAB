// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Prueba la táctica que autentica a los sensores
// @HU-3.2 Simular sensores y placas · Aaron — Prueba que el lector de placas (y el simulador) necesite la clave
// Pruebas de unidad de la táctica AutenticadorDeSensores. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { AutenticadorDeSensores } from "../../tacticas/AutenticadorDeSensores.js";

const peticion = (encabezados = {}) => new Request("http://x/api/avisos", { method: "POST", headers: encabezados });

test("solo vale la clave exacta", () => {
  const a = new AutenticadorDeSensores("secreta");
  assert.equal(a.esClaveValida("secreta"), true);
  assert.equal(a.esClaveValida("otra"), false);
  assert.equal(a.esClaveValida(undefined), false);
});

test("lee la clave del encabezado x-clave-sensor", () => {
  const a = new AutenticadorDeSensores("secreta");
  assert.equal(a.verificar(peticion({ "x-clave-sensor": "secreta" })), true);
  assert.equal(a.verificar(peticion()), false);
});

test("sin clave configurada (producción sin CLAVE_SENSORES) no entra nadie", () => {
  assert.equal(new AutenticadorDeSensores(null).esClaveValida("lo-que-sea"), false);
});

test("en desarrollo, sin CLAVE_SENSORES, vale la clave de desarrollo", () => {
  assert.equal(AutenticadorDeSensores.claveConfigurada(), process.env.CLAVE_SENSORES ?? "clave-de-desarrollo");
});
