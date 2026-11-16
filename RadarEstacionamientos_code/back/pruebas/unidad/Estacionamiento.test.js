// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Prueba que el aforo suba y baje sin salirse de 0 y la capacidad
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Prueba libres, porcentaje y semáforo
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Prueba la capacidad nueva y abrir o cerrar
// Pruebas de unidad del modelo Estacionamiento. Se corren con: npm test
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { Estacionamiento } from "../../modelos/Estacionamiento.js";
import { ErrorDeNegocio } from "../../modelos/ErrorDeNegocio.js";

const nuevo = (datos = {}) => new Estacionamiento({ id: "est-x", nombre: "X", capacidad: 40, ocupados: 30, ...datos });

describe("Estacionamiento · libres y porcentaje (HU 4.2 y 5.4)", () => {
  test("los libres son la capacidad menos los ocupados", () => {
    assert.equal(nuevo({ capacidad: 100, ocupados: 30 }).libres(), 70);
  });

  test("nunca bajan de 0 si la capacidad queda por debajo de los ocupados", () => {
    assert.equal(nuevo({ capacidad: 20, ocupados: 30 }).libres(), 0);
  });

  test("nunca pasan de la capacidad", () => {
    assert.equal(nuevo({ capacidad: 50, ocupados: -5 }).libres(), 50);
  });

  test("el porcentaje nunca pasa de 100 ni baja de 0", () => {
    assert.equal(nuevo({ capacidad: 50, ocupados: 25 }).porcentaje(), 50);
    assert.equal(nuevo({ capacidad: 20, ocupados: 30 }).porcentaje(), 100);
    assert.equal(nuevo({ capacidad: 20, ocupados: -3 }).porcentaje(), 0);
  });
});

describe("Estacionamiento · entradas y salidas (HU 4.1)", () => {
  test("una entrada ocupa un puesto y una salida lo libera", () => {
    const e = nuevo();
    e.registrarEntrada();
    assert.equal(e.ocupados, 31);
    e.registrarSalida();
    e.registrarSalida();
    assert.equal(e.ocupados, 29);
  });

  test("lleno: la entrada se rechaza con el motivo «lleno» y no cambia nada", () => {
    const e = nuevo({ capacidad: 30, ocupados: 30 });
    assert.equal(e.motivoDeRechazo("ENTRADA"), "lleno");
    assert.throws(() => e.registrarEntrada(), (error) => error instanceof ErrorDeNegocio && error.motivo === "lleno");
    assert.equal(e.ocupados, 30);
  });

  test("sin carros dentro, la salida se rechaza («vacio»)", () => {
    assert.equal(nuevo({ capacidad: 10, ocupados: 0 }).motivoDeRechazo("SALIDA"), "vacio");
  });

  test("un tipo que no es ENTRADA ni SALIDA se rechaza («tipo»)", () => {
    assert.equal(nuevo().motivoDeRechazo("PASO"), "tipo");
  });

  test("un estacionamiento cerrado también cuenta sus entradas y salidas", () => {
    const e = nuevo({ activo: false });
    e.registrarSalida();
    assert.equal(e.ocupados, 29);
  });

  test("los atributos son privados: no se pueden cambiar por fuera", () => {
    const e = nuevo();
    assert.throws(() => {
      e.ocupados = 0;
    });
    assert.equal(e.ocupados, 30);
  });
});

describe("Estacionamiento · capacidad y estado (HU 5.4)", () => {
  test("con la capacidad nueva por debajo de los ocupados quedan 0 libres y semáforo rojo", () => {
    const e = nuevo({ capacidad: 40, ocupados: 38 });
    e.cambiarCapacidad(10);
    assert.equal(e.libres(), 0);
    assert.equal(e.semaforo().nivel, "no-hay");
  });

  test("cerrar y volver a abrir", () => {
    const e = nuevo();
    e.cerrar();
    assert.equal(e.estaAbierto(), false);
    assert.equal(e.semaforo().nivel, "cerrado");
    e.abrir();
    assert.equal(e.estaAbierto(), true);
  });
});

describe("Estacionamiento · etiquetas para zonas con el mismo nombre", () => {
  test("un nombre que no se repite queda igual", () => {
    assert.deepEqual(Estacionamiento.etiquetasUnicas([{ id: "est-labs", nombre: "Labs" }]), ["Labs"]);
  });

  test("las zonas repetidas se distinguen por el id", () => {
    const etiquetas = Estacionamiento.etiquetasUnicas([
      { id: "est-padel", nombre: "Pádel" },
      { id: "est-padel-norte", nombre: "Pádel" },
    ]);
    assert.deepEqual(etiquetas, ["Pádel (principal)", "Pádel (norte)"]);
  });
});
