// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Prueba /api/cuenta y /api/sesion (cookie)
// @HU-2.1 Registrar mis vehículos · Samuel — Prueba /api/vehiculos
// @HU-3.1 Recibir avisos de entrada y salida · Aaron — Prueba POST y GET /api/avisos
// @HU-3.2 Simular sensores y placas · Aaron — Prueba /api/garita/lecturas
// @HU-4.1 Actualizar el aforo con cada entrada o salida · Aaron — Prueba los códigos de los avisos rechazados
// @HU-4.2 Consultar el semáforo de ocupación · Aaron — Prueba GET /api/estacionamientos
// @HU-5.4 Modificar la capacidad y el estado de un estacionamiento · Sebastian — Prueba PATCH /api/estacionamientos/:id
// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Prueba /api/edificios
// @HU-7.2 Sugerir el estacionamiento libre más cercano · Manuel — Prueba GET /api/sugerencia
// @HU-9.1 Crear una incidencia · Sebastian — Prueba GET y POST /api/incidencias
// Pruebas de integración: controlador + servicio + repositorio, con el código HTTP que vería Postman
// o el simulador (las mismas URL y la clave x-clave-sensor). Se corren con: npm test
import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { Ayuda, CLAVE_SENSOR } from "./ayuda.js";

let a;
let f;
beforeEach(() => {
  a = new Ayuda();
  f = a.fabrica;
});

describe("POST y GET /api/avisos (HU 3.1 y 4.1)", () => {
  const aviso = (cuerpo, encabezados = CLAVE_SENSOR) => f.avisoControlador.recibir(a.peticion("/api/avisos", "POST", cuerpo, encabezados));

  test("sin la clave del sensor responde 401", async () => {
    assert.equal((await aviso({ estacionamientoId: "est-playa", tipo: "ENTRADA" }, {})).status, 401);
  });

  test("con un cuerpo que no es objeto responde 400", async () => {
    assert.equal((await aviso([])).status, 400);
  });

  test("tipo desconocido 400, estacionamiento que no existe 404, lleno 409", async () => {
    assert.equal((await aviso({ estacionamientoId: "est-playa", tipo: "X" })).status, 400);
    assert.equal((await aviso({ estacionamientoId: "zzz", tipo: "ENTRADA" })).status, 404);
    await f.servicios.estacionamientoServicio.cambiar("est-labs", { capacidad: 1 });
    const r = await aviso({ estacionamientoId: "est-labs", tipo: "ENTRADA" });
    assert.equal(r.status, 409);
    assert.equal((await r.json()).motivo, "lleno");
  });

  test("una entrada válida responde 200 con el movimiento (idAviso como texto) y el estacionamiento con su semáforo", async () => {
    const r = await aviso({ estacionamientoId: "est-playa", tipo: "ENTRADA", idAviso: 7 });
    assert.equal(r.status, 200);
    const { movimiento, estacionamiento } = await r.json();
    assert.deepEqual([movimiento.estacionamientoId, movimiento.tipo, movimiento.idAviso], ["est-playa", "ENTRADA", "7"]);
    assert.ok(movimiento.hora);
    assert.equal(estacionamiento.semaforo.nivel, "hay");
  });

  test("GET (Administrar › Garita) solo para el administrador, con el estado de los sensores", async () => {
    assert.equal((await f.avisoControlador.listar(a.peticion("/api/avisos"))).status, 401);
    assert.equal((await f.avisoControlador.listar(a.peticion("/api/avisos", "GET", undefined, await a.cookieDe("estudiante.prueba@est.ucab.edu.ve")))).status, 403);
    await aviso({ estacionamientoId: "est-playa", tipo: "ENTRADA" });
    const r = await f.avisoControlador.listar(a.peticion("/api/avisos", "GET", undefined, await a.cookieDe()));
    const datos = await r.json();
    assert.equal(datos.movimientos.length, 1);
    assert.deepEqual(Object.keys(datos.sensores).sort(), ["conFalla", "limiteDeAnomalias", "sinAviso", "tiempoLimiteMinutos"]);
  });
});

