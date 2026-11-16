// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Prueba la precondición: sesión y rol
// Pruebas de unidad de la táctica ControlDeAcceso. Se corren con: npm test
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { AlmacenEnMemoria } from "../../basedatos/AlmacenEnMemoria.js";
import { Fabrica } from "../../Fabrica.js";
import { ControlDeAcceso } from "../../tacticas/ControlDeAcceso.js";

let fabrica;
beforeEach(() => {
  AlmacenEnMemoria.reiniciarTodo();
  fabrica = new Fabrica();
});

const conCookie = (cookie) => new Request("http://x/", { headers: cookie ? { cookie } : {} });

test("lee el código de la cookie radar_sesion entre otras cookies", () => {
  assert.equal(ControlDeAcceso.codigoDe(conCookie("a=1; radar_sesion=abc; b=2")), "abc");
  assert.equal(ControlDeAcceso.codigoDe(conCookie()), undefined);
});

test("sin sesión no hay usuario; con sesión, el dueño de la sesión", async () => {
  const { cuentaServicio } = fabrica.servicios;
  const { controlDeAcceso } = fabrica.tacticas;
  assert.equal(await controlDeAcceso.usuarioDe(conCookie("radar_sesion=inventado")), null);
  const admin = await cuentaServicio.buscarPorCorreo("admin.prueba@ucab.edu.ve");
  const codigo = await cuentaServicio.abrirSesion(admin);
  const usuario = await controlDeAcceso.usuarioDe(conCookie(`radar_sesion=${codigo}`));
  assert.equal(usuario.correo, "admin.prueba@ucab.edu.ve");
  assert.equal(controlDeAcceso.esAdministrador(usuario), true);
  assert.equal(controlDeAcceso.esAdministrador(null), false);
});
