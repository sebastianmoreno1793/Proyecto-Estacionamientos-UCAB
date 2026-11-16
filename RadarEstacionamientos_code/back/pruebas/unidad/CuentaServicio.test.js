// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Prueba crear cuenta, entrar, la sesión y las cuentas de prueba
// Pruebas de unidad del servicio CuentaServicio. Se corren con: npm test
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../basedatos/AlmacenEnMemoria.js";
import { USUARIOS_DE_PRUEBA } from "../../basedatos/datos_iniciales/usuarios_de_prueba.js";
import { Fabrica } from "../../Fabrica.js";

let cuentas;
const datos = { correo: "ana.perez@est.ucab.edu.ve", contrasena: "clave1234" };

beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  cuentas = new Fabrica().servicios.cuentaServicio;
});

test("quien usa un correo UCAB crea su cuenta (rol según el dominio) y puede entrar", async () => {
  const usuario = await cuentas.registrar(datos);
  assert.deepEqual([usuario.correo, usuario.rol], ["ana.perez@est.ucab.edu.ve", "estudiante"]);
  assert.equal((await cuentas.comprobar(datos)).correo, datos.correo);
});

test("no se crea dos veces la misma cuenta, aunque cambien mayúsculas o espacios (paso 10.1)", async () => {
  await cuentas.registrar(datos);
  await assert.rejects(cuentas.registrar({ ...datos, correo: "  ANA.PEREZ@EST.UCAB.EDU.VE " }), {
    message: "Ya existe una cuenta con ese correo. Inicia sesión",
  });
});

test("con un correo que no es UCAB no se crea la cuenta (D-003)", async () => {
  await assert.rejects(cuentas.registrar({ ...datos, correo: "ana@gmail.com" }), { motivo: "solo_ucab" });
});

test("con la contraseña equivocada no entra", async () => {
  await cuentas.registrar(datos);
  await assert.rejects(cuentas.comprobar({ ...datos, contrasena: "equivocada" }), { message: "Correo o contraseña incorrectos." });
});

test("la sesión recuerda quién entró y se cierra al salir", async () => {
  const usuario = await cuentas.registrar(datos);
  const codigo = await cuentas.abrirSesion(usuario);
  assert.equal((await cuentas.usuarioDeLaSesion(codigo)).correo, datos.correo);
  await cuentas.cerrarSesion(codigo);
  assert.equal(await cuentas.usuarioDeLaSesion(codigo), null);
  assert.equal(await cuentas.usuarioDeLaSesion("codigo-inventado"), null);
});

test("en desarrollo hay una cuenta de prueba por rol: administrador, estudiante y profesor", async () => {
  const roles = [];
  for (const cuenta of USUARIOS_DE_PRUEBA) roles.push((await cuentas.comprobar(cuenta)).rol);
  assert.deepEqual(roles, ["administrador", "estudiante", "profesor"]);
});
