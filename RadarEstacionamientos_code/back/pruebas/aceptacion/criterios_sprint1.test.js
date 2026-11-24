// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Prueba el criterio de aceptación de Crear cuenta
// @HU-2.1 Registrar mis vehículos · Samuel — Prueba el criterio de aceptación de Mis vehículos
// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Prueba el criterio de aceptación de los avisos de los sensores
// @HU-3.2 Simular sensores y placas · Aaron — Prueba el criterio de aceptación del lector de placas
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Prueba el criterio de aceptación del aforo
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Prueba el criterio de aceptación del semáforo
// @HU-5.1 Consultar los estacionamientos en el mapa del campus · German — Prueba el criterio de aceptación del mapa
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Prueba el criterio de aceptación de capacidad y estado
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Prueba el criterio de aceptación del catálogo de edificios
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Prueba el criterio de aceptación de la sugerencia
// @HU-9.1 Crear una incidencia · Sebastian — Prueba el criterio de aceptación de Crear una incidencia
// Pruebas de ACEPTACIÓN del Sprint 1, del lado del back: cada `describe` es una HU y cada `test`
// nombra el criterio (CA) o la regla de negocio (RN) que demuestra, por la API como lo haría un
// actor real. Los criterios de validación de formularios (CA de mensajes) están en front/pruebas/.
// Se corren con: npm test
import { readFileSync } from "node:fs";
import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { ESTACIONAMIENTOS } from "../../datos/basedatos/datos_iniciales/estacionamientos.js";
import { Ayuda, CLAVE_SENSOR } from "../integracion/ayuda.js";

let a;
let f;
beforeEach(() => {
  a = new Ayuda();
  f = a.fabrica;
});

const json = async (respuesta) => ({ estado: respuesta.status, ...(await respuesta.json()) });
const aviso = (estacionamientoId, tipo) => f.avisoControlador.recibir(a.peticion("/api/avisos", "POST", { estacionamientoId, tipo }, CLAVE_SENSOR));
const estacionamiento = async (id) => (await json(await f.estacionamientoControlador.listar())).estacionamientos.find((e) => e.id === id);

describe("HU 1.1 · Crear cuenta con el correo institucional", () => {
  const datos = { correo: "ana.perez@est.ucab.edu.ve", contrasena: "clave1234" };

  test("CA1: con un correo UCAB se crea la cuenta y queda con la sesión abierta", async () => {
    const r = await f.cuentaControlador.crearCuenta(a.peticion("/api/cuenta", "POST", datos));
    const cookie = r.headers.get("set-cookie").split(";")[0];
    const sesion = await json(await f.cuentaControlador.sesionActual(a.peticion("/api/sesion", "GET", undefined, { cookie })));
    assert.equal(sesion.usuario.correo, datos.correo);
  });

  test("paso 10.1: con un correo que ya tiene cuenta dice que ya existe, letra por letra", async () => {
    await f.cuentaControlador.crearCuenta(a.peticion("/api/cuenta", "POST", datos));
    const r = await json(await f.cuentaControlador.crearCuenta(a.peticion("/api/cuenta", "POST", { ...datos, correo: " ANA.PEREZ@EST.UCAB.EDU.VE " })));
    assert.equal(r.error, "Ya existe una cuenta con ese correo. Inicia sesión");
  });

  test("RN (D-003): el rol sale del dominio; sin dominio UCAB no hay cuenta aunque se salten el front", async () => {
    const r = await json(await f.cuentaControlador.crearCuenta(a.peticion("/api/cuenta", "POST", { ...datos, correo: "ana@gmail.com" })));
    assert.equal(r.error, "Solo puede entrar la comunidad UCAB. Usa tu correo institucional");
  });
});

