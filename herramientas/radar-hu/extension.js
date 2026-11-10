// Extensión «Radar · Historias de usuario».
// Lee las etiquetas «@HU-x.y Nombre · Responsable — detalle» de los archivos del proyecto y:
//   1. En el explorador, marca cada archivo con su épica (por ejemplo «6») y, al pasar el mouse,
//      dice de qué HU es, sin abrirlo.
//   2. Con ⌘⌥H (o el ícono de libro del explorador) busca una HU y lista sus archivos.
//   3. Clic derecho en un archivo → «¿De qué HU es este archivo?».
//   4. En la barra de abajo muestra las HU del archivo abierto.
const vscode = require("vscode");

const ETIQUETA = /@HU-(\d+\.\d+)(?:[ \t]+([^·\n*}]+?)[ \t]*·[ \t]*([^—\n*}]+?))?(?:[ \t]*—[ \t]*([^\n*}]+?))?[ \t]*(?:\*\/|\}|$)/gm;
const ARCHIVOS = "**/*.{js,jsx,mjs,cjs,ts,tsx,css}";
const EXCLUIR = "{**/node_modules/**,**/.next/**,**/.git/**,**/herramientas/radar-hu/**}";

// hu → { nombre, responsable, usos: [{ uri, linea, detalle }] }
let historias = new Map();
// ruta del archivo → [{ hu, linea, detalle }]
let porArchivo = new Map();

const cambioDecoraciones = new vscode.EventEmitter();

function compararHU(a, b) {
  const [a1, a2] = a.split(".").map(Number);
  const [b1, b2] = b.split(".").map(Number);
  return a1 - b1 || a2 - b2;
}

function leerEtiquetas(texto) {
  const encontradas = [];
  const lineas = texto.split("\n");
  lineas.forEach((linea, numero) => {
    ETIQUETA.lastIndex = 0;
    let m;
    while ((m = ETIQUETA.exec(linea)) !== null) {
      encontradas.push({
        hu: m[1],
        nombre: (m[2] || "").trim(),
        responsable: (m[3] || "").trim(),
        detalle: (m[4] || "").trim(),
        linea: numero,
      });
      if (m[0].length === 0) ETIQUETA.lastIndex++;
    }
  });
  return encontradas;
}

async function indexarArchivo(uri) {
  quitarArchivo(uri);
  let texto;
  try {
    texto = Buffer.from(await vscode.workspace.fs.readFile(uri)).toString("utf8");
  } catch {
    return;
  }
  if (!texto.includes("@HU-")) return;
  const etiquetas = leerEtiquetas(texto);
  if (etiquetas.length === 0) return;
  porArchivo.set(uri.toString(), etiquetas);
  for (const e of etiquetas) {
    if (!historias.has(e.hu)) historias.set(e.hu, { nombre: "", responsable: "", usos: [] });
    const h = historias.get(e.hu);
    if (!h.nombre && e.nombre) h.nombre = e.nombre;
    if (!h.responsable && e.responsable) h.responsable = e.responsable;
    h.usos.push({ uri, linea: e.linea, detalle: e.detalle });
  }
}

function quitarArchivo(uri) {
  const clave = uri.toString();
  if (!porArchivo.has(clave)) return;
  porArchivo.delete(clave);
  for (const [hu, h] of historias) {
    h.usos = h.usos.filter((u) => u.uri.toString() !== clave);
    if (h.usos.length === 0) historias.delete(hu);
  }
}

// hu → primera frase de «Qué hace» en docs/mapa_HU_codigo.md
let queHace = new Map();

