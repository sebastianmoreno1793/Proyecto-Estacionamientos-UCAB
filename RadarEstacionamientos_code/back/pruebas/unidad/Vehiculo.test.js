// @HU-2.1 Registrar mis vehículos · Samuel — Prueba la placa normalizada y el dueño
// @HU-3.2 Simular sensores y placas · Aaron — La garita guarda la placa igual que «Mis vehículos»
// Pruebas de unidad de los modelos Placa, Vehiculo y LecturaDePlaca. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { LecturaDePlaca } from "../../logica/modelos/LecturaDePlaca.js";
import { Placa } from "../../logica/modelos/Placa.js";
import { Vehiculo } from "../../logica/modelos/Vehiculo.js";

test("la placa se guarda en mayúsculas y sin espacios ni guiones", () => {
  assert.equal(new Placa(" ab-123 cd ").toString(), "AB123CD");
  assert.ok(new Placa("AB123CD").esIgualA("ab 123-cd"));
});

test("el vehículo queda a nombre del dueño, aunque el correo venga con mayúsculas", () => {
  const v = Vehiculo.crear("ANA.PEREZ@est.ucab.edu.ve", { placa: "ab-123 cd", marca: "Toyota", modelo: "Corolla", color: "Gris" });
  assert.equal(v.placa, "AB123CD");
  assert.ok(v.esDe("ana.perez@est.ucab.edu.ve"));
});

test("REGLA: sin dueño no hay vehículo", () => {
  assert.throws(() => Vehiculo.crear(null, { placa: "AB123CD" }), { motivo: "sin_usuario" });
});

test("la lectura de la garita normaliza la placa igual y guarda la hora", () => {
  const ahora = new Date("2026-10-13T14:00:00Z");
  const l = LecturaDePlaca.crear({ placa: "ab-123 cd", sentido: "ENTRADA" }, ahora);
  assert.equal(l.placa, "AB123CD");
  assert.equal(l.hora, ahora.toISOString());
});

test("REGLA: el carro solo puede ENTRAR o SALIR, y sin placa no hay lectura", () => {
  assert.throws(() => LecturaDePlaca.crear({ placa: "AB123CD", sentido: "ARRIBA" }), { motivo: "sentido" });
  assert.throws(() => LecturaDePlaca.crear({ placa: " - ", sentido: "SALIDA" }), { motivo: "sin_placa" });
});
