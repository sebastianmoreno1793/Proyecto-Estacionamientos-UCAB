// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Prueba que cada aviso quede registrado con su hora
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Prueba que el aforo cambie y que los rechazos no lo cambien
// Pruebas de unidad del servicio AforoServicio. Se corren con: npm test
import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../datos/basedatos/AlmacenEnMemoria.js";
import { Fabrica } from "../../Fabrica.js";
import { AvisoDTO } from "../../logica/dto/AvisoDTO.js";

let servicios;
const aviso = (estacionamientoId, tipo) => AvisoDTO.desdeCuerpo({ estacionamientoId, tipo });
const labs = async () => (await servicios.estacionamientoServicio.listar()).find((e) => e.id === "est-labs");

beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  servicios = new Fabrica().servicios;
});

describe("AforoServicio.registrar", () => {
  test("una entrada ocupa un puesto y queda registrada con estacionamiento, tipo y hora", async () => {
    const antes = await labs();
    const ahora = new Date("2026-10-13T14:00:00Z");
    const { movimiento, estacionamiento } = await servicios.aforoServicio.registrar(aviso("est-labs", "entrada"), ahora);
    assert.equal(estacionamiento.ocupados, antes.ocupados + 1);
    assert.deepEqual([movimiento.estacionamientoId, movimiento.tipo, movimiento.hora], ["est-labs", "ENTRADA", ahora.toISOString()]);
    assert.equal((await servicios.aforoServicio.ultimosMovimientos()).length, 1);
  });

  test("en un estacionamiento lleno la entrada se rechaza, no cambia nada y queda como anomalía", async () => {
    await servicios.estacionamientoServicio.cambiar("est-labs", { capacidad: 38 }); // 38 de 38
    await assert.rejects(servicios.aforoServicio.registrar(aviso("est-labs", "ENTRADA")), { motivo: "lleno" });
    assert.equal((await labs()).ocupados, 38);
    assert.equal((await servicios.aforoServicio.ultimosMovimientos()).length, 0);
    assert.equal((await servicios.aforoServicio.ultimosRechazos())[0].motivo, "lleno");
  });

  test("un estacionamiento que no existe queda rechazado con la hora (RN4)", async () => {
    await assert.rejects(servicios.aforoServicio.registrar(aviso("no-existe", "ENTRADA")), { motivo: "no_existe" });
    const [rechazo] = await servicios.aforoServicio.ultimosRechazos();
    assert.equal(rechazo.motivo, "no_existe");
    assert.ok(!Number.isNaN(Date.parse(rechazo.hora)));
  });

  test("tres anomalías seguidas marcan el sensor con falla y lo avisan por el canal en vivo", async () => {
    const recibidos = [];
    const salir = servicios.eventos.suscribir((m) => recibidos.push(m.clase));
    await servicios.estacionamientoServicio.cambiar("est-labs", { capacidad: 10 });
    for (let i = 0; i < 3; i++) await servicios.aforoServicio.registrar(aviso("est-labs", "ENTRADA")).catch(() => {});
    salir();
    assert.ok(recibidos.includes("SENSOR_CON_FALLA"));
    assert.deepEqual((await servicios.aforoServicio.estadoDeLosSensores()).conFalla, ["est-labs"]);
  });
});
