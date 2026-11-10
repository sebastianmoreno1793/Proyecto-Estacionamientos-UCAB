// @HU-1.1 Crear cuenta con el correo institucional · Samuel — pruebas de la HU
// HU 1.1 Crear cuenta con el correo institucional.
// Se corre con: npm test

import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { MENSAJE_SOLO_UCAB, esCorreoUcab, rolSegunCorreo } from "../logica/usuarios/reglas.js";
import {
  USUARIOS_DE_PRUEBA,
  USUARIO_DE_PRUEBA,
  comprobarCredenciales,
  crearSesion,
  registrarUsuario,
  reiniciarUsuarios,
  usuarioDeLaSesion,
} from "../logica/usuarios/datos.js";

describe("correo institucional", () => {
  test("acepta @est.ucab.edu.ve y @ucab.edu.ve", () => {
    assert.equal(esCorreoUcab("ana.perez@est.ucab.edu.ve"), true);
    assert.equal(esCorreoUcab("jose.gomez@ucab.edu.ve"), true);
    assert.equal(esCorreoUcab("  Ana.Perez@EST.UCAB.EDU.VE "), true);
  });

  test("rechaza cualquier otro correo", () => {
    assert.equal(esCorreoUcab("ana@gmail.com"), false);
    assert.equal(esCorreoUcab("ana@ucab.edu.ve.com"), false);
    assert.equal(esCorreoUcab("ana@otro.ucab.edu.ve"), false);
    assert.equal(esCorreoUcab("@ucab.edu.ve"), false);
    assert.equal(esCorreoUcab(""), false);
  });

  test("el rol sale del dominio", () => {
    assert.equal(rolSegunCorreo("ana@est.ucab.edu.ve"), "estudiante");
    assert.equal(rolSegunCorreo("jose@ucab.edu.ve"), "profesor");
    assert.equal(rolSegunCorreo("ana@gmail.com"), null);
  });
});

describe("crear cuenta y entrar", () => {
  beforeEach(() => reiniciarUsuarios());

  const datos = { correo: "ana.perez@est.ucab.edu.ve", contrasena: "clave1234", confirmacion: "clave1234" };

  test("quien usa un correo UCAB crea su cuenta y puede entrar", async () => {
    const { usuario } = await registrarUsuario(datos);
    assert.deepEqual(usuario, { correo: "ana.perez@est.ucab.edu.ve", rol: "estudiante" });

    const entrada = await comprobarCredenciales({ correo: datos.correo, contrasena: "clave1234" });
    assert.equal(entrada.usuario.correo, "ana.perez@est.ucab.edu.ve");
  });

  test("con otro correo no lo deja entrar y le explica por qué", async () => {
    const registro = await registrarUsuario({ ...datos, correo: "ana@gmail.com" });
    assert.equal(registro.error, MENSAJE_SOLO_UCAB);

    const entrada = await comprobarCredenciales({ correo: "ana@gmail.com", contrasena: "clave1234" });
    assert.equal(entrada.error, MENSAJE_SOLO_UCAB);
  });

  test("no se crea dos veces la misma cuenta", async () => {
    await registrarUsuario(datos);
    const repetida = await registrarUsuario({ ...datos, correo: "ANA.PEREZ@est.ucab.edu.ve" });
    assert.ok(repetida.error);
  });

  test("pide contraseña de 8 caracteres y que coincida", async () => {
    assert.ok((await registrarUsuario({ ...datos, contrasena: "corta", confirmacion: "corta" })).error);
    assert.ok((await registrarUsuario({ ...datos, confirmacion: "otraclave" })).error);
  });

  test("con la contraseña equivocada no entra", async () => {
    await registrarUsuario(datos);
    const entrada = await comprobarCredenciales({ correo: datos.correo, contrasena: "equivocada" });
    assert.equal(entrada.error, "Correo o contraseña incorrectos.");
  });

  test("no guarda la contraseña tal cual", async () => {
    await registrarUsuario(datos);
    const guardado = globalThis.__radarUsuarios.usuarios.find((u) => u.correo === datos.correo);
    assert.equal(JSON.stringify(guardado).includes("clave1234"), false);
  });

  test("la sesión recuerda quién entró", async () => {
    await registrarUsuario(datos);
    const token = await crearSesion(datos.correo);
    assert.deepEqual(await usuarioDeLaSesion(token), { correo: datos.correo, rol: "estudiante" });
    assert.equal(await usuarioDeLaSesion("codigo-inventado"), null);
  });

  test("en desarrollo existe el usuario de prueba administrador", async () => {
    const entrada = await comprobarCredenciales(USUARIO_DE_PRUEBA);
    assert.equal(entrada.usuario.rol, "administrador");
  });

  test("en desarrollo hay una cuenta de prueba por rol: administrador, estudiante y profesor", async () => {
    const roles = [];
    for (const cuenta of USUARIOS_DE_PRUEBA) {
      const entrada = await comprobarCredenciales(cuenta);
      roles.push(entrada.usuario.rol);
    }
    assert.deepEqual(roles, ["administrador", "estudiante", "profesor"]);
    // Estudiante y profesor siguen la regla del dominio (HU 1.1); el administrador se asigna a mano.
    assert.equal(rolSegunCorreo(USUARIOS_DE_PRUEBA[1].correo), "estudiante");
    assert.equal(rolSegunCorreo(USUARIOS_DE_PRUEBA[2].correo), "profesor");
  });
});
