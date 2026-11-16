// Pruebas de unidad de la clase base Repositorio (con EdificioRepositorio). Se corren con: npm test
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../basedatos/AlmacenEnMemoria.js";
import { Edificio } from "../../modelos/Edificio.js";
import { EdificioRepositorio } from "../../repositorios/EdificioRepositorio.js";

let repositorio;
beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  repositorio = new EdificioRepositorio();
});

test("devuelve modelos, no los registros guardados", async () => {
  const [primero] = await repositorio.listar();
  assert.ok(primero instanceof Edificio);
});

test("guardar inserta o reemplaza por id, y eliminar lo quita", async () => {
  const antes = (await repositorio.listar()).length;
  await repositorio.guardar(new Edificio({ id: "edif-nuevo", nombre: "Nuevo" }));
  await repositorio.guardar(new Edificio({ id: "edif-nuevo", nombre: "Nuevo 2" }));
  assert.equal((await repositorio.listar()).length, antes + 1);
  assert.equal((await repositorio.buscarPorId("edif-nuevo")).nombre, "Nuevo 2");
  assert.equal((await repositorio.eliminar("edif-nuevo")).nombre, "Nuevo 2");
  assert.equal(await repositorio.buscarPorId("edif-nuevo"), null);
  assert.equal(await repositorio.eliminar("edif-nuevo"), null);
});

test("cambiar un modelo devuelto no toca lo guardado hasta llamar a guardar()", async () => {
  const aulas = await repositorio.buscarPorId("edif-aulas");
  aulas.cambiar({ nombre: "Cambiado" });
  assert.equal((await repositorio.buscarPorId("edif-aulas")).nombre, "Edificio de Aulas");
});

test("reiniciar vuelve el campus a los datos de ejemplo", async () => {
  await repositorio.eliminar("edif-aulas");
  await repositorio.reiniciarDatosDeEjemplo();
  assert.ok(await repositorio.buscarPorId("edif-aulas"));
});
