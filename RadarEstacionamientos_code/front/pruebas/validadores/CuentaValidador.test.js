// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Prueba la validación de Crear cuenta y Entrar, con los mensajes del escenario
// Pruebas del validador CuentaValidador (las validaciones están solo en el front). Se corren con: npm test
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { CuentaValidador } from "../../validadores/CuentaValidador.js";

const registro = new CuentaValidador("registro");
const datos = { correo: "ana.perez@est.ucab.edu.ve", contrasena: "clave1234", confirmacion: "clave1234" };
const error = (cambios) => registro.validar({ ...datos, ...cambios }).error;

describe("correo institucional", () => {
  test("acepta @est.ucab.edu.ve y @ucab.edu.ve, con mayúsculas o espacios", () => {
    for (const correo of ["ana.perez@est.ucab.edu.ve", "jose.gomez@ucab.edu.ve", "  Ana.Perez@EST.UCAB.EDU.VE "]) {
      assert.equal(CuentaValidador.esCorreoUcab(correo), true, correo);
    }
  });

  test("rechaza cualquier otro correo", () => {
    for (const correo of ["ana@gmail.com", "ana@ucab.edu.ve.com", "ana@otro.ucab.edu.ve", "@ucab.edu.ve", ""]) {
      assert.equal(CuentaValidador.esCorreoUcab(correo), false, correo);
    }
  });
});

describe("Crear cuenta (HU 1.1)", () => {
  test("con datos correctos es válido y devuelve el correo limpio (sin la confirmación)", () => {
    const r = registro.validar({ ...datos, correo: "  ANA.PEREZ@EST.UCAB.EDU.VE " });
    assert.equal(r.valido, true);
    assert.deepEqual(r.datos, { correo: "ana.perez@est.ucab.edu.ve", contrasena: "clave1234" });
  });

  // Los textos se escriben aquí a mano, letra por letra, para que la prueba falle si alguien los cambia.
  test("los mensajes son los del escenario, letra por letra (pasos 7.1, 8.1 y 9.1)", () => {
    assert.equal(error({ correo: "ana@gmail.com" }), "Solo puede entrar la comunidad UCAB. Usa tu correo institucional");
    assert.equal(error({ contrasena: "1234567", confirmacion: "1234567" }), "La contraseña debe tener al menos 8 caracteres");
    assert.equal(error({ confirmacion: "otraclave" }), "Las contraseñas no coinciden");
  });

  test("RN: 7 caracteres no alcanzan y 8 sí", () => {
    assert.match(error({ contrasena: "1234567", confirmacion: "1234567" }), /8/);
    assert.equal(error({ contrasena: "12345678", confirmacion: "12345678" }), null);
  });

  test("un correo vacío o mal escrito cae en el paso 7.1 y una contraseña vacía en el 8.1", () => {
    for (const correo of ["", "   ", "ana perez@est.ucab.edu.ve", "ana.perez", "ana@@est.ucab.edu.ve"]) {
      assert.equal(error({ correo }), CuentaValidador.MENSAJE_SOLO_UCAB, correo);
    }
    assert.equal(error({ contrasena: "", confirmacion: "" }), CuentaValidador.MENSAJE_CONTRASENA_CORTA);
  });
});

describe("Entrar (HU 1.1)", () => {
  const entrar = new CuentaValidador("entrar");

  test("con otro correo no deja intentar y explica por qué", () => {
    assert.equal(entrar.validar({ correo: "ana@gmail.com", contrasena: "x" }).error, CuentaValidador.MENSAJE_SOLO_UCAB);
  });

  test("pide la contraseña, pero no revisa su largo (eso es solo al crear la cuenta)", () => {
    assert.equal(entrar.validar({ correo: "ana@ucab.edu.ve", contrasena: "" }).valido, false);
    assert.equal(entrar.validar({ correo: "ana@ucab.edu.ve", contrasena: "corta" }).valido, true);
  });
});
