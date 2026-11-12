// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Prueba que los avisos de entrada y salida se registren
// @HU-3.2 Simular sensores y placas · Aaron — Prueba los avisos que genera el simulador de sensores
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Prueba que el aforo suba y baje con los avisos
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Prueba que el semáforo cambie con los avisos
// HU 3.1 Recibir avisos · HU 3.2 Lector de placas · HU 4.1 Actualizar el aforo.
// Es lo que reciben los sensores, el simulador y Postman por la API.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { reiniciarAlmacen } from "../piezas_compartidas/almacen.js";
import {
  cambiarEstacionamiento,
  listarEstacionamientos,
  listarMovimientos,
  registrarAviso,
  vistaPublica,
} from "../reglas_y_datos/estacionamientos/datos.js";
import { aplicarMovimiento, porcentajeDeOcupacion } from "../reglas_y_datos/estacionamientos/reglas.js";
import { listarLecturasDePlaca, registrarLecturaDePlaca } from "../reglas_y_datos/garita/datos.js";
import { normalizarPlaca, validarLectura } from "../reglas_y_datos/garita/reglas.js";
import { emitir, suscribir } from "../piezas_compartidas/eventos_en_vivo.js";
import { esClaveDeSensorValida } from "../control_de_acceso/clave_sensores.js";

const labs = async () => (await listarEstacionamientos()).find((e) => e.id === "est-labs");

// @HU-3.1 Recibir avisos de entrada y salida · Aaron
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron
describe("avisos de entrada y salida de los sensores", () => {
  beforeEach(() => reiniciarAlmacen());

  test("una entrada ocupa un puesto y queda registrada con estacionamiento, tipo y hora", async () => {
    const antes = await labs();
    const ahora = new Date("2026-10-13T14:00:00Z");
    const { movimiento, estacionamiento } = await registrarAviso({ estacionamientoId: "est-labs", tipo: "ENTRADA" }, ahora);
    assert.equal(estacionamiento.ocupados, antes.ocupados + 1);
    assert.deepEqual(
      { estacionamientoId: movimiento.estacionamientoId, tipo: movimiento.tipo, hora: movimiento.hora },
      { estacionamientoId: "est-labs", tipo: "ENTRADA", hora: ahora.toISOString() },
    );
    assert.equal((await listarMovimientos()).length, 1);
  });

  test("una salida libera un puesto", async () => {
    const antes = await labs();
    const { estacionamiento } = await registrarAviso({ estacionamientoId: "est-labs", tipo: "salida" });
    assert.equal(estacionamiento.ocupados, antes.ocupados - 1);
  });

  test("en un estacionamiento lleno la entrada se rechaza y no cambia nada", async () => {
    await cambiarEstacionamiento("est-labs", { capacidad: "38", activo: true }); // 38 ocupados de 38
    const resultado = await registrarAviso({ estacionamientoId: "est-labs", tipo: "ENTRADA" });
    assert.equal(resultado.motivo, "lleno");
    assert.equal((await labs()).ocupados, 38);
    assert.equal((await listarMovimientos()).length, 0);
  });

  test("sin carros dentro, la salida se rechaza: nunca hay más libres que la capacidad", () => {
    const resultado = aplicarMovimiento({ activo: true, capacidad: 10, ocupados: 0 }, "SALIDA");
    assert.equal(resultado.motivo, "vacio");
  });

  test("un estacionamiento cerrado también cuenta sus entradas y salidas", async () => {
    await cambiarEstacionamiento("est-labs", { capacidad: "40", activo: false });
    const antes = await labs();
    const resultado = await registrarAviso({ estacionamientoId: "est-labs", tipo: "SALIDA" });
    assert.equal(resultado.error, undefined);
    assert.equal((await labs()).ocupados, antes.ocupados - 1);
  });

  test("rechaza estacionamientos que no existen y tipos inválidos", async () => {
    assert.equal((await registrarAviso({ estacionamientoId: "no-existe", tipo: "ENTRADA" })).motivo, "no_existe");
    assert.equal((await registrarAviso({ estacionamientoId: "est-labs", tipo: "PASO" })).motivo, "tipo");
  });

});

// @HU-4.2 Consultar el semáforo de ocupación · Aaron
describe("semáforo y vista pública", () => {
  test("el porcentaje nunca pasa de 100 ni baja de 0", () => {
    assert.equal(porcentajeDeOcupacion({ capacidad: 50, ocupados: 25 }), 50);
    assert.equal(porcentajeDeOcupacion({ capacidad: 20, ocupados: 30 }), 100);
    assert.equal(porcentajeDeOcupacion({ capacidad: 20, ocupados: -3 }), 0);
  });

  test("la vista pública trae libres y porcentaje, y nada más", () => {
    const vista = vistaPublica({
      id: "x", nombre: "X", etiqueta: "X", soloProfesores: false, capacidad: 40, ocupados: 30, activo: true, extra: "no",
    });
    assert.equal(vista.libres, 10);
    assert.equal(vista.porcentaje, 75);
    assert.equal("extra" in vista, false);
  });
});

// @HU-3.2 Simular sensores y placas · Aaron
describe("lector de placas de la garita", () => {
  beforeEach(() => reiniciarAlmacen());

  test("normaliza la placa como la escriba el lector", () => {
    assert.equal(normalizarPlaca(" ab-123 cd "), "AB123CD");
  });

  test("acepta placas de 6 o 7 caracteres y rechaza el resto", () => {
    assert.deepEqual(validarLectura({ placa: "AB123CD", sentido: "entrada" }), { placa: "AB123CD", sentido: "ENTRADA" });
    assert.ok(validarLectura({ placa: "ABC12D", sentido: "SALIDA" }).placa);
    assert.ok(validarLectura({ placa: "12", sentido: "ENTRADA" }).error);
    assert.ok(validarLectura({ placa: "AB123CD", sentido: "ARRIBA" }).error);
  });

  test("la lectura queda registrada con la hora y no se duplica si se reintenta", async () => {
    const ahora = new Date("2026-10-13T14:00:00Z");
    const { lectura } = await registrarLecturaDePlaca({ placa: "AB123CD", sentido: "ENTRADA", idLectura: "garita-1" }, ahora);
    assert.equal(lectura.hora, ahora.toISOString());
    const otra = await registrarLecturaDePlaca({ placa: "AB123CD", sentido: "ENTRADA", idLectura: "garita-1" });
    assert.equal(otra.repetida, true);
    assert.equal((await listarLecturasDePlaca()).length, 1);
  });
});

// @HU-3.1 Recibir avisos de entrada y salida · Aaron
// @HU-3.2 Simular sensores y placas · Aaron
describe("clave de los sensores", () => {
  test("solo vale la clave exacta", () => {
    assert.equal(esClaveDeSensorValida("secreta", "secreta"), true);
    assert.equal(esClaveDeSensorValida("otra", "secreta"), false);
    assert.equal(esClaveDeSensorValida(undefined, "secreta"), false);
  });

  test("sin clave configurada (producción sin CLAVE_SENSORES) no entra nadie", () => {
    assert.equal(esClaveDeSensorValida("lo-que-sea", null), false);
  });
});

describe("canal en vivo", () => {
  test("quien está suscrito recibe cada cambio con su clase y hora, y deja de recibir al salir", () => {
    const recibidos = [];
    const salir = suscribir((m) => recibidos.push(m));
    emitir("AVISO", { estacionamiento: { id: "est-labs" } });
    salir();
    emitir("AVISO", {});
    assert.equal(recibidos.length, 1);
    assert.equal(recibidos[0].clase, "AVISO");
    assert.ok(recibidos[0].hora);
  });
});
