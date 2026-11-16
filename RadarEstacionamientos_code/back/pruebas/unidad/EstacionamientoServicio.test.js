// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Prueba la lista con libres y semáforo
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Prueba cambiar capacidad y abrir o cerrar
// Pruebas de unidad del servicio EstacionamientoServicio. Se corren con: npm test
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../basedatos/AlmacenEnMemoria.js";
import { Fabrica } from "../../Fabrica.js";

let servicio;
const buscar = async (id) => (await servicio.listar()).find((e) => e.id === id);

beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  servicio = new Fabrica().servicios.estacionamientoServicio;
});

test("todos tienen capacidad, forma y semáforo, y empiezan abiertos", async () => {
  for (const e of await servicio.listar()) {
    assert.ok(e.capacidad >= 1, `${e.id} no tiene capacidad`);
    assert.equal(e.activo, true);
    assert.ok(e.poligono.length >= 3);
    assert.ok(["hay", "no-hay"].includes(e.semaforo.nivel));
  }
});

test("lo que sale no trae datos de más (vista pública)", async () => {
  const e = await buscar("est-labs");
  assert.deepEqual(Object.keys(e).sort(), ["activo", "capacidad", "etiqueta", "id", "libres", "nombre", "ocupados", "poligono", "porcentaje", "semaforo", "soloProfesores"]);
});

test("guarda la capacidad nueva y los libres se calculan con ella", async () => {
  const e = await servicio.cambiar("est-playa", { capacidad: 50 });
  assert.equal(e.capacidad, 50);
  assert.equal(e.libres, Math.max(0, 50 - e.ocupados));
});

test("cambiar solo la capacidad no cierra el estacionamiento; se puede cerrar y volver a abrir", async () => {
  assert.equal((await servicio.cambiar("est-labs", { capacidad: 40 })).activo, true);
  assert.equal((await servicio.cambiar("est-labs", { activo: false })).semaforo.nivel, "cerrado");
  assert.equal((await servicio.cambiar("est-labs", { activo: true })).activo, true);
});

test("avisa si el estacionamiento no existe", async () => {
  await assert.rejects(servicio.cambiar("no-existe", { capacidad: 10 }), { motivo: "no_existe" });
});
