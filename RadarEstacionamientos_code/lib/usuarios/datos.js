// Usuarios y sesiones EN MEMORIA, igual que lib/almacen.js: es temporal mientras el
// equipo elige la base de datos. Al reiniciar el servidor se pierden las cuentas creadas.
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { MENSAJE_SOLO_UCAB, esCorreoUcab, normalizarCorreo, rolSegunCorreo, validarRegistro } from "./reglas.js";

// Usuario de prueba con rol de administrador (el mismo que usaba lib/sesion.js),
// para poder entrar a /admin mientras se decide cómo se asignan esos roles.
// Solo existe en desarrollo.
export const USUARIO_DE_PRUEBA = {
  correo: "usuario.prueba@ucab.edu.ve",
  contrasena: "prueba123",
  rol: "administrador",
};

// La contraseña no se guarda tal cual: se guarda un hash con sal.
function cifrar(contrasena, sal = randomBytes(16).toString("hex")) {
  const hash = scryptSync(String(contrasena), sal, 64).toString("hex");
  return { sal, hash };
}

function contrasenaCorrecta(usuario, contrasena) {
  const { hash } = cifrar(contrasena, usuario.sal);
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(usuario.hash, "hex"));
}

function nuevoUsuario(correo, contrasena, rol) {
  return { correo, rol, ...cifrar(contrasena), creadoEn: new Date().toISOString() };
}

function crearDatos() {
  const datos = { usuarios: [], sesiones: {} };
  if (process.env.NODE_ENV !== "production") {
    const { correo, contrasena, rol } = USUARIO_DE_PRUEBA;
    datos.usuarios.push(nuevoUsuario(correo, contrasena, rol));
  }
  return datos;
}

function obtenerDatos() {
  globalThis.__radarUsuarios ??= crearDatos();
  return globalThis.__radarUsuarios;
}

export function reiniciarUsuarios() {
  globalThis.__radarUsuarios = crearDatos();
}

// Lo que se muestra del usuario (nunca el hash).
function publico(usuario) {
  return { correo: usuario.correo, rol: usuario.rol };
}

function buscar(correo) {
  return obtenerDatos().usuarios.find((u) => u.correo === normalizarCorreo(correo));
}

export async function registrarUsuario({ correo, contrasena, confirmacion }) {
  const validacion = validarRegistro({ correo, contrasena, confirmacion });
  if (validacion.error) return { error: validacion.error };
  if (buscar(correo)) return { error: "Ya existe una cuenta con ese correo. Inicia sesión." };

  const usuario = nuevoUsuario(normalizarCorreo(correo), contrasena, rolSegunCorreo(correo));
  obtenerDatos().usuarios.push(usuario);
  return { usuario: publico(usuario) };
}

export async function comprobarCredenciales({ correo, contrasena }) {
  if (!esCorreoUcab(correo)) return { error: MENSAJE_SOLO_UCAB };
  const usuario = buscar(correo);
  if (!usuario || !contrasenaCorrecta(usuario, contrasena)) {
    return { error: "Correo o contraseña incorrectos." };
  }
  return { usuario: publico(usuario) };
}

export async function crearSesion(correo) {
  const token = randomUUID();
  obtenerDatos().sesiones[token] = normalizarCorreo(correo);
  return token;
}

export async function usuarioDeLaSesion(token) {
  const correo = obtenerDatos().sesiones[token];
  if (!correo) return null;
  const usuario = buscar(correo);
  return usuario ? publico(usuario) : null;
}

export async function borrarSesion(token) {
  delete obtenerDatos().sesiones[token];
}
