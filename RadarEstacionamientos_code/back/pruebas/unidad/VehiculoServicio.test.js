// @HU-2.1 Registrar mis vehículos · Samuel — Prueba registrar vehículos, que cada quien vea los suyos y que la placa no se repita
// Pruebas de unidad del servicio VehiculoServicio. Se corren con: npm test
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../basedatos/AlmacenEnMemoria.js";
import { Fabrica } from "../../Fabrica.js";
import { VehiculoDTO } from "../../dto/VehiculoDTO.js";

let servicio;
const ANA = "ana.perez@est.ucab.edu.ve";
const JOSE = "jose.gomez@ucab.edu.ve";
const CARRO = VehiculoDTO.desdeCuerpo({ placa: "ab-123 cd", marca: " Toyota ", modelo: "Corolla", color: "Gris" });

beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  servicio = new Fabrica().servicios.vehiculoServicio;
});

test("el usuario registra su vehículo con la placa normalizada", async () => {
  const v = await servicio.registrar(ANA, CARRO);
  assert.deepEqual([v.placa, v.marca], ["AB123CD", "Toyota"]);
  assert.deepEqual((await servicio.listarDe(ANA)).map((x) => x.placa), ["AB123CD"]);
});

test("puede registrar más de uno y cada usuario solo ve los suyos", async () => {
  await servicio.registrar(ANA, CARRO);
  await servicio.registrar(ANA, { ...CARRO, placa: "XY987ZW" });
  assert.equal((await servicio.listarDe(ANA)).length, 2);
  assert.deepEqual(await servicio.listarDe(JOSE), []);
});

test("REGLA: una placa no se registra dos veces en el Radar", async () => {
  await servicio.registrar(ANA, CARRO);
  await assert.rejects(servicio.registrar(JOSE, { ...CARRO, placa: "AB123CD" }), { motivo: "repetida" });
  assert.ok((await servicio.buscarPorPlaca("AB 123 CD")).esDe(ANA));
});

test("sin sesión no se registra", async () => {
  await assert.rejects(servicio.registrar(null, CARRO), { motivo: "sin_usuario" });
});
