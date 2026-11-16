// @HU-2.1 Registrar mis vehículos · Samuel — Prueba la validación de la placa y los datos del vehículo
// Pruebas del validador VehiculoValidador. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { VehiculoValidador } from "../../validadores/VehiculoValidador.js";

const validador = new VehiculoValidador();
const CARRO = { placa: "ab-123 cd", marca: " Toyota ", modelo: "Corolla", color: "Gris" };

test("la placa se normaliza: mayúsculas y sin espacios ni guiones", () => {
  assert.equal(VehiculoValidador.normalizarPlaca(" ab-123 cd "), "AB123CD");
  assert.deepEqual(validador.validar(CARRO).datos, { placa: "AB123CD", marca: "Toyota", modelo: "Corolla", color: "Gris" });
});

test("acepta placas de 6 o 7 letras y números, con al menos una letra y un número", () => {
  assert.equal(VehiculoValidador.esPlacaValida("AB123CD"), true);
  assert.equal(VehiculoValidador.esPlacaValida("AB1C23"), true);
  assert.equal(VehiculoValidador.esPlacaValida("ABCDEFG"), false);
  assert.equal(VehiculoValidador.esPlacaValida("1234567"), false);
  assert.equal(VehiculoValidador.esPlacaValida("12345"), false);
  assert.equal(VehiculoValidador.esPlacaValida("AB-12#CD"), false);
});

test("no deja enviar con datos incompletos o muy largos", () => {
  assert.equal(validador.validar({ ...CARRO, marca: "  " }).error, "Falta la marca del vehículo.");
  assert.ok(validador.validar({ ...CARRO, color: "x".repeat(31) }).errores.color);
  assert.ok(validador.validar({ ...CARRO, placa: "123" }).errores.placa);
});
