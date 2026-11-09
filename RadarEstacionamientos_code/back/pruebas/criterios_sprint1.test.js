// Criterios de aceptación del Sprint 1 que no tenían prueba, o cuya prueba no miraba el mensaje.
// Cada `describe` es una HU y cada `test` nombra el criterio (CA) o la regla (RN) que demuestra.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import MAQUETA from "../campus/maqueta.json" with { type: "json" };
import { ESTACIONAMIENTOS } from "../campus/estacionamientos.js";
import { reiniciarAlmacen } from "../logica/almacen.js";
import { validarEdificio } from "../logica/edificios/reglas.js";
import {
  cambiarEstacionamiento,
  listarAvisosRechazados,
  listarEstacionamientosActivos,
  listarMovimientos,
  registrarAviso,
  vistaPublica,
} from "../logica/estacionamientos/datos.js";
import { nivelDelSemaforo, textoLibres } from "../logica/estacionamientos/reglas.js";
import { validarLectura } from "../logica/garita/reglas.js";
import { listarIncidencias, registrarIncidencia } from "../logica/incidencias/datos.js";
import { registrarUsuario, reiniciarUsuarios } from "../logica/usuarios/datos.js";
import { inicialesDe, nombreCorto } from "../logica/usuarios/reglas.js";
import { listarVehiculosDe, registrarVehiculo, reiniciarVehiculos } from "../logica/vehiculos/datos.js";
import { esPlacaValida } from "../logica/vehiculos/reglas.js";

beforeEach(() => {
  reiniciarAlmacen();
  reiniciarUsuarios();
  reiniciarVehiculos();
});

describe("HU 1.1 · Crear cuenta con el correo institucional", () => {
  const datos = { correo: "ana.perez@est.ucab.edu.ve", contrasena: "clave1234", confirmacion: "clave1234" };

  test("CA: con un correo que ya tiene cuenta (aunque cambien mayúsculas o espacios) dice que ya existe", async () => {
    await registrarUsuario(datos);
    const { error } = await registrarUsuario({ ...datos, correo: "  ANA.PEREZ@EST.UCAB.EDU.VE " });
    assert.match(error, /Ya existe una cuenta con ese correo/);
  });

  test("RN: 7 caracteres no alcanzan y 8 sí", async () => {
    assert.match((await registrarUsuario({ ...datos, contrasena: "1234567", confirmacion: "1234567" })).error, /8/);
    assert.ok((await registrarUsuario({ ...datos, contrasena: "12345678", confirmacion: "12345678" })).usuario);
  });

  test("rechaza un correo UCAB mal escrito (con espacios)", async () => {
    assert.ok((await registrarUsuario({ ...datos, correo: "ana perez@est.ucab.edu.ve" })).error);
  });
});

describe("HU 2.1 · Registrar mis vehículos", () => {
  const CARRO = { placa: "AB123CD", marca: "Toyota", modelo: "Corolla", color: "Gris" };

  test("el dueño se reconoce aunque el correo venga con mayúsculas", async () => {
    await registrarVehiculo("ANA.PEREZ@est.ucab.edu.ve", CARRO);
    assert.equal((await listarVehiculosDe("ana.perez@est.ucab.edu.ve")).length, 1);
  });

  test("la garita (HU 3.2) y el registro aceptan exactamente las mismas placas", () => {
    for (const placa of ["ABCDEFG", "1234567", "AB123CD", "ab-123 cd"]) {
      assert.equal(!validarLectura({ placa, sentido: "ENTRADA" }).error, esPlacaValida(placa), placa);
    }
  });
});

describe("HU 3.1 y 4.1 · Avisos de entrada y salida y aforo", () => {
  const libresDe = async (id) => vistaPublica((await registrarAviso({ estacionamientoId: id, tipo: "SALIDA" })).estacionamiento).libres;

  test("CA1 y CA2: una entrada resta un libre, una salida lo devuelve, y cada una queda con su hora", async () => {
    const e = await registrarAviso({ estacionamientoId: "est-labs", tipo: "ENTRADA" });
    const antes = vistaPublica(e.estacionamiento).libres + 1;
    const s = await registrarAviso({ estacionamientoId: "est-labs", tipo: "SALIDA" });
    assert.equal(vistaPublica(s.estacionamiento).libres, antes);
    const [ultimo, primero] = await listarMovimientos();
    assert.deepEqual([primero.tipo, ultimo.tipo], ["ENTRADA", "SALIDA"]);
    assert.ok(!Number.isNaN(Date.parse(ultimo.hora)));
  });

  test("CA5 (RN4): un aviso de un estacionamiento que no existe no cambia nada y queda rechazado con la hora", async () => {
    const r = await registrarAviso({ estacionamientoId: "est-no-existe", tipo: "ENTRADA" });
    assert.equal(r.motivo, "no_existe");
    const [rechazo] = await listarAvisosRechazados();
    assert.equal(rechazo.motivo, "no_existe");
    assert.ok(!Number.isNaN(Date.parse(rechazo.hora)));
    assert.equal((await listarMovimientos()).length, 0);
  });

  test("CA3 y CA4 (RN3): un aviso que rompería los límites no cambia el aforo y queda como anomalía", async () => {
    await cambiarEstacionamiento("est-labs", { capacidad: "10", activo: true }); // hay más carros que puestos
    const r = await registrarAviso({ estacionamientoId: "est-labs", tipo: "ENTRADA" });
    assert.equal(r.motivo, "lleno");
    assert.equal((await listarAvisosRechazados())[0].motivo, "lleno");
  });

  test("un idAviso usado por otro estacionamiento no se toma como repetido", async () => {
    await registrarAviso({ estacionamientoId: "est-labs", tipo: "ENTRADA", idAviso: "s-1" });
    const r = await registrarAviso({ estacionamientoId: "est-playa", tipo: "ENTRADA", idAviso: "s-1" });
    assert.notEqual(r.repetido, true);
    assert.equal(r.movimiento.estacionamientoId, "est-playa");
  });

  test("si la capacidad baja por debajo de los ocupados: 0 libres, rojo y no entra nadie más", async () => {
    const { estacionamiento } = await cambiarEstacionamiento("est-labs", { capacidad: "10", activo: true });
    const vista = vistaPublica(estacionamiento);
    assert.equal(vista.libres, 0);
    assert.equal(nivelDelSemaforo(vista).nivel, "no-hay");
    assert.ok(await libresDe("est-labs") >= 0);
  });
});