describe("GET y PATCH /api/estacionamientos (HU 4.2 y 5.4)", () => {
  const cambiar = async (id, cuerpo, encabezados) => f.estacionamientoControlador.cambiar(a.peticion("/x", "PATCH", cuerpo, encabezados), a.conId(id));

  test("GET responde 200 con los estacionamientos, sus libres, su semáforo y su forma", async () => {
    const r = await f.estacionamientoControlador.listar(a.peticion("/api/estacionamientos"));
    const { estacionamientos } = await r.json();
    assert.equal(r.status, 200);
    assert.ok(estacionamientos.every((e) => typeof e.libres === "number" && e.semaforo && e.poligono));
  });

  test("PATCH sin sesión de administrador responde 403 (también para un estudiante)", async () => {
    assert.equal((await cambiar("est-labs", { activo: false })).status, 403);
    assert.equal((await cambiar("est-labs", { activo: false }, await a.cookieDe("estudiante.prueba@est.ucab.edu.ve"))).status, 403);
  });

  test("PATCH a uno que no existe responde 404 y con un cuerpo que no es JSON 400", async () => {
    const c = await a.cookieDe();
    assert.equal((await cambiar("nope", {}, c)).status, 404);
    assert.equal((await cambiar("est-labs", "no es json", c)).status, 400);
  });

  test("PATCH válido cierra el estacionamiento y responde 200", async () => {
    const r = await cambiar("est-labs", { activo: false }, await a.cookieDe());
    assert.equal(r.status, 200);
    assert.equal((await r.json()).estacionamiento.activo, false);
  });
});

describe("POST y GET /api/garita/lecturas (HU 3.2)", () => {
  test("una lectura válida responde 200 con la placa normalizada; sin clave 401", async () => {
    const r = await f.garitaControlador.recibir(a.peticion("/g", "POST", { placa: "ab-123 cd", sentido: "entrada", idLectura: "L1" }, CLAVE_SENSOR));
    assert.equal(r.status, 200);
    assert.equal((await r.json()).lectura.placa, "AB123CD");
    assert.equal((await f.garitaControlador.recibir(a.peticion("/g", "POST", { placa: "AB123CD", sentido: "ENTRADA" }))).status, 401);
  });

  test("un sentido que no es ENTRADA ni SALIDA responde 400", async () => {
    assert.equal((await f.garitaControlador.recibir(a.peticion("/g", "POST", { placa: "AB123CD", sentido: "ARRIBA" }, CLAVE_SENSOR))).status, 400);
  });

  test("GET solo para el administrador: las placas son datos personales", async () => {
    assert.equal((await f.garitaControlador.listar(a.peticion("/g", "GET", undefined, await a.cookieDe("profesor.prueba@ucab.edu.ve")))).status, 403);
    assert.equal((await f.garitaControlador.listar(a.peticion("/g", "GET", undefined, await a.cookieDe()))).status, 200);
  });
});

describe("GET y POST /api/incidencias (HU 9.1)", () => {
  test("sin sesión responde 401", async () => {
    assert.equal((await f.incidenciaControlador.listar(a.peticion("/i"))).status, 401);
    assert.equal((await f.incidenciaControlador.crear(a.peticion("/i", "POST", { estacionamientoId: "est-playa", tipo: "conos_atravesados" }))).status, 401);
  });

  test("con sesión crea la incidencia (201) y aparece en la lista, junto con los tipos", async () => {
    const c = await a.cookieDe();
    const r = await f.incidenciaControlador.crear(a.peticion("/i", "POST", { estacionamientoId: "est-playa", tipo: "conos_atravesados" }, c));
    assert.equal(r.status, 201);
    const datos = await (await f.incidenciaControlador.listar(a.peticion("/i", "GET", undefined, c))).json();
    assert.ok(datos.incidencias.some((i) => i.estacionamientoId === "est-playa" && i.estado === "pendiente"));
    assert.equal(datos.tipos.length, 3);
  });

  test("en un estacionamiento cerrado responde 409 y en uno que no existe 404", async () => {
    const c = await a.cookieDe();
    await f.servicios.estacionamientoServicio.cambiar("est-labs", { activo: false });
    assert.equal((await f.incidenciaControlador.crear(a.peticion("/i", "POST", { estacionamientoId: "est-labs", tipo: "conos_atravesados" }, c))).status, 409);
    assert.equal((await f.incidenciaControlador.crear(a.peticion("/i", "POST", { estacionamientoId: "zzz", tipo: "conos_atravesados" }, c))).status, 404);
  });
});

