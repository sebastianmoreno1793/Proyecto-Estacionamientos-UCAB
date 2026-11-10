# Radar de Estacionamientos UCAB — código

Aplicación web en Next.js (ver `docs/stack_y_arquitectura.md`), separada en **front** y **back**.

## Cómo correrla

**En VS Code:** abre la carpeta del repo, abre cualquier archivo `.js` y dale a **Run Code** (extensión
Code Runner) o pulsa **F5**. Las dos corren `iniciar.mjs`, que instala lo que falte, levanta la app
(http://localhost:3000) y el simulador 3D (http://localhost:3001) y abre el navegador. `Ctrl+C` apaga los dos.

**En la terminal:**

```bash
cd RadarEstacionamientos_code
npm run iniciar    # lo mismo que Run Code: app + simulador y abre el navegador
npm run dev        # solo la app, en http://localhost:3000
npm test           # pruebas del back (137) y del front (13)
```

Cuentas de prueba (solo existen en desarrollo, se crean al arrancar; están en `back/logica/usuarios/datos.js`):

| Rol | Correo | Contraseña | Qué ve |
|---|---|---|---|
| Administrador | `admin.prueba@ucab.edu.ve` | `123456789` | Todo, más «Administrar» en Perfil (puestos, garita, edificios) |
| Estudiante | `estudiante.prueba@est.ucab.edu.ve` | `123456789` | Inicio, Mapa, Reportar y Perfil |
| Profesor | `profesor.prueba@ucab.edu.ve` | `123456789` | Lo mismo que el estudiante, con rol Profesor |

## Dónde está cada cosa

**¿Dónde está cada historia de usuario?** En [`docs/mapa_HU_codigo.md`](docs/mapa_HU_codigo.md): front, back y pruebas de cada HU con enlace a la línea exacta. En el código, busca la etiqueta `@HU-x.y` (por ejemplo `@HU-4.2`).

| Carpeta | Qué hay |
|---|---|
| `back/` | Lógica y API: `api/` (un archivo por endpoint), `logica/` (reglas y datos por tema), `comun/`, `seguridad/`, `campus/` y `pruebas/` |
| `front/` | Pantallas: `app/` (solo rutas), `componentes/` (por pantalla), `acciones/` (formularios → back), `notificaciones/`, `servidor/`, `estilos/` y `public/` |
| `docs/` | Copia de la carpeta de lógica. **No se edita aquí**, salvo `mapa_HU_codigo.md`, que es solo del código. |

Cada carpeta tiene un `LEEME.md` corto, cada archivo empieza con un comentario que dice qué hace y
cada función tiene el suyo. Las etiquetas entre corchetes (`[api]`, `[fetch]`, `[sesion]`…) sirven
para buscarlas con ⌘⇧F (ver «Buscar en VS Code»).

### Cómo se conectan

```
navegador (front) ──fetch /api/...──▶ front/app/api/.../route.js ──▶ back/api/<tema>.js ──▶ back/logica/<tema>/
Postman y sensores ─────────────────▶ las mismas URL /api/...
simulador ──▶ su puente (/api/base/...) ──▶ las mismas URL /api/... (con la clave de sensores)
formularios del front ──▶ front/acciones/<tema>.js ──────────────────────▶ back/logica/<tema>/ (directo)
```

### Buscar en VS Code

| Quiero… | Atajo (Mac) |
|---|---|
| Buscar una palabra o etiqueta en todo el proyecto | ⌘⇧F y escribe, por ejemplo, `[fetch]` |
| Abrir un archivo por su nombre | ⌘P y escribe, por ejemplo, `sugerencia` |
| Saltar a una función por su nombre en todo el proyecto | ⌘T y escribe, por ejemplo, `registrarAviso` |
| Ver las funciones del archivo abierto | ⌘⇧O |
| Ir a donde está definida una función | F12 (o ⌘ + clic) sobre su nombre |
| Ver dónde se usa una función | ⇧F12 sobre su nombre |

Etiquetas de los comentarios: `[fetch]` (el navegador llama a la API), `[api]` (un endpoint),
`[postman]` (lo prueba Postman), `[simulador]` (lo usa el simulador), `[en-vivo]` (canal en vivo),
`[accion]` (un formulario llama al back), `[sesion]` (cookie y permisos), `[regla]` (valida o
calcula), `[datos]` (lee o guarda) y `[notificaciones]`. También funciona buscar `HU 7.2`.

## API (la usan los sensores, Postman y el simulador)

Lo simulado entra por el mismo camino que lo real (D-002). Copia `.env.example` como
`.env.local` si quieres otra clave de sensores (en desarrollo vale `clave-de-desarrollo`).

| Quién lo usa en la vida real | Llamada | HU |
|---|---|---|
| El sensor de un estacionamiento | `POST /api/avisos` con `x-clave-sensor` · `{ estacionamientoId, tipo: "ENTRADA" \| "SALIDA", idAviso? }` | 3.1, 4.1 |
| El lector de placas de la garita | `POST /api/garita/lecturas` con `x-clave-sensor` · `{ placa, sentido }` | 3.2 |
| Un conductor | `POST /api/incidencias` · `{ estacionamientoId, tipo }` | 9.1 |
| El administrador | `PATCH /api/estacionamientos/:id` · `{ capacidad?, activo? }` | 5.4 |
| Quien mira el mapa | `GET /api/estacionamientos` y el canal en vivo `GET /api/eventos` | 4.2, 4.3 |
| Solo en desarrollo | `POST /api/pruebas/reiniciar` (vuelve a los datos de ejemplo) | — |

El **simulador 3D** (con su menú de pruebas y una colección de Postman lista para importar)
es un proyecto aparte: `../RadarEstacionamientos_simulador/`. Esta app no sabe que existe.
