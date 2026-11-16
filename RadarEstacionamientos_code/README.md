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
npm test           # pruebas del back (144) y del front (54)
```

Cuentas de prueba (solo existen en desarrollo, se crean al arrancar; están en `back/basedatos/datos_iniciales/usuarios_de_prueba.js`):

| Rol | Correo | Contraseña | Qué ve |
|---|---|---|---|
| Administrador | `admin.prueba@ucab.edu.ve` | `123456789` | Todo, más «Administrar» en Perfil (puestos, garita, edificios) |
| Estudiante | `estudiante.prueba@est.ucab.edu.ve` | `123456789` | Inicio, Mapa, Reportar y Perfil |
| Profesor | `profesor.prueba@ucab.edu.ve` | `123456789` | Lo mismo que el estudiante, con rol Profesor |

## Dónde está cada cosa

**¿Dónde está cada historia de usuario?** En [`docs/mapa_HU_codigo.md`](docs/mapa_HU_codigo.md): front, back y pruebas de cada HU con enlace a la línea exacta. En el código, busca la etiqueta `@HU-x.y` (por ejemplo `@HU-4.2`).

El código es **orientado a objetos y por capas** (estilo Spring MVC, con nombres en español): una
clase por archivo, con el sufijo de su capa (`IncidenciaControlador`, `IncidenciaServicio`,
`IncidenciaRepositorio`, `IncidenciaDTO`, `IncidenciaValidador`). Cada capa solo llama a la de abajo.

| Carpeta | Qué hay |
|---|---|
| `front/` | `app/` (rutas: cada `page.js` monta su vista; `app/api/**/route.js` es la ruta del back), `vistas/` («interfaz»: una por pantalla y una por mensaje), `controladores/` (valida, muestra, redirige), `validadores/` (★ **todas** las validaciones), `servicios/` (`fetch` a la API, con `ClienteHttp`), `dto/`, `modelos/` (`SesionUsuario`, `Notificacion`), `estilos/`, `public/`, `pruebas/` y `middleware.js` (revisa la sesión antes de cada pantalla) |
| `back/` | `controladores/` (precondición y respuesta HTTP; no validan), `servicios/` (reglas de negocio de cada HU), `repositorios/` (lo único que toca los datos), `dto/`, `modelos/` (atributos privados y reglas de negocio), `tacticas/` (`AutenticadorDeSensores`, `ControlDeAcceso`, `FiltroDeAvisos`, `MonitorDeSensores`), `basedatos/` (almacén en memoria y datos iniciales), `Fabrica.js` y `pruebas/` (`unidad/`, `integracion/`, `aceptacion/`) |
| `docs/` | Copia de la carpeta de lógica. **No se edita aquí**, salvo `mapa_HU_codigo.md`, que es solo del código. |

Cada carpeta tiene un `LEEME.md` con la ficha de sus componentes (nombre, requisito y responsabilidad)
y cada archivo empieza con un comentario que dice qué hace. Las etiquetas entre corchetes (`[api]`,
`[fetch]`, `[sesion]`…) sirven para buscarlas con ⌘⇧F.

### Cómo se conectan (todo pasa por la API)

```
vista ─▶ controlador (front) ─▶ validador ─▶ servicio (front) ─fetch /api/...─▶ front/app/api/.../route.js
      ─▶ controlador (back) ─▶ táctica (precondición) ─▶ servicio (back) ─▶ modelo + repositorio ─▶ basedatos
Postman y sensores ──────────────────────────────────────────────────────────▶ las mismas URL /api/...
simulador ──▶ su puente (/api/base/...) ──▶ las mismas URL /api/... (con la clave de sensores)
```

**Validación, precondición y regla de negocio.** Las validaciones de formato (correo UCAB, placa,
capacidad 1–2000…) están **solo en el front** (`front/validadores/`). El back conserva la
precondición (sesión y rol, `ControlDeAcceso`), la clave de los sensores (`AutenticadorDeSensores`) y
las reglas de negocio (lleno/vacío, solo estacionamientos abiertos, incidencia «pendiente», placa y
nombre de edificio únicos, rol según el dominio).

### Buscar en VS Code

| Quiero… | Atajo (Mac) |
|---|---|
| Buscar una palabra o etiqueta en todo el proyecto | ⌘⇧F y escribe, por ejemplo, `[fetch]` |
| Abrir un archivo por su nombre | ⌘P y escribe, por ejemplo, `sugerencia` |
| Saltar a una clase o método por su nombre en todo el proyecto | ⌘T y escribe, por ejemplo, `AforoServicio` |
| Ver las funciones del archivo abierto | ⌘⇧O |
| Ir a donde está definida una función | F12 (o ⌘ + clic) sobre su nombre |
| Ver dónde se usa una función | ⇧F12 sobre su nombre |

Etiquetas de los comentarios: `[fetch]` (el navegador llama a la API), `[api]` (un endpoint),
`[postman]` (lo prueba Postman), `[simulador]` (lo usa el simulador), `[en-vivo]` (canal en vivo),
`[sesion]` (cookie y permisos) y `[notificaciones]`. También funciona buscar `HU 7.2`.

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
| El administrador (Garita) | `GET /api/avisos` (movimientos, rechazados y estado de los sensores) · `GET /api/garita/lecturas` | 3.1, 3.2, 4.1 |
| Quien crea su cuenta o entra | `POST /api/cuenta` · `POST /api/sesion` `{ correo, contrasena }` · `GET /api/sesion` · `DELETE /api/sesion` | 1.1 |
| Un conductor (Perfil) | `GET`, `POST /api/vehiculos` · `{ placa, marca, modelo, color }` | 2.1 |
| Cualquiera / el administrador | `GET /api/edificios` · `POST`, `PATCH`, `DELETE` (administrador) · `{ nombre, ubicacion: [lat, lon] }` | 6.1 |
| Quien busca dónde estacionar | `GET /api/sugerencia?edificio=<id>` | 7.2 |
| Solo en desarrollo | `POST /api/pruebas/reiniciar` (vuelve a los datos de ejemplo) | — |

El **simulador 3D** (con su menú de pruebas y una colección de Postman lista para importar)
es un proyecto aparte: `../RadarEstacionamientos_simulador/`. Esta app no sabe que existe.