describe("HU 2.1 · Registrar mis vehículos", () => {
  test("CA: el vehículo queda a nombre de quien tiene la sesión y solo él lo ve", async () => {
    const ana = await a.cookieDe("estudiante.prueba@est.ucab.edu.ve");
    await f.vehiculoControlador.registrar(a.peticion("/v", "POST", { placa: "ab 123 cd", marca: "Ford", modelo: "Fiesta", color: "Azul" }, ana));
    const suyos = await json(await f.vehiculoControlador.listar(a.peticion("/v", "GET", undefined, ana)));
    const ajenos = await json(await f.vehiculoControlador.listar(a.peticion("/v", "GET", undefined, await a.cookieDe("profesor.prueba@ucab.edu.ve"))));
    assert.deepEqual([suyos.vehiculos.length, ajenos.vehiculos.length], [1, 0]);
  });
});

describe("HU 3.1 y 4.1 · Avisos de entrada y salida y aforo", () => {
  test("CA1 y CA2: una entrada resta un libre, una salida lo devuelve, y cada una queda con su hora", async () => {
    const antes = (await estacionamiento("est-labs")).libres;
    await aviso("est-labs", "ENTRADA");
    assert.equal((await estacionamiento("est-labs")).libres, antes - 1);
    await aviso("est-labs", "SALIDA");
    assert.equal((await estacionamiento("est-labs")).libres, antes);
    const [ultimo, primero] = await f.servicios.aforoServicio.ultimosMovimientos();
    assert.deepEqual([primero.tipo, ultimo.tipo], ["ENTRADA", "SALIDA"]);
    assert.ok(!Number.isNaN(Date.parse(ultimo.hora)));
  });

  test("CA5 (RN4): un aviso de un estacionamiento que no existe no cambia nada y queda rechazado con la hora", async () => {
    assert.equal((await aviso("est-no-existe", "ENTRADA")).status, 404);
    const [rechazo] = await f.servicios.aforoServicio.ultimosRechazos();
    assert.equal(rechazo.motivo, "no_existe");
    assert.equal((await f.servicios.aforoServicio.ultimosMovimientos()).length, 0);
  });

  test("CA3 y CA4 (RN3): un aviso que rompería los límites no cambia el aforo y queda como anomalía", async () => {
    await f.servicios.estacionamientoServicio.cambiar("est-labs", { capacidad: 10 }); // hay más carros que puestos
    assert.equal((await aviso("est-labs", "ENTRADA")).status, 409);
    assert.equal((await f.servicios.aforoServicio.ultimosRechazos())[0].motivo, "lleno");
  });

  test("táctica: con 3 avisos defectuosos seguidos el sistema sigue funcionando y el sensor queda marcado con falla", async () => {
    await f.servicios.estacionamientoServicio.cambiar("est-labs", { capacidad: 10 });
    for (let i = 0; i < 3; i++) await aviso("est-labs", "ENTRADA");
    assert.equal((await aviso("est-playa", "ENTRADA")).status, 200); // los demás siguen
    const { sensores } = await json(await f.avisoControlador.listar(a.peticion("/a", "GET", undefined, await a.cookieDe())));
    assert.deepEqual(sensores.conFalla, ["est-labs"]);
  });
});

describe("HU 3.2 · Lector de placas", () => {
  test("CA: la placa leída queda guardada normalizada, con sentido y hora, y no sale por el canal en vivo", async () => {
    const recibidos = [];
    const salir = f.servicios.eventos.suscribir((m) => recibidos.push(m));
    const r = await json(await f.garitaControlador.recibir(a.peticion("/g", "POST", { placa: "ab-123 cd", sentido: "salida" }, CLAVE_SENSOR)));
    salir();
    assert.deepEqual([r.lectura.placa, r.lectura.sentido], ["AB123CD", "SALIDA"]);
    assert.equal(JSON.stringify(recibidos).includes("AB123CD"), false);
  });
});

describe("HU 4.2 · Semáforo de ocupación", () => {
  test("CA: lleno → rojo con «No hay puesto»; con un libre → verde «Hay puesto» (D-009)", async () => {
    await f.servicios.estacionamientoServicio.cambiar("est-labs", { capacidad: 38 });
    assert.deepEqual((await estacionamiento("est-labs")).semaforo, { nivel: "no-hay", texto: "No hay puesto" });
    await aviso("est-labs", "SALIDA");
    assert.deepEqual((await estacionamiento("est-labs")).semaforo, { nivel: "hay", texto: "Hay puesto" });
  });
});