async function leerMapa() {
  queHace = new Map();
  const [mapa] = await vscode.workspace.findFiles("**/docs/mapa_HU_codigo.md", EXCLUIR, 1);
  if (!mapa) return;
  const texto = Buffer.from(await vscode.workspace.fs.readFile(mapa)).toString("utf8");
  for (const seccion of texto.split(/^## /m)) {
    const hu = seccion.match(/^HU (\d+\.\d+)/);
    const frase = seccion.match(/\*\*Qué hace\.\*\*\s*(.+?\.)(?:\s|$)/);
    if (hu && frase) queHace.set(hu[1], frase[1].replace(/`/g, ""));
  }
}

async function indexarTodo() {
  historias = new Map();
  porArchivo = new Map();
  const uris = await vscode.workspace.findFiles(ARCHIVOS, EXCLUIR);
  await Promise.all([leerMapa(), ...uris.map(indexarArchivo)]);
  cambioDecoraciones.fire(undefined);
  actualizarBarra();
}

function husDe(uri) {
  const etiquetas = porArchivo.get(uri.toString()) || [];
  return [...new Set(etiquetas.map((e) => e.hu))].sort(compararHU);
}

function titulo(hu) {
  const h = historias.get(hu);
  if (!h) return `HU ${hu}`;
  return `HU ${hu}${h.nombre ? ` · ${h.nombre}` : ""}${h.responsable ? ` (${h.responsable})` : ""}`;
}

// 1. Marca en el explorador.
const decoraciones = {
  onDidChangeFileDecorations: cambioDecoraciones.event,
  provideFileDecoration(uri) {
    const hus = husDe(uri);
    if (hus.length === 0) return undefined;
    const epicas = [...new Set(hus.map((hu) => hu.split(".")[0]))];
    // VS Code solo deja 2 caracteres en la marca: la épica y un «+» si hay más de una HU.
    const marca = (epicas[0] + (hus.length > 1 ? "+" : "")).slice(0, 2);
    return new vscode.FileDecoration(marca, hus.map(titulo).join("\n"));
  },
};

// 2. Buscar una HU y abrir uno de sus archivos.
async function buscar() {
  if (historias.size === 0) await indexarTodo();
  const lista = [...historias.keys()].sort(compararHU).map((hu) => {
    const h = historias.get(hu);
    const archivos = new Set(h.usos.map((u) => u.uri.toString())).size;
    const resumen = `${h.responsable || "sin responsable"} · ${archivos} archivo${archivos === 1 ? "" : "s"}`;
    return {
      label: `HU ${hu} · ${h.nombre}`,
      description: resumen,
      detail: queHace.get(hu),
      hu,
    };
  });
  const elegida = await vscode.window.showQuickPick(lista, {
    title: "Radar · Historias de usuario",
    placeHolder: "Escribe el número o el nombre de la HU (por ejemplo 6.1 o edificios)",
    matchOnDescription: true,
    matchOnDetail: true,
  });
  if (elegida) await mostrarArchivosDe(elegida.hu);
}

async function mostrarArchivosDe(hu) {
  const h = historias.get(hu);
  if (!h) return;
  // Un renglón por archivo, en la primera línea donde aparece la etiqueta.
  const vistos = new Map();
  for (const u of h.usos) {
    const clave = u.uri.toString();
    if (!vistos.has(clave) || (u.detalle && !vistos.get(clave).detalle)) vistos.set(clave, u);
  }
  const items = [...vistos.values()]
    .map((u) => ({ u, capa: capaDe(vscode.workspace.asRelativePath(u.uri)) }))
    .sort((a, b) => a.capa.orden - b.capa.orden || a.u.uri.path.localeCompare(b.u.uri.path))
    .map(({ u, capa }) => {
      const relativa = vscode.workspace.asRelativePath(u.uri).replace(/^RadarEstacionamientos_code\//, "");
      const archivo = relativa.split("/").pop();
      return {
        // Lo primero que se lee es qué hace el archivo; después, cuál es y dónde está.
        label: `${capa.icono} ${u.detalle || archivo}`,
        description: `${capa.nombre} · ${archivo}`,
        detail: relativa,
        uso: u,
      };
    });
  const elegido = await vscode.window.showQuickPick(items, {
    title: titulo(hu),
    placeHolder: "Elige un archivo para abrirlo en la línea de la etiqueta",
    matchOnDescription: true,
    matchOnDetail: true,
  });
  if (elegido) await abrirEn(elegido.uso.uri, elegido.uso.linea);
}

// Capa del archivo según su carpeta, para ordenar la lista de pantalla a pruebas.
function capaDe(ruta) {
  if (/\/pruebas\//.test(ruta)) return { orden: 6, icono: "$(beaker)", nombre: "Prueba" };
  if (/front\/app\/api\//.test(ruta)) return { orden: 3, icono: "$(globe)", nombre: "URL de la API" };
  if (/front\/app\//.test(ruta)) return { orden: 0, icono: "$(browser)", nombre: "Pantalla" };
  if (/front\/componentes\//.test(ruta)) return { orden: 1, icono: "$(layout)", nombre: "Parte de la pantalla" };
  if (/front\/acciones\//.test(ruta)) return { orden: 2, icono: "$(arrow-swap)", nombre: "Acción del formulario" };
  if (/front\/servidor\//.test(ruta)) return { orden: 2, icono: "$(key)", nombre: "Sesión" };
  if (/front\/notificaciones\/|front\/public\//.test(ruta)) return { orden: 2, icono: "$(bell)", nombre: "Notificaciones" };
  if (/front\//.test(ruta)) return { orden: 2, icono: "$(arrow-swap)", nombre: "Front" };
  if (/back\/api\//.test(ruta)) return { orden: 3, icono: "$(globe)", nombre: "API" };
  if (/reglas\.js$/.test(ruta)) return { orden: 4, icono: "$(law)", nombre: "Reglas" };
  if (/datos\.js$|back\/campus\//.test(ruta)) return { orden: 5, icono: "$(database)", nombre: "Datos" };
  if (/back\/seguridad\//.test(ruta)) return { orden: 3, icono: "$(shield)", nombre: "Seguridad" };
  return { orden: 7, icono: "$(file-code)", nombre: "Archivo" };
}

async function abrirEn(uri, linea) {
  const editor = await vscode.window.showTextDocument(uri, { preview: false });
  const pos = new vscode.Position(linea, 0);
  editor.selection = new vscode.Selection(pos, pos);
  editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenter);
}

// 3. Clic derecho en el explorador: «¿De qué HU es este archivo?».
async function deEsteArchivo(uri) {
  const destino = uri || vscode.window.activeTextEditor?.document.uri;
  if (!destino) return;
  if (porArchivo.size === 0) await indexarTodo();
  const hus = husDe(destino);
  const nombre = vscode.workspace.asRelativePath(destino);
  if (hus.length === 0) {
    vscode.window.showInformationMessage(`${nombre} no tiene etiquetas @HU.`);
    return;
  }
  const elegida = await vscode.window.showQuickPick(
    hus.map((hu) => ({
      label: `HU ${hu}`,
      description: historias.get(hu)?.nombre,
      detail: historias.get(hu)?.responsable,
      hu,
    })),
    { title: `${nombre} pertenece a:`, placeHolder: "Elige una HU para ver todos sus archivos" }
  );
  if (elegida) await mostrarArchivosDe(elegida.hu);
}

// 4. Barra de abajo.
let barra;
function actualizarBarra() {
  if (!barra) return;
  const editor = vscode.window.activeTextEditor;
  const hus = editor ? husDe(editor.document.uri) : [];
  if (hus.length === 0) {
    barra.text = "$(book) HU";
    barra.tooltip = "Buscar una historia de usuario (⌘⌥H)";
    barra.command = "radarHU.buscar";
  } else {
    barra.text = `$(book) ${hus.map((hu) => `HU ${hu}`).join(" · ")}`;
    barra.tooltip = hus.map(titulo).join("\n") + "\n\nClic: ver los archivos de esta HU";
    barra.command = "radarHU.deEsteArchivo";
  }
  barra.show();
}

function activate(context) {
  barra = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
  const vigilante = vscode.workspace.createFileSystemWatcher(ARCHIVOS);
  const refrescar = async (uri) => {
    if (/[\\/](node_modules|\.next|\.git)[\\/]/.test(uri.path)) return;
    await indexarArchivo(uri);
    cambioDecoraciones.fire(uri);
    actualizarBarra();
  };

  context.subscriptions.push(
    barra,
    vigilante,
    vscode.window.registerFileDecorationProvider(decoraciones),
    vscode.commands.registerCommand("radarHU.buscar", buscar),
    vscode.commands.registerCommand("radarHU.deEsteArchivo", deEsteArchivo),
    vscode.commands.registerCommand("radarHU.recargar", indexarTodo),
    vscode.window.onDidChangeActiveTextEditor(actualizarBarra),
    vigilante.onDidChange(refrescar),
    vigilante.onDidCreate(refrescar),
    vigilante.onDidDelete((uri) => {
      quitarArchivo(uri);
      cambioDecoraciones.fire(uri);
    })
  );

  indexarTodo();
}

function deactivate() {}

module.exports = { activate, deactivate, leerEtiquetas, buscar };