describe("/api/cuenta y /api/sesion (HU 1.1)", () => {
  const cuenta = { correo: "ana.perez@est.ucab.edu.ve", contrasena: "clave1234" };

  test("crear cuenta responde 201 con el usuario (sin contraseña) y la cookie httpOnly", async () => {
    const r = await f.cuentaControlador.crearCuenta(a.peticion("/api/cuenta", "POST", cuenta));
    assert.equal(r.status, 201);
    assert.deepEqual(await r.json(), { usuario: { correo: cuenta.correo, rol: "estudiante" } });
    assert.match(r.headers.get("set-cookie"), /radar_sesion=.+; Path=\/; HttpOnly; SameSite=Lax/);
  });

  test("la misma cuenta dos veces responde 409; un correo que no es UCAB 400", async () => {
    await f.cuentaControlador.crearCuenta(a.peticion("/api/cuenta", "POST", cuenta));
    assert.equal((await f.cuentaControlador.crearCuenta(a.peticion("/api/cuenta", "POST", cuenta))).status, 409);
    assert.equal((await f.cuentaControlador.crearCuenta(a.peticion("/api/cuenta", "POST", { ...cuenta, correo: "ana@gmail.com" }))).status, 400);
  });

  test("entrar con la contraseña equivocada responde 401", async () => {
    const r = await f.cuentaControlador.entrar(a.peticion("/api/sesion", "POST", { correo: "admin.prueba@ucab.edu.ve", contrasena: "mal" }));
    assert.equal(r.status, 401);
  });

  test("GET /api/sesion dice quién está conectado; al salir (DELETE) deja de estarlo", async () => {
    const c = await a.cookieDe();
    const r = await f.cuentaControlador.sesionActual(a.peticion("/api/sesion", "GET", undefined, c));
    assert.equal((await r.json()).usuario.rol, "administrador");
    const salida = await f.cuentaControlador.salir(a.peticion("/api/sesion", "DELETE", undefined, c));
    assert.match(salida.headers.get("set-cookie"), /Max-Age=0/);
    assert.equal((await f.cuentaControlador.sesionActual(a.peticion("/api/sesion", "GET", undefined, c))).status, 401);
  });
});

describe("/api/vehiculos (HU 2.1)", () => {
  test("sin sesión 401; con sesión registra (201), no repite placa (409) y lista los suyos", async () => {
    const carro = { placa: "AB123CD", marca: "Toyota", modelo: "Corolla", color: "Gris" };
    assert.equal((await f.vehiculoControlador.registrar(a.peticion("/v", "POST", carro))).status, 401);
    const c = await a.cookieDe("estudiante.prueba@est.ucab.edu.ve");
    assert.equal((await f.vehiculoControlador.registrar(a.peticion("/v", "POST", carro, c))).status, 201);
    assert.equal((await f.vehiculoControlador.registrar(a.peticion("/v", "POST", carro, await a.cookieDe()))).status, 409);
    const { vehiculos } = await (await f.vehiculoControlador.listar(a.peticion("/v", "GET", undefined, c))).json();
    assert.deepEqual(vehiculos.map((v) => v.placa), ["AB123CD"]);
  });
});

describe("/api/edificios (HU 6.1)", () => {
  test("cualquiera ve el catálogo; solo el administrador agrega (201), modifica y quita", async () => {
    assert.equal((await f.edificioControlador.listar()).status, 200);
    const nuevo = { nombre: "Módulo 1", ubicacion: [10.4642, -66.9762] };
    assert.equal((await f.edificioControlador.agregar(a.peticion("/e", "POST", nuevo))).status, 403);
    const c = await a.cookieDe();
    assert.equal((await f.edificioControlador.agregar(a.peticion("/e", "POST", nuevo, c))).status, 201);
    assert.equal((await f.edificioControlador.agregar(a.peticion("/e", "POST", nuevo, c))).status, 409);
    assert.equal((await f.edificioControlador.modificar(a.peticion("/e", "PATCH", { nombre: "Módulo Uno" }, c), a.conId("edif-modulo-1"))).status, 200);
    assert.equal((await f.edificioControlador.quitar(a.peticion("/e", "DELETE", undefined, c), a.conId("edif-modulo-1"))).status, 200);
    assert.equal((await f.edificioControlador.quitar(a.peticion("/e", "DELETE", undefined, c), a.conId("edif-modulo-1"))).status, 404);
  });
});

describe("GET /api/sugerencia (HU 7.2)", () => {
  test("con un edificio que existe responde 200 con el sugerido; si no existe, 404", async () => {
    const r = await f.sugerenciaControlador.sugerir(a.peticion("/api/sugerencia?edificio=edif-aulas"));
    assert.equal(r.status, 200);
    assert.ok((await r.json()).sugerido);
    assert.equal((await f.sugerenciaControlador.sugerir(a.peticion("/api/sugerencia?edificio=x"))).status, 404);
  });
});

describe("POST /api/pruebas/reiniciar", () => {
  test("solo el administrador; vuelve a los datos de ejemplo y conserva la sesión", async () => {
    assert.equal((await f.pruebasControlador.reiniciar(a.peticion("/r", "POST"))).status, 403);
    const c = await a.cookieDe();
    await f.servicios.estacionamientoServicio.cambiar("est-labs", { activo: false });
    const r = await f.pruebasControlador.reiniciar(a.peticion("/r", "POST", undefined, c));
    assert.equal(r.status, 200);
    assert.ok((await r.json()).estacionamientos.find((e) => e.id === "est-labs").activo);
    assert.equal((await f.cuentaControlador.sesionActual(a.peticion("/s", "GET", undefined, c))).status, 200);
  });
});
