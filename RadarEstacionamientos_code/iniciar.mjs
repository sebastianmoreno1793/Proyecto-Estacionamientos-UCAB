// Arranca el Radar con un solo comando (o con «Run Code» en VS Code):
//   1. instala las dependencias si faltan (front y simulador);
//   2. levanta la app en http://localhost:3000 y el simulador 3D en http://localhost:3001;
//   3. abre las dos en el navegador cuando ya responden.
// Ctrl+C apaga los dos. Uso: `node RadarEstacionamientos_code/iniciar.mjs` (desde cualquier carpeta).
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CODIGO = path.dirname(fileURLToPath(import.meta.url)); // RadarEstacionamientos_code
const FRONT = path.join(CODIGO, "front");
const SIMULADOR = path.join(CODIGO, "..", "RadarEstacionamientos_simulador");
const EN_WINDOWS = process.platform === "win32";
const NPM = EN_WINDOWS ? "npm.cmd" : "npm";

const [mayor, menor] = process.versions.node.split(".").map(Number);
if (mayor < 18 || (mayor === 18 && menor < 18)) {
  console.error(`Necesitas Node 18.18 o más nuevo (tienes ${process.versions.node}). Descárgalo en https://nodejs.org`);
  process.exit(1);
}

/** Instala las dependencias de una carpeta si todavía no tiene node_modules. */
function instalarSiFalta(carpeta, nombre) {
  if (existsSync(path.join(carpeta, "node_modules", "next"))) return;
  console.log(`\n▶ Instalando dependencias de ${nombre} (solo la primera vez)…`);
  const r = spawnSync(NPM, ["install", "--no-audit", "--no-fund"], { cwd: carpeta, stdio: "inherit", shell: EN_WINDOWS });
  if (r.status !== 0) {
    console.error(`No se pudieron instalar las dependencias de ${nombre}. Revisa tu conexión y vuelve a intentar.`);
    process.exit(1);
  }
}

/** true si algo ya escucha en ese puerto. */
function puertoOcupado(puerto) {
  return new Promise((resolver) => {
    const s = net.connect({ port: puerto, host: "127.0.0.1" });
    s.once("connect", () => { s.destroy(); resolver(true); });
    s.once("error", () => resolver(false));
  });
}

/** Espera hasta que la URL responda (máx. 2 minutos). */
async function esperar(url) {
  for (let i = 0; i < 240; i++) {
    try { await fetch(url, { redirect: "manual" }); return true; } catch { await new Promise((r) => setTimeout(r, 500)); }
  }
  return false;
}

function abrirNavegador(url) {
  const [cmd, args] = EN_WINDOWS ? ["cmd", ["/c", "start", "", url]]
    : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
  spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
}

const procesos = [];
/** Levanta `npm run dev` en una carpeta y antepone una etiqueta a lo que imprime. */
function levantar(carpeta, etiqueta) {
  const p = spawn(NPM, ["run", "dev"], { cwd: carpeta, shell: EN_WINDOWS, env: { ...process.env, FORCE_COLOR: "1" } });
  const imprimir = (flujo) => (datos) => String(datos).split(/\r?\n/).filter(Boolean)
    .forEach((linea) => flujo.write(`[${etiqueta}] ${linea}\n`));
  p.stdout.on("data", imprimir(process.stdout));
  p.stderr.on("data", imprimir(process.stderr));
  p.on("exit", (codigo) => { if (codigo) console.error(`[${etiqueta}] se detuvo (código ${codigo}).`); });
  procesos.push(p);
}

function apagar() {
  for (const p of procesos) {
    if (EN_WINDOWS) spawnSync("taskkill", ["/pid", String(p.pid), "/T", "/F"]);
    else p.kill("SIGINT");
  }
  process.exit(0);
}
process.on("SIGINT", apagar);
process.on("SIGTERM", apagar);

instalarSiFalta(FRONT, "la app");
if (existsSync(SIMULADOR)) instalarSiFalta(SIMULADOR, "el simulador");

const APP = "http://localhost:3000";
const SIM = "http://localhost:3001";
const haySimulador = existsSync(SIMULADOR);

// Cada una se maneja por separado: si ya está corriendo, se deja como está y solo se abre.
const appCorriendo = await puertoOcupado(3000);
const simCorriendo = haySimulador && (await puertoOcupado(3001));

if (!appCorriendo) levantar(FRONT, "app");
else console.log(`\nLa app ya estaba corriendo en ${APP}.`);
if (haySimulador && !simCorriendo) levantar(SIMULADOR, "simulador");
else if (simCorriendo) console.log(`El simulador ya estaba corriendo en ${SIM}.`);
if (!haySimulador) console.log("No se encontró la carpeta RadarEstacionamientos_simulador; solo arranca la app.");

console.log("\n▶ Esperando a la app (puerto 3000) y al simulador (puerto 3001)…");
const [appLista, simLista] = await Promise.all([esperar(APP), haySimulador ? esperar(SIM) : false]);

// Abre las dos en el navegador: primero el simulador y después la app, que queda al frente.
if (simLista) abrirNavegador(SIM);
if (simLista && appLista) await new Promise((r) => setTimeout(r, 800));
if (appLista) abrirNavegador(APP);

if (appLista) console.log(`\n✔ Radar listo: ${APP}`);
else console.error("La app no respondió en 2 minutos. Mira los mensajes de arriba.");
if (simLista) {
  console.log(`✔ Simulador 3D listo: ${SIM}`);
  console.log("  Para que el simulador pueda reportar incidencias, cerrar estacionamientos y reiniciar,");
  console.log("  entra primero a la app en el mismo navegador como administrador.");
  console.log("  Cuentas de prueba (contraseña 123456789): admin.prueba@ucab.edu.ve (administrador),");
  console.log("  estudiante.prueba@est.ucab.edu.ve (estudiante) y profesor.prueba@ucab.edu.ve (profesor).");
}
else if (haySimulador) console.error("El simulador no respondió en 2 minutos. Mira los mensajes de arriba.");

if (procesos.length) console.log("Ctrl+C para apagar.\n");
else process.exit(0); // las dos ya corrían: no hay nada que mantener abierto
