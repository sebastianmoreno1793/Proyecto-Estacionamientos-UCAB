// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Prueba el rol según el dominio y la contraseña cifrada
// Pruebas de unidad de los modelos Usuario y Sesion. Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { Sesion } from "../../modelos/Sesion.js";
import { Usuario } from "../../modelos/Usuario.js";

test("el rol sale del dominio", () => {
  assert.equal(Usuario.rolSegunCorreo("ana@est.ucab.edu.ve"), "estudiante");
  assert.equal(Usuario.rolSegunCorreo("  JOSE@UCAB.EDU.VE "), "profesor");
  assert.equal(Usuario.rolSegunCorreo("ana@gmail.com"), null);
  assert.equal(Usuario.rolSegunCorreo("ana@otro.ucab.edu.ve"), null);
});

test("REGLA (D-003): sin rol de la comunidad UCAB no hay cuenta", () => {
  assert.throws(() => Usuario.crear({ correo: "ana@gmail.com", contrasena: "clave1234" }), {
    message: "Solo puede entrar la comunidad UCAB. Usa tu correo institucional",
  });
});

test("guarda el correo en minúsculas y nunca la contraseña tal cual", () => {
  const u = Usuario.crear({ correo: " Ana.Perez@EST.UCAB.EDU.VE ", contrasena: "clave1234" });
  assert.equal(u.correo, "ana.perez@est.ucab.edu.ve");
  assert.equal(JSON.stringify(u.aRegistro()).includes("clave1234"), false);
  assert.equal(u.contrasenaCorrecta("clave1234"), true);
  assert.equal(u.contrasenaCorrecta("otra"), false);
});

test("el administrador se asigna a mano y se reconoce", () => {
  assert.equal(Usuario.crear({ correo: "a@ucab.edu.ve", contrasena: "x", rol: "administrador" }).esAdministrador(), true);
  assert.equal(Usuario.crear({ correo: "a@ucab.edu.ve", contrasena: "x" }).esAdministrador(), false);
});

test("cada sesión tiene un código distinto", () => {
  assert.notEqual(Sesion.abrir("a@ucab.edu.ve").codigo, Sesion.abrir("a@ucab.edu.ve").codigo);
});
