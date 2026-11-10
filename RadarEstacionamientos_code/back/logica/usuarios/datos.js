// @HU-1.1 Crear cuenta con el correo institucional · Samuel — Aquí se guardan las cuentas (correo, contraseña cifrada y rol) y las sesiones abiertas
// Usuarios y sesiones EN MEMORIA, igual que comun/almacen.js: es temporal mientras el
// equipo elige la base de datos. Al reiniciar el servidor se pierden las cuentas creadas.
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { MENSAJE_SOLO_UCAB, MENSAJE_YA_EXISTE, esCorreoUcab, normalizarCorreo, rolSegunCorreo, validarRegistro } from "./reglas.js";

// Cuentas de prueba, una por rol, para ver la app como cada tipo de usuario. Solo existen en
// desarrollo (en producción no se crean). Son correos inventados, no de personas reales.
// El administrador no sale del dominio: se asigna a mano mientras se decide cómo darlo.
export const USUARIOS_DE_PRUEBA = [
  { correo: "admin.prueba@ucab.edu.ve", contrasena: "123456789", rol: "administrador" },
  { correo: "estudiante.prueba@est.ucab.edu.ve", contrasena: "123456789", rol: "estudiante" },
  { correo: "profesor.prueba@ucab.edu.ve", contrasena: "123456789", rol: "profesor" },
];

// El administrador de prueba (lo usa también el atajo SALTAR_INICIO_DE_SESION de seguridad/sesion.js).
export const USUARIO_DE_PRUEBA = USUARIOS_DE_PRUEBA[0];

// La contraseña no se guarda tal cual: se guarda un hash con sal.
// Calcula el hash scrypt de la contraseña con una sal aleatoria. Devuelve { sal, hash }. [sesion]
function cifrar(contrasena, sal = randomBytes(16).toString("hex")) {
  const hash = scryptSync(String(contrasena), sal, 64).toString("hex");
  return { sal, hash };
}

// Compara la contraseña escrita con el hash guardado, en tiempo constante (HU 1.1). [sesion]
function contrasenaCorrecta(usuario, contrasena) {
  const { hash } = cifrar(contrasena, usuario.sal);
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(usuario.hash, "hex"));
}

// Arma un usuario nuevo con su rol y la contraseña cifrada.
function nuevoUsuario(correo, contrasena, rol) {
  return { correo, rol, ...cifrar(contrasena), creadoEn: new Date().toISOString() };
}

// Crea las listas vacías de usuarios y sesiones; en desarrollo agrega las cuentas de prueba. [datos]
function crearDatos() {
  const datos = { usuarios: [], sesiones: {} };
  if (process.env.NODE_ENV !== "production") {
    for (const { correo, contrasena, rol } of USUARIOS_DE_PRUEBA) {
      datos.usuarios.push(nuevoUsuario(correo, contrasena, rol));
    }
  }
  return datos;
}

// Devuelve los usuarios y sesiones en memoria; los crea la primera vez. [datos]
function obtenerDatos() {
  globalThis.__radarUsuarios ??= crearDatos();
  return globalThis.__radarUsuarios;
}

// Borra usuarios y sesiones y vuelve al estado inicial. [datos]
export function reiniciarUsuarios() {
  globalThis.__radarUsuarios = crearDatos();
}

// Lo que se muestra del usuario (nunca el hash).
// Devuelve solo el correo y el rol del usuario.
function publico(usuario) {
  return { correo: usuario.correo, rol: usuario.rol };
}

// Busca un usuario por correo, sin importar mayúsculas. [datos]
function buscar(correo) {
  return obtenerDatos().usuarios.find((u) => u.correo === normalizarCorreo(correo));
}

// @HU-1.1 Crear cuenta con el correo institucional · Samuel
// Crea una cuenta con correo UCAB y rol según el dominio (HU 1.1). Devuelve { usuario } o { error }. [datos]
export async function registrarUsuario({ correo, contrasena, confirmacion }) {
  const validacion = validarRegistro({ correo, contrasena, confirmacion });
  if (validacion.error) return { error: validacion.error };
  if (buscar(correo)) return { error: MENSAJE_YA_EXISTE }; // paso 10.1

  const usuario = nuevoUsuario(normalizarCorreo(correo), contrasena, rolSegunCorreo(correo));
  obtenerDatos().usuarios.push(usuario);
  return { usuario: publico(usuario) };
}

// @HU-1.1 Crear cuenta con el correo institucional · Samuel
// Verifica correo UCAB y contraseña al iniciar sesión (HU 1.1). Devuelve { usuario } o { error }. [datos] [sesion]
export async function comprobarCredenciales({ correo, contrasena }) {
  if (!esCorreoUcab(correo)) return { error: MENSAJE_SOLO_UCAB };
  const usuario = buscar(correo);
  if (!usuario || !contrasenaCorrecta(usuario, contrasena)) {
    return { error: "Correo o contraseña incorrectos." };
  }
  return { usuario: publico(usuario) };
}

// @HU-1.1 Crear cuenta con el correo institucional · Samuel
// Crea un código de sesión (el valor de la cookie radar_sesion) para ese correo. [datos] [sesion]
export async function crearSesion(correo) {
  const token = randomUUID();
  obtenerDatos().sesiones[token] = normalizarCorreo(correo);
  return token;
}

// Devuelve el usuario dueño de un código de sesión, o null si no existe. [datos] [sesion]
export async function usuarioDeLaSesion(token) {
  const correo = obtenerDatos().sesiones[token];
  if (!correo) return null;
  const usuario = buscar(correo);
  return usuario ? publico(usuario) : null;
}

// Cierra la sesión borrando su código. [datos] [sesion]
export async function borrarSesion(token) {
  delete obtenerDatos().sesiones[token];
}
