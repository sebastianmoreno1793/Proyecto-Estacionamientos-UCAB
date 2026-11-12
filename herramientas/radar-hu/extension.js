// Extensión «Radar · Historias de usuario».
// Lee las etiquetas «@HU-x.y Nombre · Responsable — detalle» de los archivos del proyecto y:
//   1. En el explorador, marca cada archivo con su épica (por ejemplo «6») y, al pasar el mouse,
//      dice de qué HU es, sin abrirlo.
//   2. Con ⌘⌥H (o el ícono de libro del explorador) busca una HU y lista sus archivos.
//   3. Clic derecho en un archivo → «¿De qué HU es este archivo?».
//   4. En la barra de abajo muestra las HU del archivo abierto.
// También lee las etiquetas «@PANTALLA Nombre (/ruta) — detalle» y «@PANTALLA Nombre › parte»:
// y «@FETCH Lugar › MÉTODO /url — qué pide» (cada vez que el navegador le pide datos al servidor).
// En el buscador (⌘⌥H) salen primero las pantallas y los fetch, y después las HU.
const vscode = require("vscode");

const ETIQUETA = /@HU-(\d+\.\d+)(?:[ \t]+([^·\n*}]+?)[ \t]*·[ \t]*([^—\n*}]+?))?(?:[ \t]*—[ \t]*([^\n*}]+?))?[ \t]*(?:\*\/|\}|$)/gm;
const ARCHIVOS = "**/*.{js,jsx,mjs,cjs,ts,tsx,css}";
const EXCLUIR = "{**/node_modules/**,**/.next/**,**/.git/**,**/herramientas/radar-hu/**}";

// hu → { nombre, responsable, usos: [{ uri, linea, detalle }] }
let historias = new Map();
// ruta del archivo → [{ hu, linea, detalle }]
let porArchivo = new Map();
// pantalla → { ruta, detalle, usos: [{ uri, linea, parte, principal }] }
let pantallas = new Map();

const ETIQUETA_PANTALLA = /@PANTALLA[ \t]+(.+?)[ \t]*(?:\*\/|\}|$)/;
const ETIQUETA_FETCH = /@FETCH[ \t]+(.+?)[ \t]*(?:\*\/|\}|$)/;
// [{ lugar, que, detalle, uri, linea }]
let fetches = [];
// Orden de las pantallas en el buscador (las que no estén aquí van al final, por nombre).
const ORDEN_PANTALLAS = [
  "Inicio", "Login", "Crear cuenta", "Mapa", "Reportar", "Perfil", "Sugerir",
  "Admin Puestos", "Admin Garita", "Admin Edificios", "Todas", "Simulador", "Simulador Maqueta",
];

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

// Lee «@PANTALLA Mapa (/mapa) — detalle» (la pantalla completa) y «@PANTALLA Mapa › parte» (una parte).
function leerPantallas(texto) {
  const encontradas = [];
  texto.split("\n").forEach((linea, numero) => {
    const m = linea.match(ETIQUETA_PANTALLA);
    if (!m) return;
    const contenido = m[1];
    const parte = contenido.indexOf("›");
    if (parte !== -1) {
      encontradas.push({ pantalla: contenido.slice(0, parte).trim(), parte: contenido.slice(parte + 1).trim(), linea: numero, principal: false });
      return;
    }
    const conRuta = contenido.match(/^(.+?)\s*\(([^)]+)\)\s*(?:—\s*(.*))?$/);
    if (conRuta) {
      encontradas.push({ pantalla: conRuta[1].trim(), ruta: conRuta[2].trim(), parte: (conRuta[3] || "").trim(), linea: numero, principal: true });
    } else {
      const [nombre, ...resto] = contenido.split("—");
      encontradas.push({ pantalla: nombre.trim(), parte: resto.join("—").trim(), linea: numero, principal: true });
    }
  });
  return encontradas;
}

// Lee «@FETCH Inicio › GET /api/sugerencia — pide…».
function leerFetch(texto) {
  const encontrados = [];
  texto.split("\n").forEach((linea, numero) => {
    const m = linea.match(ETIQUETA_FETCH);
    if (!m) return;
    const [antes, ...resto] = m[1].split("—");
    const corte = antes.indexOf("›");
    encontrados.push({
      lugar: corte === -1 ? "" : antes.slice(0, corte).trim(),
      que: (corte === -1 ? antes : antes.slice(corte + 1)).trim(),
      detalle: resto.join("—").trim(),
      linea: numero,
    });
  });
  return encontrados;
}

