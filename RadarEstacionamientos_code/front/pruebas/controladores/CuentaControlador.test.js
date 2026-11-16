// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Prueba el control de Crear cuenta, Entrar y Salir
// Pruebas del controlador CuentaControlador (front). Se corren con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { CuentaControlador } from "../../controladores/CuentaControlador.js";
import { NavegadorDePrueba, ServicioDePrueba, formulario } from "./ayuda.js";

const datos = { correo: "ana.perez@est.ucab.edu.ve", contrasena: "clave1234", confirmacion: "clave1234" };
const armar = (respuestas) => {
  const servicio = new ServicioDePrueba(respuestas);
  const navegador = new NavegadorDePrueba();
  return { servicio, navegador, controlador: new CuentaControlador({ servicio, navegador }) };
};

test("CA1: con datos válidos crea la cuenta (sin mandar la confirmación) y redirige al mapa", async () => {
  const { servicio, navegador, controlador } = armar({ crear: { ok: true } });
  await controlador.registrarse(formulario(datos));
  assert.deepEqual({ ...servicio.llamadas[0].argumentos[0] }, { correo: datos.correo, contrasena: datos.contrasena });
  assert.deepEqual(navegador.rutas, ["/mapa"]);
});

test("si el validador encuentra un error no llama al back y conserva el correo escrito", async () => {
  const { servicio, controlador } = armar({ crear: { ok: true } });
  const r = await controlador.registrarse({ ...datos, confirmacion: "otra" });
  assert.equal(r.interfaz, "MensajeDatosNoValidos");
  assert.equal(r.error, "Las contraseñas no coinciden");
  assert.equal(r.correo, datos.correo);
  assert.equal(servicio.llamadas.length, 0);
});

test("muestra el error del back (cuenta repetida, contraseña equivocada)", async () => {
  const { controlador } = armar({ entrar: { ok: false, error: "Correo o contraseña incorrectos." } });
  const r = await controlador.entrar({ correo: datos.correo, contrasena: "mala" });
  assert.equal(r.error, "Correo o contraseña incorrectos.");
});

test("Salir cierra la sesión y lleva a /entrar", async () => {
  const { servicio, navegador, controlador } = armar({ salir: { ok: true } });
  await controlador.salir();
  assert.equal(servicio.llamadas[0].metodo, "salir");
  assert.deepEqual(navegador.rutas, ["/entrar"]);
});
