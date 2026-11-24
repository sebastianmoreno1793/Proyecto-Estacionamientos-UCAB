// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Prueba adónde se redirige según la sesión y el rol
// Pruebas de NavegacionControlador, SesionUsuario y ClienteHttp (front). Se corren con: npm test
import { afterEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { NavegacionControlador } from "../../controladores/NavegacionControlador.js";
import { SesionUsuario } from "../../modelos/SesionUsuario.js";
import { ClienteHttp } from "../../servicios/ClienteHttp.js";

const fetchOriginal = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

// Hace que fetch responda como el back a GET /api/sesion.
function sesionDelBack(usuario, recibidas = []) {
  globalThis.fetch = async (url, opciones) => {
    recibidas.push({ url, opciones });
    return usuario ? Response.json({ usuario }) : Response.json({ error: "No has iniciado sesión." }, { status: 401 });
  };
}

describe("NavegacionControlador.redirigeA", () => {
  const navegacion = () => new NavegacionControlador({ base: "http://localhost:3000", cookie: "radar_sesion=abc" });

  test("sin sesión: las pantallas mandan a /entrar; /entrar y /registro se pueden ver", async () => {
    sesionDelBack(null);
    assert.equal(await navegacion().redirigeA("/mapa"), "/entrar");
    assert.equal(await navegacion().redirigeA("/entrar"), null);
  });

  test("con sesión: /entrar manda al Inicio y /admin solo para el administrador", async () => {
    const recibidas = [];
    sesionDelBack({ correo: "ana@est.ucab.edu.ve", rol: "estudiante" }, recibidas);
    assert.equal(await navegacion().redirigeA("/entrar"), "/");
    assert.equal(await navegacion().redirigeA("/admin/puestos"), "/perfil");
    assert.equal(await navegacion().redirigeA("/reportar"), null);
    assert.equal(recibidas[0].url, "http://localhost:3000/api/sesion");
    assert.equal(recibidas[0].opciones.headers.cookie, "radar_sesion=abc");
    sesionDelBack({ correo: "admin.prueba@ucab.edu.ve", rol: "administrador" });
    assert.equal(await navegacion().redirigeA("/admin/puestos"), null);
  });
});

describe("SesionUsuario y ClienteHttp", () => {
  test("iniciales del perfil y rol de administrador", () => {
    assert.equal(new SesionUsuario({ correo: "sebastian.moreno@est.ucab.edu.ve", rol: "estudiante" }).iniciales(), "SM");
    assert.equal(new SesionUsuario({ correo: "admin.prueba@ucab.edu.ve", rol: "administrador" }).iniciales(), "AP");
    assert.equal(new SesionUsuario({ correo: "ana@ucab.edu.ve", rol: "profesor" }).iniciales(), "AN");
    assert.equal(new SesionUsuario({ correo: "x@ucab.edu.ve", rol: "administrador" }).esAdministrador(), true);
  });

  test("ClienteHttp manda JSON y devuelve { ok, estado, datos, error } sin lanzar", async () => {
    globalThis.fetch = async (_url, opciones) => Response.json({ error: "Ese edificio no existe.", recibido: JSON.parse(opciones.body) }, { status: 404 });
    const r = await new ClienteHttp().post("/api/x", { a: 1 });
    assert.deepEqual([r.ok, r.estado, r.error, r.datos.recibido], [false, 404, "Ese edificio no existe.", { a: 1 }]);
  });

  test("sin conexión responde estado 0 con un mensaje para la persona", async () => {
    globalThis.fetch = async () => {
      throw new TypeError("fetch failed");
    };
    const r = await new ClienteHttp().get("/api/x");
    assert.equal(r.estado, 0);
    assert.match(r.error, /conexión/);
  });
});