describe("HU 5.1 · Estacionamientos en el mapa del campus", () => {
  test("CA: la maqueta del front (front/public/maqueta/maqueta.json) dibuja exactamente los estacionamientos del catálogo", () => {
    const maqueta = JSON.parse(readFileSync(new URL("../../../front/public/maqueta/maqueta.json", import.meta.url), "utf8"));
    assert.deepEqual(maqueta.estacionamientos.map((e) => e.id).sort(), ESTACIONAMIENTOS.map((e) => e.id).sort());
  });

  test("CA: la API entrega cada estacionamiento con su polígono para dibujarlo", async () => {
    const { estacionamientos } = await json(await f.estacionamientoControlador.listar());
    assert.ok(estacionamientos.length > 0 && estacionamientos.every((e) => e.poligono.length >= 3));
  });
});

describe("HU 5.4 · Modificar la capacidad y el estado", () => {
  test("RN: si la capacidad baja por debajo de los ocupados: 0 libres, rojo y no entra nadie más", async () => {
    const c = await a.cookieDe();
    const { estacionamiento: e } = await json(await f.estacionamientoControlador.cambiar(a.peticion("/x", "PATCH", { capacidad: 10 }, c), a.conId("est-labs")));
    assert.deepEqual([e.libres, e.semaforo.nivel, e.activo], [0, "no-hay", true]);
    assert.equal((await aviso("est-labs", "ENTRADA")).status, 409);
  });

  test("RN: un estacionamiento cerrado sale gris y no se sugiere", async () => {
    const c = await a.cookieDe();
    await f.estacionamientoControlador.cambiar(a.peticion("/x", "PATCH", { activo: false }, c), a.conId("est-labs"));
    assert.equal((await estacionamiento("est-labs")).semaforo.nivel, "cerrado");
  });
});

describe("HU 6.1 · Catálogo de edificios", () => {
  test("CA: lo que agrega el administrador es lo que ve el usuario", async () => {
    await f.edificioControlador.agregar(a.peticion("/e", "POST", { nombre: "Módulo 1" }, await a.cookieDe()));
    const { edificios } = await json(await f.edificioControlador.listar());
    assert.ok(edificios.some((e) => e.nombre === "Módulo 1"));
  });
});

describe("HU 7.2 · Sugerir el estacionamiento libre más cercano", () => {
  test("CA: sugiere un estacionamiento abierto con puestos libres y su distancia", async () => {
    const r = await json(await f.sugerenciaControlador.sugerir(a.peticion("/api/sugerencia?edificio=edif-aulas")));
    assert.ok(r.sugerido.libres > 0 && r.sugerido.distancia >= 0);
  });
});

describe("HU 9.1 · Crear una incidencia", () => {
  test("CA1: queda registrada como pendiente con fecha y hora", async () => {
    const r = await json(await f.incidenciaControlador.crear(a.peticion("/i", "POST", { estacionamientoId: "est-playa", tipo: "bateria_descargada" }, await a.cookieDe())));
    assert.deepEqual([r.estado, r.incidencia.estado], [201, "pendiente"]);
    assert.ok(!Number.isNaN(Date.parse(r.incidencia.reportadaEn)));
  });

  test("CA3: en un estacionamiento cerrado no se puede reportar", async () => {
    await f.servicios.estacionamientoServicio.cambiar("est-labs", { activo: false });
    const r = await f.incidenciaControlador.crear(a.peticion("/i", "POST", { estacionamientoId: "est-labs", tipo: "conos_atravesados" }, await a.cookieDe()));
    assert.equal(r.status, 409);
  });

  test("RN4 (precondición): sin sesión no se registra", async () => {
    assert.equal((await f.incidenciaControlador.crear(a.peticion("/i", "POST", { estacionamientoId: "est-playa", tipo: "conos_atravesados" }))).status, 401);
  });
});