function indexarPantallas(uri, texto) {
  for (const e of leerPantallas(texto)) {
    if (!pantallas.has(e.pantalla)) pantallas.set(e.pantalla, { ruta: "", detalle: "", usos: [] });
    const p = pantallas.get(e.pantalla);
    if (e.principal && e.ruta && !p.ruta) p.ruta = e.ruta;
    if (e.principal && e.parte && !p.detalle) p.detalle = e.parte;
    p.usos.push({ uri, linea: e.linea, parte: e.parte, principal: e.principal });
  }
}

async function indexarArchivo(uri) {
  quitarArchivo(uri);
  let texto;
  try {
    texto = Buffer.from(await vscode.workspace.fs.readFile(uri)).toString("utf8");
  } catch {
    return;
  }
  if (texto.includes("@PANTALLA")) indexarPantallas(uri, texto);
  if (texto.includes("@FETCH")) for (const f of leerFetch(texto)) fetches.push({ ...f, uri });
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
  fetches = fetches.filter((f) => f.uri.toString() !== clave);
  for (const [nombre, p] of pantallas) {
    p.usos = p.usos.filter((u) => u.uri.toString() !== clave);
    if (p.usos.length === 0) pantallas.delete(nombre);
  }
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
  pantallas = new Map();
  fetches = [];
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

function compararPantallas(a, b) {
  const ia = ORDEN_PANTALLAS.indexOf(a);
  const ib = ORDEN_PANTALLAS.indexOf(b);
  if (ia !== -1 && ib !== -1) return ia - ib;
  if (ia !== -1 || ib !== -1) return ia === -1 ? 1 : -1;
  return a.localeCompare(b);
}

// HU del archivo en corto: «HU 5.1 · 4.2» (o «sin HU»).
function husEnCorto(uri) {
  const hus = husDe(uri);
  return hus.length ? `HU ${hus.join(" · ")}` : "sin HU";
}

function rutaCorta(uri) {
  return vscode.workspace.asRelativePath(uri).replace(/^RadarEstacionamientos_code\//, "");
}

const separador = (label) => ({ label, kind: vscode.QuickPickItemKind.Separator });

// Renglones de las pantallas. Con «completo» salen también sus partes; sin él, solo la pantalla.
// Todos llevan «@PANTALLA» en el nombre: al escribir «pantalla» salen todas las pantallas y vistas.
function renglonesDePantallas(completo) {
  const renglones = [separador("Pantallas")];
  for (const nombre of [...pantallas.keys()].sort(compararPantallas)) {
    const p = pantallas.get(nombre);
    const usos = [...p.usos]
      .filter((u) => completo || u.principal)
      .sort((a, b) => Number(b.principal) - Number(a.principal) || a.uri.path.localeCompare(b.uri.path));
    for (const u of usos) {
      const relativa = rutaCorta(u.uri);
      renglones.push({
        label: u.principal
          ? `$(browser) @PANTALLA ${nombre}${p.ruta ? ` (${p.ruta})` : ""}`
          : `$(layout) @PANTALLA ${nombre} › ${u.parte}`,
        description: `${husEnCorto(u.uri)} · ${relativa.split("/").pop()}`,
        detail: u.principal ? `${u.parte ? `${u.parte} · ` : ""}${relativa}` : relativa,
        uso: u,
      });
    }
    // Sin escribir nada, una pantalla que solo tiene partes (por ejemplo «Todas») sale con su primera parte.
    if (!completo && usos.length === 0 && p.usos.length) {
      const u = p.usos[0];
      renglones.push({
        label: `$(layout) @PANTALLA ${nombre}`,
        description: `${p.usos.length} partes · escribe «pantalla ${nombre.toLowerCase()}»`,
        detail: rutaCorta(u.uri),
        uso: u,
      });
    }
  }
  return renglones;
}

// Renglones de los fetch: cada vez que el navegador le pide datos al servidor.
function renglonesDeFetch() {
  const orden = (f) => {
    const i = ORDEN_PANTALLAS.indexOf(f.lugar);
    return i === -1 ? ORDEN_PANTALLAS.length : i;
  };
  const lista = [...fetches].sort((a, b) => orden(a) - orden(b) || a.uri.path.localeCompare(b.uri.path) || a.linea - b.linea);
  return [
    separador("Fetch · lo que el navegador le pide al servidor"),
    ...lista.map((f) => {
      const relativa = rutaCorta(f.uri);
      return {
        label: `$(cloud-download) @FETCH ${f.lugar ? `${f.lugar} › ` : ""}${f.que}`,
        description: `${husEnCorto(f.uri)} · ${relativa.split("/").pop()}`,
        detail: `${f.detalle ? `${f.detalle} · ` : ""}${relativa}`,
        uso: { uri: f.uri, linea: f.linea + 1 }, // abre en la línea del fetch, debajo de la etiqueta
      };
    }),
  ];
}

// 2. El buscador (⌘⌥H). Sin escribir nada: las pantallas, los fetch y las HU, en ese orden.
// Al escribir: también las partes de cada pantalla. «pantalla» → todas las pantallas y vistas;
// «fetch» → todos los fetch; «6.1» o «edificios» → la HU (al elegirla salen sus archivos).
async function buscar() {
  if (historias.size === 0 && pantallas.size === 0) await indexarTodo();
  const listaHU = [...historias.keys()].sort(compararHU).map((hu) => {
    const h = historias.get(hu);
    const archivos = new Set(h.usos.map((u) => u.uri.toString())).size;
    return {
      label: `$(book) HU ${hu} · ${h.nombre}`,
      description: `${h.responsable || "sin responsable"} · ${archivos} archivo${archivos === 1 ? "" : "s"}`,
      detail: queHace.get(hu),
      hu,
    };
  });
  const historiasDeUsuario = [separador("Historias de usuario"), ...listaHU];
  const sinEscribir = [...renglonesDePantallas(false), ...renglonesDeFetch(), ...historiasDeUsuario];
  const escribiendo = [...renglonesDePantallas(true), ...renglonesDeFetch(), ...historiasDeUsuario];

  const selector = vscode.window.createQuickPick();
  selector.title = "Radar · Pantallas, fetch e historias de usuario";
  selector.placeholder = "Escribe «pantalla», «fetch» o una HU (6.1, edificios). Ej.: pantalla login, fetch mapa";
  selector.matchOnDescription = true;
  selector.matchOnDetail = true;
  selector.items = sinEscribir;
  let vacio = true;
  selector.onDidChangeValue((valor) => {
    const ahoraVacio = valor.trim() === "";
    if (ahoraVacio === vacio) return;
    vacio = ahoraVacio;
    selector.items = vacio ? sinEscribir : escribiendo;
  });
  selector.onDidAccept(async () => {
    const elegido = selector.selectedItems[0];
    selector.hide();
    if (!elegido) return;
    if (elegido.uso) await abrirEn(elegido.uso.uri, elegido.uso.linea);
    else if (elegido.hu) await mostrarArchivosDe(elegido.hu);
  });
  selector.onDidHide(() => selector.dispose());
  selector.show();
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
  if (/\/pruebas_automaticas\//.test(ruta)) return { orden: 6, icono: "$(beaker)", nombre: "Prueba" };
  if (/front\/app\/api\//.test(ruta)) return { orden: 3, icono: "$(globe)", nombre: "URL de la API" };
  if (/front\/app\//.test(ruta)) return { orden: 0, icono: "$(browser)", nombre: "Pantalla" };
  if (/front\/partes_de_pantallas\//.test(ruta)) return { orden: 1, icono: "$(layout)", nombre: "Parte de la pantalla" };
  if (/front\/envio_de_formularios\//.test(ruta)) return { orden: 2, icono: "$(arrow-swap)", nombre: "Acción del formulario" };
  if (/front\/sesion_del_usuario\//.test(ruta)) return { orden: 2, icono: "$(key)", nombre: "Sesión" };
  if (/front\/notificaciones_del_navegador\/|front\/public\//.test(ruta)) return { orden: 2, icono: "$(bell)", nombre: "Notificaciones" };
  if (/front\//.test(ruta)) return { orden: 2, icono: "$(arrow-swap)", nombre: "Front" };
  if (/back\/pedidos_y_respuestas\//.test(ruta)) return { orden: 3, icono: "$(globe)", nombre: "API" };
  if (/reglas\.js$/.test(ruta)) return { orden: 4, icono: "$(law)", nombre: "Reglas" };
  if (/datos\.js$|back\/datos_del_campus\//.test(ruta)) return { orden: 5, icono: "$(database)", nombre: "Datos" };
  if (/back\/control_de_acceso\//.test(ruta)) return { orden: 3, icono: "$(shield)", nombre: "Seguridad" };
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
    barra.tooltip = "Buscar una pantalla, un fetch o una historia de usuario (⌘⌥H)";
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

module.exports = { activate, deactivate, leerEtiquetas, leerPantallas, leerFetch, buscar };
