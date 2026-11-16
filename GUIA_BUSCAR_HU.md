# Cómo encontrar una HU en el código (guía rápida para la defensa)

> Nota temporal, fuera de git. Bórrala cuando ya no la necesites.

## 0. Preparar (una sola vez)

1. Baja lo último:
   ```bash
   cd "/Users/sebastianmoreno/UCAB/Ingeniería de Software/Proyecto Radar de Estacionamientos" && git pull
   ```
2. Instala la extensión del Radar:
   ```bash
   code --install-extension herramientas/radar-hu/radar-hu.vsix --force
   ```
3. En VS Code: **File → Open Folder… → la carpeta raíz del repo (en la Mac de Sebastián, `Proyecto Radar de Estacionamientos`)** (la raíz, no `RadarEstacionamientos_code`).
4. Si VS Code ofrece «instalar extensiones recomendadas», acepta (Todo Tree, GitLens, Bookmarks).
5. Si no ves las marcas: **⌘⇧P → «Developer: Reload Window»**.

## 1. «¿Dónde está la HU X?» → buscador del Radar

**⌘⌥H** (o el ícono de libro arriba del explorador)

1. Escribe el número (`6.1`) o una palabra (`edificios`, `contraseña`).
2. Elige la HU → sale la lista de sus archivos, en este orden:
   **Pantalla → Parte de la pantalla → Acción → API → Reglas → Datos → Pruebas**.
3. Cada renglón dice primero **qué hace** el archivo. Elige uno y se abre en la línea exacta.

## 1b. «¿Dónde está esto que veo en pantalla?» → `@PANTALLA`

**⌘⌥H**: sin escribir nada salen primero las **pantallas**, después los **fetch** y al final las **HU**.

- `pantalla` → todas las pantallas y sus partes. `pantalla login`, `pantalla mapa`… para ir a una.
- `fetch` → cada pedido del navegador al servidor: en qué pantalla, qué dirección pide y para qué.
- Cada renglón dice sus HU (por ejemplo `HU 1.1 · FormularioCuenta.js`) y al elegirlo se abre directo.

Si la extensión no está a mano, **⌘⇧F** y escribe:

| Escribes | Te sale |
|---|---|
| `@PANTALLA` | **Todas** las vistas de la app y del simulador |
| `@PANTALLA Login` | La pantalla Entrar (`app/entrar/page.js`) y su formulario |
| `@PANTALLA Mapa` | La pantalla del mapa y sus partes (maqueta, lista «¿Dónde hay puesto?», tarjeta) |
| `@PANTALLA Admin` | Admin Puestos, Admin Garita y Admin Edificios con sus partes |
| `@PANTALLA Todas` | Lo que sale en todas las pantallas (encabezado, pestañas, aviso de versión nueva) |

Nombres: **Inicio · Login · Crear cuenta · Mapa · Reportar · Perfil · Sugerir · Admin Puestos · Admin Garita · Admin Edificios · Todas · Simulador · Simulador Maqueta**.

- La línea con la **URL entre paréntesis**, por ejemplo `Mapa (/mapa)`, es la pantalla completa: ábrela primero.
- Las que llevan **›**, por ejemplo `Mapa › Tarjeta…`, son partes de esa pantalla.
- Cuéntalo así: «La pantalla es `app/mapa/page.js` y la arma con `MaquetaCampus`, que a su vez usa `PanelPuestos` y `TarjetaEstacionamiento`».

## 2. «¿Este archivo de qué HU es?» → sin abrirlo

- **Explorador:** a la derecha de cada archivo sale el número de su épica (`6` = HU 6.x, `9+` = varias HU).
- **Pasa el mouse** encima: dice la HU completa y el responsable.
- **Clic derecho → «¿De qué HU es este archivo?»**: lista sus HU y te deja ver los demás archivos.
- **Barra de abajo:** con un archivo abierto, dice su HU (por ejemplo «HU 6.1»). Clic para ver los demás archivos.

## 3. Buscar a mano

| Atajo | Para qué |
|---|---|
| **⌘⇧F** + `@HU-9.1` | Todos los lugares de esa HU (F4 / ⇧F4 para ir al siguiente / anterior) |
| **⌘P** + nombre | Abrir un archivo (`reglas garita`) |
| **⌘T** + nombre | Buscar una función (`validarLectura`) |
| **⌘⇧O** | Funciones del archivo abierto |

## 4. Seguir el camino dentro del código

| Atajo | Qué hace |
|---|---|
| **⌘clic** o **F12** | Ir a donde está definida la función |
| **⇧F12** | Quién usa esta función («¿dónde se conecta en el front?») |
| **⌃-** / **⌃⇧-** | Volver atrás / adelante |

## 5. El mapa (para explicar)

**⌘P → `mapa_HU`** → **⌘⇧V** (vista previa).
Cada HU tiene: tabla Front / Back / Pruebas con enlaces a la línea exacta, «Qué hace», «Por qué está organizado así» y, al final, «Preguntas típicas de la profesora».

## 6. Cómo contarlo en la defensa

1. **Qué hace la HU** (una frase, la del buscador).
2. **El camino:** pantalla → acción o API → `reglas.js` (valida) → `datos.js` (guarda) → prueba del criterio de aceptación.
3. **Por qué así:** se organiza **por tema** y no por HU porque varias HU comparten reglas y datos (la placa sirve a la 2.1 y a la 3.2); `reglas.js` decide sin tocar datos y por eso se prueba sola; `datos.js` guarda y lee.
4. **Trazabilidad:** la etiqueta `@HU-x.y` usa el mismo código que el backlog, Trello y los Issues.

Practica con **tu HU (9.1)** y con **una de otro** (por ejemplo la 3.2 de Aaron): la profesora le puede preguntar a cualquiera del equipo.
