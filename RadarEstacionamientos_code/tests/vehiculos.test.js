// HU 2.1 Registrar mis vehículos.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { esPlacaValida, normalizarPlaca } from "../lib/vehiculos/reglas.js";
import { buscarPorPlaca, listarVehiculosDe, registrarVehiculo, reiniciarVehiculos } from "../lib/vehiculos/datos.js";

const ANA = "ana.perez@est.ucab.edu.ve";
const JOSE = "jose.gomez@ucab.edu.ve";
const CARRO = { placa: "ab-123 cd", marca: "Toyota", modelo: "Corolla", color: "Gris" };

describe("placas", () => {
  test("se guardan en mayúsculas y sin espacios ni guiones", () => {
    assert.equal(normalizarPlaca(" ab-123 cd "), "AB123CD");
  });

  test("aceptan 6 o 7 letras y números", () => {
    assert.equal(esPlacaValida("AB123CD"), true);
    assert.equal(esPlacaValida("AB1C23"), true);
    assert.equal(esPlacaValida("ABCDEFG"), false);
    assert.equal(esPlacaValida("12345"), false);
    assert.equal(esPlacaValida("AB-12#CD"), false);
  });
});

describe("registrar mis vehículos", () => {
  beforeEach(() => reiniciarVehiculos());

  test("el usuario registra su vehículo con placa, marca, modelo y color", async () => {
    const { vehiculo } = await registrarVehiculo(ANA, CARRO);
    assert.equal(vehiculo.placa, "AB123CD");
    assert.equal(vehiculo.dueno, ANA);
    assert.deepEqual(
      (await listarVehiculosDe(ANA)).map((v) => v.placa),
      ["AB123CD"],
    );
  });

  test("puede registrar más de un vehículo", async () => {
    await registrarVehiculo(ANA, CARRO);
    await registrarVehiculo(ANA, { ...CARRO, placa: "XY987ZW", marca: "Ford" });
    assert.equal((await listarVehiculosDe(ANA)).length, 2);
  });

  test("cada usuario solo ve sus vehículos", async () => {
    await registrarVehiculo(ANA, CARRO);
    assert.deepEqual(await listarVehiculosDe(JOSE), []);
  });

  test("una placa no se puede registrar dos veces", async () => {
    await registrarVehiculo(ANA, CARRO);
    const repetida = await registrarVehiculo(JOSE, { ...CARRO, placa: "AB123CD" });
    assert.ok(repetida.error);
    assert.equal((await buscarPorPlaca("AB123CD")).dueno, ANA);
  });

  test("no se registra con datos incompletos o una placa inválida", async () => {
    assert.ok((await registrarVehiculo(ANA, { ...CARRO, marca: "  " })).error);
    assert.ok((await registrarVehiculo(ANA, { ...CARRO, placa: "123" })).error);
    assert.deepEqual(await listarVehiculosDe(ANA), []);
  });

  test("sin sesión no se registra", async () => {
    assert.ok((await registrarVehiculo(null, CARRO)).error);
  });
});