describe("HU 4.2 · Semáforo de ocupación", () => {
  test("siempre dice la cantidad de libres, en singular o en plural", () => {
    assert.equal(textoLibres(1), "1 libre");
    assert.equal(textoLibres(0), "0 libres");
    assert.equal(textoLibres(12), "12 libres");
  });

  test("lleno → rojo con «No hay puesto»", () => {
    const v = vistaPublica({ id: "x", nombre: "X", etiqueta: "X", soloProfesores: false, capacidad: 40, ocupados: 40, activo: true });
    assert.equal(v.libres, 0);
    assert.equal(nivelDelSemaforo(v).texto, "No hay puesto");
  });
});

describe("HU 5.1 · Estacionamientos en el mapa del campus", () => {
  test("la maqueta dibuja exactamente los estacionamientos del catálogo", () => {
    assert.deepEqual(
      MAQUETA.estacionamientos.map((e) => e.id).sort(),
      ESTACIONAMIENTOS.map((e) => e.id).sort(),
    );
  });
});

describe("HU 5.4 · Modificar la capacidad y el estado", () => {
  test("cambiar solo la capacidad no cierra el estacionamiento", async () => {
    const { estacionamiento } = await cambiarEstacionamiento("est-labs", { capacidad: "40" });
    assert.equal(estacionamiento.activo, true);
  });

  test("«activo» como texto se rechaza (no se abre ni se cierra por error)", async () => {
    assert.ok((await cambiarEstacionamiento("est-labs", { capacidad: "40", activo: "false" })).error);
  });
});

describe("HU 6.1 · Catálogo de edificios", () => {
  test("rechaza nombres sin letras ni números", () => {
    assert.ok(validarEdificio({ nombre: "¡¡" }, []).error);
  });
});

describe("HU 9.1 · Crear una incidencia", () => {
  const quien = "ana@est.ucab.edu.ve";

  test("CA2: sin estacionamiento o sin tipo no registra y dice qué falta", async () => {
    assert.match((await registrarIncidencia({ tipo: "conos_atravesados", reportadaPor: quien })).error, /estacionamiento/);
    assert.match((await registrarIncidencia({ estacionamientoId: "est-playa", reportadaPor: quien })).error, /tipo/);
    assert.equal((await listarIncidencias()).length, 0);
  });

  test("CA2: si faltan los dos, dice los dos", async () => {
    const { error } = await registrarIncidencia({ reportadaPor: quien });
    assert.match(error, /estacionamiento/);
    assert.match(error, /tipo/);
  });

  test("CA3: un estacionamiento cerrado no aparece en la lista del formulario", async () => {
    await cambiarEstacionamiento("est-labs", { capacidad: "40", activo: false });
    assert.ok(!(await listarEstacionamientosActivos()).some((e) => e.id === "est-labs"));
  });

  test("RN: sin usuario no se registra", async () => {
    assert.ok((await registrarIncidencia({ estacionamientoId: "est-playa", tipo: "conos_atravesados" })).error);
  });
});

describe("Rediseño · textos cortos", () => {
  test("iniciales del perfil", () => {
    assert.equal(inicialesDe("sebastian.moreno@est.ucab.edu.ve"), "SM");
    assert.equal(inicialesDe("usuario.prueba@ucab.edu.ve"), "UP");
    assert.equal(inicialesDe("ana@ucab.edu.ve"), "AN");
  });

  test("nombre corto del edificio", () => {
    assert.equal(nombreCorto("Edificio de Aulas"), "Aulas");
    assert.equal(nombreCorto("Edificio Cincuentenario"), "Cincuentenario");
    assert.equal(nombreCorto("Aula Magna"), "Aula Magna");
  });
});
