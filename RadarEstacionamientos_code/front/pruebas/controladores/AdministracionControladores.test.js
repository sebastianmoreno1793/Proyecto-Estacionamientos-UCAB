// @HU-2.1 Registrar mis vehículos · Samuel — Prueba el control de Mis vehículos
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Prueba el control de Administrar › Puestos
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Prueba el control de Administrar › Edificios
// Pruebas de EstacionamientoControlador, EdificioControlador y VehiculoControlador (front). Se corren con: npm test
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { EdificioControlador } from "../../controladores/EdificioControlador.js";
import { EstacionamientoControlador } from "../../controladores/EstacionamientoControlador.js";
import { VehiculoControlador } from "../../controladores/VehiculoControlador.js";
import { ServicioDePrueba, formulario } from "./ayuda.js";

describe("EstacionamientoControlador.cambiar (HU 5.4)", () => {
  test("con una capacidad válida manda capacidad (número) y activo (sí/no) y muestra MensajeCambiosGuardados", async () => {
    const servicio = new ServicioDePrueba({ cambiar: { ok: true, datos: { estacionamiento: { id: "est-labs" } } } });
    const r = await new EstacionamientoControlador({ servicio }).cambiar("est-labs", formulario({ capacidad: "40", activo: "on" }));
    const [id, cambio] = servicio.llamadas[0].argumentos;
    assert.deepEqual([id, { ...cambio }], ["est-labs", { capacidad: 40, activo: true }]);
    assert.equal(r.interfaz, "MensajeCambiosGuardados");
  });

  test("sin la casilla marcada se cierra; con capacidad 0 no se manda nada", async () => {
    const servicio = new ServicioDePrueba({ cambiar: { ok: true, datos: {} } });
    const controlador = new EstacionamientoControlador({ servicio });
    await controlador.cambiar("est-labs", formulario({ capacidad: "40" }));
    assert.equal(servicio.llamadas[0].argumentos[1].activo, false);
    const r = await controlador.cambiar("est-labs", formulario({ capacidad: "0", activo: "on" }));
    assert.equal(r.interfaz, "MensajeDatosNoValidos");
    assert.equal(servicio.llamadas.length, 1);
  });
});

describe("EdificioControlador (HU 6.1)", () => {
  test("agregar valida, manda nombre y ubicación como números y muestra MensajeHecho", async () => {
    const servicio = new ServicioDePrueba({ agregar: { ok: true, datos: { edificio: { id: "edif-modulo-1", nombre: "Módulo 1" } } } });
    const r = await new EdificioControlador({ servicio }).agregar(formulario({ nombre: " Módulo  1 ", latitud: "10,4642", longitud: "-66,9762" }));
    assert.deepEqual({ ...servicio.llamadas[0].argumentos[0] }, { nombre: "Módulo 1", ubicacion: [10.4642, -66.9762] });
    assert.equal(r.mensaje, 'Se agregó "Módulo 1".');
  });

  test("un nombre repetido lo dice el back (regla de negocio) y se muestra igual", async () => {
    const servicio = new ServicioDePrueba({ agregar: { ok: false, estado: 409, error: "Ya hay un edificio con ese nombre." } });
    const r = await new EdificioControlador({ servicio }).agregar(formulario({ nombre: "Aula Magna" }));
    assert.deepEqual([r.interfaz, r.error], ["MensajeDatosNoValidos", "Ya hay un edificio con ese nombre."]);
  });
});

describe("VehiculoControlador (HU 2.1)", () => {
  test("registra con la placa normalizada y muestra MensajeVehiculoRegistrado", async () => {
    const servicio = new ServicioDePrueba({ registrar: { ok: true, datos: { vehiculo: { placa: "AB123CD" } } } });
    const r = await new VehiculoControlador({ servicio }).registrar(formulario({ placa: "ab-123 cd", marca: "Toyota", modelo: "Corolla", color: "Gris" }));
    assert.equal(servicio.llamadas[0].argumentos[0].placa, "AB123CD");
    assert.deepEqual([r.interfaz, r.mensaje], ["MensajeVehiculoRegistrado", "Vehículo AB123CD registrado."]);
  });

  test("con una placa inválida no llama al back y devuelve lo escrito", async () => {
    const servicio = new ServicioDePrueba({});
    const r = await new VehiculoControlador({ servicio }).registrar({ placa: "123", marca: "Toyota", modelo: "Corolla", color: "Gris" });
    assert.equal(r.valores.marca, "Toyota");
    assert.equal(servicio.llamadas.length, 0);
  });
});
