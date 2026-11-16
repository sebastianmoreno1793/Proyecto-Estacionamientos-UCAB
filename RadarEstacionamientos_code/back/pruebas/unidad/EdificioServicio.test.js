// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Prueba agregar, modificar y quitar; el nombre no se repite
// Pruebas de unidad del servicio EdificioServicio. Se corren con: npm test
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../basedatos/AlmacenEnMemoria.js";
import { EDIFICIOS } from "../../basedatos/datos_iniciales/edificios.js";
import { Fabrica } from "../../Fabrica.js";

let servicio;
beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  servicio = new Fabrica().servicios.edificioServicio;
});

test("la lista empieza con el catálogo inicial, ordenada por nombre", async () => {
  const nombres = (await servicio.listar()).map((e) => e.nombre);
  assert.equal(nombres.length, EDIFICIOS.length);
  assert.deepEqual(nombres, [...nombres].sort((a, b) => a.localeCompare(b, "es")));
});

test("agregar un edificio lo muestra en la lista con un id sacado del nombre", async () => {
  const edificio = await servicio.agregar({ nombre: "Módulo de Aulas 2", ubicacion: null });
  assert.equal(edificio.id, "edif-modulo-de-aulas-2");
  assert.ok((await servicio.listar()).some((e) => e.nombre === "Módulo de Aulas 2"));
});

test("modificar cambia el nombre y la ubicación; puede conservar su propio nombre", async () => {
  await servicio.modificar("edif-aulas", { nombre: "Edificio de Aulas", ubicacion: [10.4643, -66.9763] });
  const aulas = (await servicio.listar()).find((e) => e.id === "edif-aulas");
  assert.deepEqual(aulas.ubicacion, [10.4643, -66.9763]);
});

test("REGLA: un nombre repetido no se guarda, aunque cambien mayúsculas o tildes", async () => {
  const antes = (await servicio.listar()).length;
  await assert.rejects(servicio.agregar({ nombre: "aula mágna" }), { motivo: "repetido" });
  await assert.rejects(servicio.modificar("edif-aulas", { nombre: "Aula Magna" }), { motivo: "repetido" });
  assert.equal((await servicio.listar()).length, antes);
});

test("quitar lo saca de la lista; no se modifica ni se quita uno que no existe", async () => {
  await servicio.quitar("edif-aula-magna");
  assert.ok(!(await servicio.listar()).some((e) => e.id === "edif-aula-magna"));
  await assert.rejects(servicio.modificar("edif-nada", { nombre: "X Y" }), { motivo: "no_existe" });
  await assert.rejects(servicio.quitar("edif-nada"), { motivo: "no_existe" });
});
