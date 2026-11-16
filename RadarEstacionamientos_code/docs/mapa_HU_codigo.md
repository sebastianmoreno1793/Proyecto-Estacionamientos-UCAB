# Mapa de las historias de usuario en el código

Dónde está cada HU del Sprint 1 (Iteración 1), archivo por archivo, y cómo explicarla. Los códigos,
nombres y responsables son los de [`backlog_y_iteraciones.md`](backlog_y_iteraciones.md) y los de los
Issues de GitHub. Cada enlace abre el archivo en la línea de su etiqueta (en la vista previa de
Markdown de VS Code: <kbd>⌘</kbd> + clic; en GitHub, clic).

> Este mapa sale de las etiquetas `@HU-x.y` del código: **una línea por archivo**, con lo que dice su
> etiqueta. Si agregas un archivo a una HU, ponle la etiqueta en la primera línea y actualiza este mapa.

## Cómo buscar una HU en segundos

- **Etiqueta fija en el código:** `@HU-3.2` (sin espacio y con guion). Está en la primera línea de
  cada archivo que implementa la HU y encima de cada clase o método principal:
  `// @HU-3.2 Simular sensores y placas · Aaron — qué hace este archivo`.
- **Terminal** (en `RadarEstacionamientos_code/`): `grep -rn "@HU-3.2" front back --exclude-dir=node_modules`.
- **VS Code:** la extensión *Todo Tree* agrupa las etiquetas por HU; `.vscode/HU.code-search` es una
  búsqueda guardada de `@HU-` agrupada por archivo.

## Cómo está organizado (vale para todas las HU)

Orientado a objetos y por capas, igual en el front y en el back (una clase por archivo, con el sufijo
de su capa). Un caso de uso con pantalla recorre:

```
FRONT  vistas/ (interfaz) → controladores/ (+valida +muestra +redirige) → validadores/ → servicios/ (fetch) + dto/
         ── fetch /api/... ──▶
BACK   front/app/api/**/route.js (la ruta) → controladores/ → tacticas/ (precondición) → servicios/
         → modelos/ (reglas de negocio) + repositorios/ → basedatos/        ← dto/ (respuesta)
```

| Qué es | Dónde va |
|---|---|
| **Validación** (formato de lo que escribe el usuario) | Front: `validadores/` |
| **Precondición** (sesión, rol) y clave de los sensores | Back: `tacticas/ControlDeAcceso`, `tacticas/AutenticadorDeSensores` |
| **Regla de negocio** (lleno/vacío, solo abiertos, «pendiente», únicos…) | Back: `modelos/` y `servicios/` |
| **Disponibilidad** (avisos defectuosos, sensor que no avisa) | Back: `tacticas/FiltroDeAvisos`, `tacticas/MonitorDeSensores` |

| HU | Responsable | Issue |
|---|---|---|
| [1.1](#hu-11--crear-cuenta-con-el-correo-institucional) Crear cuenta con el correo institucional | Samuel | [#1](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/1) |
| [2.1](#hu-21--registrar-mis-vehículos) Registrar mis vehículos | Samuel | [#14](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/14) |
| [3.1](#hu-31--recibir-avisos-de-entrada-y-salida) Recibir avisos de entrada y salida | Aaron | [#3](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/3) |
| [3.2](#hu-32--simular-sensores-y-placas) Simular sensores y placas | Aaron | [#4](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/4) |
| [4.1](#hu-41--actualizar-el-aforo-con-cada-entrada-o-salida) Actualizar el aforo con cada entrada o salida | Aaron | [#5](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/5) |
| [4.2](#hu-42--consultar-el-semáforo-de-ocupación) Consultar el semáforo de ocupación | Aaron | [#6](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/6) |
| [5.1](#hu-51--consultar-los-estacionamientos-en-el-mapa-del-campus) Consultar los estacionamientos en el mapa del campus | German | [#7](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/7) |
| [5.4](#hu-54--modificar-la-capacidad-y-el-estado-de-un-estacionamiento) Modificar la capacidad y el estado de un estacionamiento | Sebastian | [#12](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/12) |
| [6.1](#hu-61--registrar-y-actualizar-el-catálogo-de-edificios-ucab) Registrar y actualizar el catálogo de edificios UCAB | German | [#8](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/8) |
| [7.2](#hu-72--sugerir-el-estacionamiento-libre-más-cercano) Sugerir el estacionamiento libre más cercano | Manuel | [#9](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/9) |
| [8.1](#hu-81--activar-las-notificaciones) Activar las notificaciones | Manuel | [#10](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/10) |
| [9.1](#hu-91--crear-una-incidencia) Crear una incidencia | Sebastian | [#11](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/11) |

---

## HU 1.1 · Crear cuenta con el correo institucional

**Responsable:** Samuel · **Issue:** [#1](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/1) · **Etiqueta:** `@HU-1.1`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/cuenta/route.js#L1) | Dirección web POST /api/cuenta para crear la cuenta |
| Ruta (API) | [route.js](../front/app/api/sesion/route.js#L1) | Dirección web /api/sesion para entrar, salir y saber quién está conectado |
| Front · pantalla | [page.js](../front/app/entrar/page.js#L2) | Pantalla «Entrar» para iniciar sesión con el correo UCAB |
| Front · pantalla | [page.js](../front/app/perfil/page.js#L3) | Pantalla Perfil con el botón «Salir» |
| Front · pantalla | [page.js](../front/app/registro/page.js#L2) | Pantalla «Crear cuenta» |
| Front · navegación | [middleware.js](../front/middleware.js#L1) | Antes de cada pantalla revisa la sesión (y el rol en /admin) |
| Front · vista | [FormularioCuenta.js](../front/vistas/cuenta/FormularioCuenta.js#L4) | Formulario de correo y contraseña; muestra los mensajes del escenario |
| Front · vista | [PantallaPerfil.js](../front/vistas/perfil/PantallaPerfil.js#L5) | Botón «Salir» en Perfil para cerrar la sesión |
| Front · controlador | [CuentaControlador.js](../front/controladores/CuentaControlador.js#L1) | Control de Crear cuenta, Entrar y Salir: valida, llama a la API y lleva al mapa |
| Front · controlador | [NavegacionControlador.js](../front/controladores/NavegacionControlador.js#L1) | Antes de mostrar una pantalla, revisa que haya sesión (y rol de administrador en /admin) |
| Front · validador | [CuentaValidador.js](../front/validadores/CuentaValidador.js#L1) | Revisa el correo UCAB, la contraseña de 8 o más y que coincidan, con los mensajes del escenario |
| Front · servicio | [CuentaServicio.js](../front/servicios/CuentaServicio.js#L1) | Crea la cuenta, entra, sale y pregunta quién está conectado (fetch) |
| Front · DTO | [CuentaDTO.js](../front/dto/CuentaDTO.js#L1) | Lo que manda Crear cuenta o Entrar: correo y contraseña |
| Front · modelo | [SesionUsuario.js](../front/modelos/SesionUsuario.js#L1) | Quién está usando la app: correo, rol e iniciales del perfil |
| Back · controlador | [CuentaControlador.js](../back/controladores/CuentaControlador.js#L1) | Crea la cuenta, entra, sale y dice quién está conectado (pone y borra la cookie) |
| Back · táctica | [ControlDeAcceso.js](../back/tacticas/ControlDeAcceso.js#L1) | Revisa que la petición venga de alguien con sesión iniciada y con qué rol |
| Back · servicio | [CuentaServicio.js](../back/servicios/CuentaServicio.js#L1) | Crea la cuenta (sin repetir el correo), entra, sale y dice de quién es cada sesión |
| Back · DTO | [CredencialesDTO.js](../back/dto/CredencialesDTO.js#L1) | Correo y contraseña que llegan de Crear cuenta o de Entrar |
| Back · DTO | [UsuarioDTO.js](../back/dto/UsuarioDTO.js#L1) | El usuario tal como sale por la API: correo y rol, nunca la contraseña |
| Back · modelo | [Sesion.js](../back/modelos/Sesion.js#L1) | La sesión abierta: un código secreto (la cookie radar_sesion) y de quién es |
| Back · modelo | [Usuario.js](../back/modelos/Usuario.js#L1) | La cuenta: correo, rol que sale del dominio y contraseña cifrada |
| Back · repositorio | [SesionRepositorio.js](../back/repositorios/SesionRepositorio.js#L1) | Guarda las sesiones abiertas |
| Back · repositorio | [UsuarioRepositorio.js](../back/repositorios/UsuarioRepositorio.js#L1) | Guarda las cuentas (correo, rol y contraseña cifrada) |
| Back · datos | [usuarios_de_prueba.js](../back/basedatos/datos_iniciales/usuarios_de_prueba.js#L1) | Las tres cuentas de prueba (administrador, estudiante y profesor) |
| Pruebas (front) | [CuentaControlador.test.js](../front/pruebas/controladores/CuentaControlador.test.js#L1) | Prueba el control de Crear cuenta, Entrar y Salir |
| Pruebas (front) | [NavegacionControlador.test.js](../front/pruebas/controladores/NavegacionControlador.test.js#L1) | Prueba adónde se redirige según la sesión y el rol |
| Pruebas (front) | [CuentaValidador.test.js](../front/pruebas/validadores/CuentaValidador.test.js#L1) | Prueba la validación de Crear cuenta y Entrar, con los mensajes del escenario |
| Pruebas de unidad | [ControlDeAcceso.test.js](../back/pruebas/unidad/ControlDeAcceso.test.js#L1) | Prueba la precondición: sesión y rol |
| Pruebas de unidad | [CuentaServicio.test.js](../back/pruebas/unidad/CuentaServicio.test.js#L1) | Prueba crear cuenta, entrar, la sesión y las cuentas de prueba |
| Pruebas de unidad | [Usuario.test.js](../back/pruebas/unidad/Usuario.test.js#L1) | Prueba el rol según el dominio y la contraseña cifrada |
| Pruebas de integración | [api.test.js](../back/pruebas/integracion/api.test.js#L1) | Prueba /api/cuenta y /api/sesion (cookie) |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L1) | Prueba el criterio de aceptación de Crear cuenta |

**Qué hace.** Solo la comunidad UCAB crea cuenta. El **front** valida en el orden del diagrama (`CuentaValidador`: dominio 7.1, contraseña de 8 en 8.1, coinciden 9.1) y muestra el mensaje del escenario; el **back** aplica las reglas de negocio: el rol sale del dominio (sin dominio UCAB no hay cuenta, D-003) y el correo no se repite (10.1). Al crear la cuenta se abre la sesión (cookie httpOnly) y va al mapa. `ControlDeAcceso` (precondición) y `middleware.js` piden sesión en el resto de la app.

---

## HU 2.1 · Registrar mis vehículos

**Responsable:** Samuel · **Issue:** [#14](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/14) · **Etiqueta:** `@HU-2.1`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/vehiculos/route.js#L1) | Dirección web /api/vehiculos para «Mis vehículos» |
| Front · pantalla | [page.js](../front/app/perfil/page.js#L2) | Pantalla Perfil con «Mis vehículos» |
| Front · vista | [FormularioVehiculo.js](../front/vistas/perfil/FormularioVehiculo.js#L3) | Formulario para escribir la placa y agregar el vehículo |
| Front · vista | [MensajeVehiculoRegistrado.js](../front/vistas/perfil/MensajeVehiculoRegistrado.js#L1) | Mensaje «Vehículo AB123CD registrado.» |
| Front · vista | [PantallaPerfil.js](../front/vistas/perfil/PantallaPerfil.js#L3) | Sección «Mis vehículos» dentro de Perfil |
| Front · controlador | [VehiculoControlador.js](../front/controladores/VehiculoControlador.js#L1) | Control de Mis vehículos: valida la placa y los datos y manda el vehículo |
| Front · validador | [VehiculoValidador.js](../front/validadores/VehiculoValidador.js#L1) | Revisa la placa (6 o 7 letras y números) y que estén marca, modelo y color |
| Front · servicio | [VehiculoServicio.js](../front/servicios/VehiculoServicio.js#L1) | Pide mis vehículos y registra uno nuevo (fetch) |
| Front · DTO | [VehiculoDTO.js](../front/dto/VehiculoDTO.js#L1) | Lo que manda el formulario de Mis vehículos |
| Back · controlador | [VehiculoControlador.js](../back/controladores/VehiculoControlador.js#L1) | Lista los vehículos del usuario con sesión y registra uno nuevo |
| Back · servicio | [VehiculoServicio.js](../back/servicios/VehiculoServicio.js#L1) | Registra el vehículo a nombre del usuario; la placa no se repite en el Radar |
| Back · DTO | [VehiculoDTO.js](../back/dto/VehiculoDTO.js#L1) | Lo que llega del formulario y lo que ve el dueño |
| Back · modelo | [Placa.js](../back/modelos/Placa.js#L1) | La placa se guarda en mayúsculas y sin espacios ni guiones |
| Back · modelo | [Vehiculo.js](../back/modelos/Vehiculo.js#L1) | Un vehículo a nombre de su dueño, con la placa normalizada |
| Back · repositorio | [VehiculoRepositorio.js](../back/repositorios/VehiculoRepositorio.js#L1) | Guarda los vehículos de cada usuario |
| Pruebas (front) | [AdministracionControladores.test.js](../front/pruebas/controladores/AdministracionControladores.test.js#L1) | Prueba el control de Mis vehículos |
| Pruebas (front) | [VehiculoValidador.test.js](../front/pruebas/validadores/VehiculoValidador.test.js#L1) | Prueba la validación de la placa y los datos del vehículo |
| Pruebas de unidad | [Vehiculo.test.js](../back/pruebas/unidad/Vehiculo.test.js#L1) | Prueba la placa normalizada y el dueño |
| Pruebas de unidad | [VehiculoServicio.test.js](../back/pruebas/unidad/VehiculoServicio.test.js#L1) | Prueba registrar vehículos, que cada quien vea los suyos y que la placa no se repita |
| Pruebas de integración | [api.test.js](../back/pruebas/integracion/api.test.js#L2) | Prueba /api/vehiculos |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L2) | Prueba el criterio de aceptación de Mis vehículos |

**Qué hace.** En Perfil, el usuario registra uno o varios vehículos. `VehiculoValidador` (front) revisa la placa (6 o 7 letras y números) y los datos; el back guarda la placa normalizada (`Placa`, la misma que usa la garita) y no deja repetirla (`VehiculoServicio`). Cada quien ve solo los suyos.

---

## HU 3.1 · Recibir avisos de entrada y salida

**Responsable:** Aaron · **Issue:** [#3](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/3) · **Etiqueta:** `@HU-3.1`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/avisos/route.js#L1) | Dirección web /api/avisos: aquí llegan los avisos de los sensores |
| Front · pantalla | [page.js](../front/app/admin/garita/page.js#L2) | Pantalla de la garita: avisos recibidos |
| Front · vista | [PantallaGarita.js](../front/vistas/admin/PantallaGarita.js#L3) | Lista de avisos recibidos y sensores que dejaron de avisar |
| Front · controlador | [GaritaControlador.js](../front/controladores/GaritaControlador.js#L1) | Control de Administrar › Garita: trae los avisos y el estado de los sensores |
| Front · servicio | [GaritaServicio.js](../front/servicios/GaritaServicio.js#L1) | Pide los avisos recibidos y el estado de los sensores (fetch) |
| Back · controlador | [AvisoControlador.js](../back/controladores/AvisoControlador.js#L1) | Recibe los avisos de los sensores (POST /api/avisos) y lista los recibidos (GET) |
| Back · táctica | [AutenticadorDeSensores.js](../back/tacticas/AutenticadorDeSensores.js#L1) | Solo quien tiene la clave de los sensores puede avisar entradas y salidas |
| Back · táctica | [MonitorDeSensores.js](../back/tacticas/MonitorDeSensores.js#L1) | Detecta el sensor que dejó de avisar (timeout) |
| Back · servicio | [AforoServicio.js](../back/servicios/AforoServicio.js#L1) | Registra cada entrada o salida con su hora |
| Back · DTO | [AvisoDTO.js](../back/dto/AvisoDTO.js#L1) | Lo que manda el sensor: estacionamiento, ENTRADA o SALIDA e id del aviso |
| Back · DTO | [MovimientoDTO.js](../back/dto/MovimientoDTO.js#L1) | Un movimiento aceptado tal como sale por la API |
| Back · modelo | [Movimiento.js](../back/modelos/Movimiento.js#L1) | Una entrada o salida aceptada, con su hora |
| Back · repositorio | [MovimientoRepositorio.js](../back/repositorios/MovimientoRepositorio.js#L1) | Guarda cada entrada o salida aceptada |
| Pruebas de unidad | [AforoServicio.test.js](../back/pruebas/unidad/AforoServicio.test.js#L1) | Prueba que cada aviso quede registrado con su hora |
| Pruebas de unidad | [AutenticadorDeSensores.test.js](../back/pruebas/unidad/AutenticadorDeSensores.test.js#L1) | Prueba la táctica que autentica a los sensores |
| Pruebas de unidad | [MonitorDeSensores.test.js](../back/pruebas/unidad/MonitorDeSensores.test.js#L1) | Prueba la táctica de timeout del sensor que deja de avisar |
| Pruebas de integración | [api.test.js](../back/pruebas/integracion/api.test.js#L3) | Prueba POST y GET /api/avisos |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L3) | Prueba el criterio de aceptación de los avisos de los sensores |

**Qué hace.** Cada sensor manda «entró» o «salió» a `POST /api/avisos` con su clave (`AutenticadorDeSensores`) y queda registrado con la hora (`Movimiento`). El simulador y Postman entran por el mismo camino (D-002). `MonitorDeSensores` (táctica de timeout) marca el sensor que deja de avisar.

---

## HU 3.2 · Simular sensores y placas

**Responsable:** Aaron · **Issue:** [#4](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/4) · **Etiqueta:** `@HU-3.2`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/garita/lecturas/route.js#L1) | Dirección web /api/garita/lecturas para las placas |
| Front · pantalla | [page.js](../front/app/admin/garita/page.js#L3) | Pantalla de la garita: placas leídas |
| Front · vista | [PantallaGarita.js](../front/vistas/admin/PantallaGarita.js#L4) | Placas leídas |
| Front · controlador | [GaritaControlador.js](../front/controladores/GaritaControlador.js#L2) | Trae las placas leídas |
| Front · servicio | [GaritaServicio.js](../front/servicios/GaritaServicio.js#L2) | Pide las placas leídas (fetch) |
| Back · controlador | [GaritaControlador.js](../back/controladores/GaritaControlador.js#L1) | Recibe las placas del lector de la garita (POST) y las lista al administrador (GET) |
| Back · táctica | [AutenticadorDeSensores.js](../back/tacticas/AutenticadorDeSensores.js#L2) | Solo el lector de placas (o el simulador) con la clave puede mandar placas |
| Back · servicio | [GaritaServicio.js](../back/servicios/GaritaServicio.js#L1) | Registra cada placa leída en la garita sin duplicar los reintentos |
| Back · DTO | [LecturaDePlacaDTO.js](../back/dto/LecturaDePlacaDTO.js#L1) | Lo que manda el lector de la garita y lo que se devuelve |
| Back · modelo | [LecturaDePlaca.js](../back/modelos/LecturaDePlaca.js#L1) | Una placa leída en la garita, con su sentido y su hora |
| Back · modelo | [Placa.js](../back/modelos/Placa.js#L2) | La garita guarda la placa igual que «Mis vehículos» |
| Back · repositorio | [LecturaDePlacaRepositorio.js](../back/repositorios/LecturaDePlacaRepositorio.js#L1) | Guarda las placas leídas en la garita |
| Pruebas de unidad | [AutenticadorDeSensores.test.js](../back/pruebas/unidad/AutenticadorDeSensores.test.js#L2) | Prueba que el lector de placas (y el simulador) necesite la clave |
| Pruebas de unidad | [GaritaServicio.test.js](../back/pruebas/unidad/GaritaServicio.test.js#L1) | Prueba que la placa leída quede con su hora y no se duplique |
| Pruebas de unidad | [Vehiculo.test.js](../back/pruebas/unidad/Vehiculo.test.js#L2) | La garita guarda la placa igual que «Mis vehículos» |
| Pruebas de integración | [api.test.js](../back/pruebas/integracion/api.test.js#L4) | Prueba /api/garita/lecturas |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L4) | Prueba el criterio de aceptación del lector de placas |

**Qué hace.** El lector de la garita manda la placa a `POST /api/garita/lecturas`; se guarda normalizada con su sentido y hora, sin duplicar reintentos. Las placas solo las ve el administrador y nunca van al canal en vivo. El simulador (proyecto aparte) usa la misma API.

---

## HU 4.1 · Actualizar el aforo con cada entrada o salida

**Responsable:** Aaron · **Issue:** [#5](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/5) · **Etiqueta:** `@HU-4.1`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/avisos/route.js#L2) | Dirección web /api/avisos que actualiza el aforo |
| Front · pantalla | [page.js](../front/app/admin/garita/page.js#L4) | Pantalla de la garita: avisos rechazados |
| Front · vista | [PantallaGarita.js](../front/vistas/admin/PantallaGarita.js#L5) | Avisos rechazados, por qué, y sensores con falla |
| Front · controlador | [GaritaControlador.js](../front/controladores/GaritaControlador.js#L3) | Trae los avisos rechazados |
| Front · servicio | [GaritaServicio.js](../front/servicios/GaritaServicio.js#L3) | Pide los avisos rechazados (fetch) |
| Back · controlador | [AvisoControlador.js](../back/controladores/AvisoControlador.js#L2) | Con cada aviso, actualiza el aforo; los rechazados responden 404 o 409 |
| Back · táctica | [FiltroDeAvisos.js](../back/tacticas/FiltroDeAvisos.js#L1) | Ignora los avisos defectuosos sin detener el sistema y los registra; con N seguidos marca el sensor con falla |
| Back · servicio | [AforoServicio.js](../back/servicios/AforoServicio.js#L2) | Con cada aviso suma o resta un ocupado, pasando por el filtro de avisos |
| Back · DTO | [AvisoRechazadoDTO.js](../back/dto/AvisoRechazadoDTO.js#L1) | Un aviso rechazado tal como lo ve el administrador |
| Back · modelo | [AvisoRechazado.js](../back/modelos/AvisoRechazado.js#L1) | Un aviso que no cambió el aforo, con su hora y su motivo |
| Back · modelo | [Estacionamiento.js](../back/modelos/Estacionamiento.js#L1) | Una entrada ocupa un puesto y una salida lo libera; nunca menos de 0 ni más que la capacidad |
| Back · repositorio | [AvisoRechazadoRepositorio.js](../back/repositorios/AvisoRechazadoRepositorio.js#L1) | Guarda los avisos rechazados y las anomalías |
| Back · repositorio | [EstacionamientoRepositorio.js](../back/repositorios/EstacionamientoRepositorio.js#L1) | Lee y guarda el aforo de cada estacionamiento |
| Pruebas de unidad | [AforoServicio.test.js](../back/pruebas/unidad/AforoServicio.test.js#L2) | Prueba que el aforo cambie y que los rechazos no lo cambien |
| Pruebas de unidad | [Estacionamiento.test.js](../back/pruebas/unidad/Estacionamiento.test.js#L1) | Prueba que el aforo suba y baje sin salirse de 0 y la capacidad |
| Pruebas de unidad | [FiltroDeAvisos.test.js](../back/pruebas/unidad/FiltroDeAvisos.test.js#L1) | Prueba la táctica que ignora los avisos defectuosos y marca el sensor con falla |
| Pruebas de integración | [api.test.js](../back/pruebas/integracion/api.test.js#L5) | Prueba los códigos de los avisos rechazados |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L5) | Prueba el criterio de aceptación del aforo |

**Qué hace.** `AforoServicio` pasa cada aviso por `FiltroDeAvisos` (táctica: ignorar comportamiento defectuoso) y aplica la regla del modelo `Estacionamiento` (`registrarEntrada()` / `registrarSalida()`): nunca menos de 0 ni más que la capacidad. Lo imposible (lleno, vacío) no cambia el aforo, queda registrado como anomalía y, con 3 seguidos, el sensor queda «con falla».

---

## HU 4.2 · Consultar el semáforo de ocupación

**Responsable:** Aaron · **Issue:** [#6](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/6) · **Etiqueta:** `@HU-4.2`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/estacionamientos/route.js#L1) | Dirección web GET /api/estacionamientos con la ocupación y el semáforo |
| Front · pantalla | [page.js](../front/app/mapa/page.js#L3) | Pantalla Mapa con el semáforo de cada estacionamiento |
| Front · pantalla | [page.js](../front/app/page.js#L2) | Pantalla Inicio con el semáforo de cada estacionamiento |
| Front · vista | [ColoresSemaforo.js](../front/vistas/comunes/ColoresSemaforo.js#L1) | Colores del semáforo: verde «Hay puesto», rojo «No hay puesto» y gris «Cerrado» (D-007, D-009) |
| Front · vista | [Inicio.js](../front/vistas/inicio/Inicio.js#L3) | Rejilla de Inicio con libres y estado de cada estacionamiento |
| Front · vista | [MaquetaCampus.js](../front/vistas/mapa/MaquetaCampus.js#L4) | En el mapa, muestra libres y el estado en texto |
| Front · vista | [PanelPuestos.js](../front/vistas/mapa/PanelPuestos.js#L3) | Lista «¿Dónde hay puesto?» al lado del mapa |
| Front · controlador | [EstacionamientoControlador.js](../front/controladores/EstacionamientoControlador.js#L1) | Control del mapa y del Inicio: trae los estacionamientos y los mantiene en vivo |
| Front · servicio | [EstacionamientoServicio.js](../front/servicios/EstacionamientoServicio.js#L1) | Pide los estacionamientos con sus libres y su semáforo (fetch) |
| Front · DTO | [EstacionamientoDTO.js](../front/dto/EstacionamientoDTO.js#L1) | Lo que el front recibe de cada estacionamiento: libres, porcentaje y semáforo |
| Back · controlador | [EstacionamientoControlador.js](../back/controladores/EstacionamientoControlador.js#L1) | Entrega la ocupación y el semáforo de cada estacionamiento (GET) |
| Back · servicio | [EstacionamientoServicio.js](../back/servicios/EstacionamientoServicio.js#L1) | Entrega cada estacionamiento con sus libres y su semáforo |
| Back · DTO | [EstacionamientoDTO.js](../back/dto/EstacionamientoDTO.js#L1) | Lo que cualquiera puede ver: libres, porcentaje y semáforo, sin datos personales |
| Back · modelo | [Estacionamiento.js](../back/modelos/Estacionamiento.js#L2) | Calcula los libres, el porcentaje y el semáforo |
| Back · modelo | [Semaforo.js](../back/modelos/Semaforo.js#L1) | Los tres estados del semáforo: «Hay puesto», «No hay puesto» y «Cerrado» (D-009) |
| Pruebas de unidad | [Estacionamiento.test.js](../back/pruebas/unidad/Estacionamiento.test.js#L2) | Prueba libres, porcentaje y semáforo |
| Pruebas de unidad | [EstacionamientoServicio.test.js](../back/pruebas/unidad/EstacionamientoServicio.test.js#L1) | Prueba la lista con libres y semáforo |
| Pruebas de unidad | [Semaforo.test.js](../back/pruebas/unidad/Semaforo.test.js#L1) | Prueba los tres estados y sus textos (D-009) |
| Pruebas de integración | [api.test.js](../back/pruebas/integracion/api.test.js#L6) | Prueba GET /api/estacionamientos |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L6) | Prueba el criterio de aceptación del semáforo |

**Qué hace.** El modelo `Semaforo` decide (D-009): verde «Hay puesto» con al menos un libre, rojo «No hay puesto» sin libres, gris «Cerrado». Viaja en `EstacionamientoDTO.semaforo`; el front solo elige los colores (`ColoresSemaforo`).

---

## HU 5.1 · Consultar los estacionamientos en el mapa del campus

**Responsable:** German · **Issue:** [#7](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/7) · **Etiqueta:** `@HU-5.1`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/estacionamientos/route.js#L2) | Dirección web GET /api/estacionamientos para dibujar el mapa |
| Front · pantalla | [page.js](../front/app/mapa/page.js#L2) | Pantalla Mapa del campus |
| Front · vista | [MaquetaCampus.js](../front/vistas/mapa/MaquetaCampus.js#L3) | Dibuja el mapa con el nombre de cada estacionamiento |
| Back · controlador | [EstacionamientoControlador.js](../back/controladores/EstacionamientoControlador.js#L2) | Con su forma para dibujarlos (GET) |
| Back · servicio | [EstacionamientoServicio.js](../back/servicios/EstacionamientoServicio.js#L2) | Con la forma para dibujarlos |
| Back · DTO | [EstacionamientoDTO.js](../back/dto/EstacionamientoDTO.js#L2) | Con la forma (polígono y pisos) para dibujarlo |
| Back · modelo | [Estacionamiento.js](../back/modelos/Estacionamiento.js#L3) | Guarda la forma (polígono y pisos) para dibujarlo |
| Back · datos | [capacidad_inicial.js](../back/basedatos/datos_iniciales/capacidad_inicial.js#L1) | Capacidad de ejemplo (todavía no real) de cada estacionamiento |
| Back · datos | [estacionamientos.js](../back/basedatos/datos_iniciales/estacionamientos.js#L1) | Catálogo de estacionamientos del campus que se dibujan en el mapa |
| Pruebas de unidad | [DatosIniciales.test.js](../back/pruebas/unidad/DatosIniciales.test.js#L1) | Prueba que la lista sirva para dibujar el mapa |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L7) | Prueba el criterio de aceptación del mapa |

**Qué hace.** `GET /api/estacionamientos` entrega cada estacionamiento con su polígono; `MaquetaCampus` lo dibuja sobre la maqueta y se actualiza por el canal en vivo.

---

## HU 5.4 · Modificar la capacidad y el estado de un estacionamiento

**Responsable:** Sebastian · **Issue:** [#12](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/12) · **Etiqueta:** `@HU-5.4`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/estacionamientos/[id]/route.js#L1) | Dirección web PATCH /api/estacionamientos/:id |
| Front · pantalla | [page.js](../front/app/admin/puestos/page.js#L2) | Pantalla Administrar › Puestos |
| Front · vista | [FilaPuesto.js](../front/vistas/admin/FilaPuesto.js#L3) | Fila de un estacionamiento con su capacidad y el interruptor «Activo» |
| Front · vista | [MensajeCambiosGuardados.js](../front/vistas/admin/MensajeCambiosGuardados.js#L1) | Mensaje «Cambios guardados.» |
| Front · vista | [PantallaPuestos.js](../front/vistas/admin/PantallaPuestos.js#L3) | Pantalla Administrar › Puestos |
| Front · controlador | [EstacionamientoControlador.js](../front/controladores/EstacionamientoControlador.js#L2) | Control de Administrar › Puestos: valida y guarda capacidad y estado |
| Front · validador | [CapacidadValidador.js](../front/validadores/CapacidadValidador.js#L1) | Revisa que la capacidad sea un entero entre 1 y 2000 y que «activo» sea sí o no |
| Front · servicio | [EstacionamientoServicio.js](../front/servicios/EstacionamientoServicio.js#L2) | Manda la capacidad y el estado nuevos (fetch PATCH) |
| Front · DTO | [CambioDeEstacionamientoDTO.js](../front/dto/CambioDeEstacionamientoDTO.js#L1) | Lo que manda el administrador: capacidad y abierto o cerrado |
| Back · controlador | [EstacionamientoControlador.js](../back/controladores/EstacionamientoControlador.js#L3) | Recibe el cambio de capacidad o estado (PATCH, solo administrador) |
| Back · servicio | [EstacionamientoServicio.js](../back/servicios/EstacionamientoServicio.js#L3) | Cambia la capacidad y abre o cierra |
| Back · DTO | [EstacionamientoDTO.js](../back/dto/EstacionamientoDTO.js#L3) | Los cambios que manda el administrador |
| Back · modelo | [Estacionamiento.js](../back/modelos/Estacionamiento.js#L4) | Cambia la capacidad y abre o cierra; si la capacidad queda por debajo de los ocupados, hay 0 libres |
| Back · repositorio | [EstacionamientoRepositorio.js](../back/repositorios/EstacionamientoRepositorio.js#L2) | Guarda la capacidad nueva y si está abierto |
| Pruebas (front) | [AdministracionControladores.test.js](../front/pruebas/controladores/AdministracionControladores.test.js#L2) | Prueba el control de Administrar › Puestos |
| Pruebas (front) | [CapacidadValidador.test.js](../front/pruebas/validadores/CapacidadValidador.test.js#L1) | Prueba la validación de la capacidad nueva y de «activo» |
| Pruebas de unidad | [Estacionamiento.test.js](../back/pruebas/unidad/Estacionamiento.test.js#L3) | Prueba la capacidad nueva y abrir o cerrar |
| Pruebas de unidad | [EstacionamientoServicio.test.js](../back/pruebas/unidad/EstacionamientoServicio.test.js#L2) | Prueba cambiar capacidad y abrir o cerrar |
| Pruebas de integración | [api.test.js](../back/pruebas/integracion/api.test.js#L7) | Prueba PATCH /api/estacionamientos/:id |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L8) | Prueba el criterio de aceptación de capacidad y estado |

**Qué hace.** El administrador cambia la capacidad y abre o cierra. `CapacidadValidador` (front) pide un entero de 1 a 2000; el back revisa la precondición (administrador) y el modelo aplica la regla: si la capacidad queda por debajo de los ocupados, hay 0 libres. Un cerrado no se sugiere ni se reporta.

---

## HU 6.1 · Registrar y actualizar el catálogo de edificios UCAB

**Responsable:** German · **Issue:** [#8](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/8) · **Etiqueta:** `@HU-6.1`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/edificios/[id]/route.js#L1) | Dirección web /api/edificios/:id para modificar y quitar |
| Ruta (API) | [route.js](../front/app/api/edificios/route.js#L1) | Dirección web /api/edificios para el catálogo |
| Front · pantalla | [page.js](../front/app/admin/edificios/page.js#L2) | Pantalla Administrar › Edificios |
| Front · vista | [CamposEdificio.js](../front/vistas/admin/CamposEdificio.js#L2) | Campos de nombre y ubicación que usan los formularios de edificio |
| Front · vista | [FilaEdificio.js](../front/vistas/admin/FilaEdificio.js#L3) | Fila de un edificio con los botones Guardar y Quitar |
| Front · vista | [NuevoEdificio.js](../front/vistas/admin/NuevoEdificio.js#L3) | Formulario para agregar un edificio nuevo |
| Front · vista | [PantallaEdificios.js](../front/vistas/admin/PantallaEdificios.js#L3) | Pantalla Administrar › Edificios |
| Front · vista | [SelectorEdificio.js](../front/vistas/comunes/SelectorEdificio.js#L2) | Lista de edificios que ve el usuario para elegir |
| Front · controlador | [EdificioControlador.js](../front/controladores/EdificioControlador.js#L1) | Control de Administrar › Edificios: valida y manda agregar, modificar o quitar |
| Front · validador | [EdificioValidador.js](../front/validadores/EdificioValidador.js#L1) | Revisa el nombre (con letras, 2 a 80) y que la ubicación esté dentro del campus |
| Front · servicio | [EdificioServicio.js](../front/servicios/EdificioServicio.js#L1) | Pide el catálogo y manda agregar, modificar o quitar (fetch) |
| Front · DTO | [EdificioDTO.js](../front/dto/EdificioDTO.js#L1) | Lo que manda el administrador: nombre y ubicación |
| Back · controlador | [EdificioControlador.js](../back/controladores/EdificioControlador.js#L1) | Lista el catálogo (GET) y deja al administrador agregar, modificar y quitar |
| Back · servicio | [EdificioServicio.js](../back/servicios/EdificioServicio.js#L1) | Agrega, modifica y quita edificios; el nombre no se repite |
| Back · DTO | [EdificioDTO.js](../back/dto/EdificioDTO.js#L1) | Lo que manda el administrador y lo que ve el usuario |
| Back · modelo | [Edificio.js](../back/modelos/Edificio.js#L1) | Un edificio del catálogo: nombre, ubicación e id que no se repite |
| Back · repositorio | [EdificioRepositorio.js](../back/repositorios/EdificioRepositorio.js#L1) | Guarda el catálogo de edificios |
| Back · datos | [edificios.js](../back/basedatos/datos_iniciales/edificios.js#L1) | Lista inicial de edificios de la UCAB |
| Pruebas (front) | [AdministracionControladores.test.js](../front/pruebas/controladores/AdministracionControladores.test.js#L3) | Prueba el control de Administrar › Edificios |
| Pruebas (front) | [EdificioValidador.test.js](../front/pruebas/validadores/EdificioValidador.test.js#L1) | Prueba la validación del nombre y la ubicación del edificio |
| Pruebas de unidad | [DatosIniciales.test.js](../back/pruebas/unidad/DatosIniciales.test.js#L2) | Prueba el catálogo inicial de edificios |
| Pruebas de unidad | [Edificio.test.js](../back/pruebas/unidad/Edificio.test.js#L1) | Prueba el id, el nombre normalizado y los cambios |
| Pruebas de unidad | [EdificioServicio.test.js](../back/pruebas/unidad/EdificioServicio.test.js#L1) | Prueba agregar, modificar y quitar; el nombre no se repite |
| Pruebas de integración | [api.test.js](../back/pruebas/integracion/api.test.js#L8) | Prueba /api/edificios |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L9) | Prueba el criterio de aceptación del catálogo de edificios |

**Qué hace.** El administrador agrega, modifica y quita edificios. `EdificioValidador` (front) revisa el nombre y que la ubicación esté en el campus; `EdificioServicio` (back) no deja repetir el nombre. La misma lista la ve el usuario (chips del Inicio y Sugerir).

---

## HU 7.2 · Sugerir el estacionamiento libre más cercano

**Responsable:** Manuel · **Issue:** [#9](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/9) · **Etiqueta:** `@HU-7.2`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/sugerencia/route.js#L1) | Dirección web GET /api/sugerencia |
| Front · pantalla | [page.js](../front/app/page.js#L3) | Pantalla Inicio con el atajo «Más cerca» |
| Front · pantalla | [page.js](../front/app/sugerencia/page.js#L2) | Pantalla Sugerir |
| Front · vista | [SelectorEdificio.js](../front/vistas/comunes/SelectorEdificio.js#L3) | Lista de edificios para pedir la sugerencia |
| Front · vista | [Inicio.js](../front/vistas/inicio/Inicio.js#L4) | Botones de edificios y «Más cerca» en Inicio |
| Front · vista | [BuscadorSugerencia.js](../front/vistas/sugerencia/BuscadorSugerencia.js#L3) | Elige el edificio y muestra el estacionamiento sugerido |
| Front · controlador | [SugerenciaControlador.js](../front/controladores/SugerenciaControlador.js#L1) | Control de la sugerencia: pide el más cercano y recuerda el último edificio elegido |
| Front · servicio | [SugerenciaServicio.js](../front/servicios/SugerenciaServicio.js#L1) | Pide la sugerencia para un edificio (fetch GET /api/sugerencia) |
| Back · controlador | [SugerenciaControlador.js](../back/controladores/SugerenciaControlador.js#L1) | Recibe el edificio y responde el estacionamiento sugerido |
| Back · servicio | [SugerenciaServicio.js](../back/servicios/SugerenciaServicio.js#L1) | Elige el estacionamiento abierto con puestos libres más cercano al edificio |
| Back · DTO | [SugerenciaDTO.js](../back/dto/SugerenciaDTO.js#L1) | El edificio, el sugerido y hasta dos alternativas, con su distancia |
| Pruebas de unidad | [SugerenciaServicio.test.js](../back/pruebas/unidad/SugerenciaServicio.test.js#L1) | Prueba que sugiera el abierto con libres más cercano |
| Pruebas de integración | [api.test.js](../back/pruebas/integracion/api.test.js#L9) | Prueba GET /api/sugerencia |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L10) | Prueba el criterio de aceptación de la sugerencia |

**Qué hace.** `SugerenciaServicio` elige, entre los abiertos con libres, el más cercano al edificio elegido (Haversine) y hasta dos alternativas.

---

## HU 8.1 · Activar las notificaciones

**Responsable:** Manuel · **Issue:** [#10](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/10) · **Etiqueta:** `@HU-8.1`

| Capa | Archivo | Qué hace |
|---|---|---|
| Front · pantalla | [page.js](../front/app/page.js#L4) | Pantalla Inicio, donde aparece la invitación a activar notificaciones |
| Front · vista | [Notificaciones.js](../front/vistas/notificaciones/Notificaciones.js#L5) | Invitación al entrar y el interruptor de Perfil |
| Front · vista | [PantallaPerfil.js](../front/vistas/perfil/PantallaPerfil.js#L4) | Interruptor de notificaciones en Perfil |
| Front · controlador | [NotificacionControlador.js](../front/controladores/NotificacionControlador.js#L1) | Control: pide el permiso, recuerda la decisión y manda la notificación de prueba |
| Front · modelo | [Notificacion.js](../front/modelos/Notificacion.js#L2) | La notificación de prueba que se muestra |
| Pruebas (front) | [NotificacionControlador.test.js](../front/pruebas/controladores/NotificacionControlador.test.js#L1) | Prueba el permiso y la notificación de prueba |
| Otro | [sw.js](../front/public/sw.js#L1) | Service worker: muestra la notificación de prueba |

**Qué hace.** `NotificacionControlador` pide el permiso del navegador, recuerda la respuesta y manda la notificación de prueba (`Notificacion`).

---

## HU 9.1 · Crear una incidencia

**Responsable:** Sebastian · **Issue:** [#11](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/11) · **Etiqueta:** `@HU-9.1`

| Capa | Archivo | Qué hace |
|---|---|---|
| Ruta (API) | [route.js](../front/app/api/incidencias/route.js#L1) | Dirección web /api/incidencias para los reportes |
| Front · pantalla | [page.js](../front/app/reportar/page.js#L2) | Pantalla «Reportar» |
| Front · vista | [TarjetaEstacionamiento.js](../front/vistas/mapa/TarjetaEstacionamiento.js#L3) | Tarjeta del estacionamiento con el botón «Reportar un problema aquí» |
| Front · vista | [AspectoIncidencia.js](../front/vistas/reportar/AspectoIncidencia.js#L1) | Color e ícono de cada tipo de problema en Reportar |
| Front · vista | [FormularioIncidencia.js](../front/vistas/reportar/FormularioIncidencia.js#L3) | Formulario: elegir el estacionamiento y el tipo de problema |
| Front · vista | [MensajeEstacionamientoCerrado.js](../front/vistas/reportar/MensajeEstacionamientoCerrado.js#L1) | Mensaje «estacionamiento cerrado»: el administrador lo cerró mientras se llenaba el formulario |
| Front · vista | [MensajeIncidenciaCreada.js](../front/vistas/reportar/MensajeIncidenciaCreada.js#L1) | Mensaje «incidencia creada»: el tipo, el estacionamiento, la hora y la línea Enviado › Pendiente › Atendido |
| Front · controlador | [IncidenciaControlador.js](../front/controladores/IncidenciaControlador.js#L1) | Control del formulario Reportar: valida, manda el reporte y decide qué mensaje mostrar |
| Front · validador | [IncidenciaValidador.js](../front/validadores/IncidenciaValidador.js#L1) | Revisa que se elija un estacionamiento de la lista y un tipo de problema; dice todo lo que falta |
| Front · servicio | [IncidenciaServicio.js](../front/servicios/IncidenciaServicio.js#L1) | Manda el reporte al back con fetch POST /api/incidencias |
| Front · DTO | [IncidenciaDTO.js](../front/dto/IncidenciaDTO.js#L1) | Lo que manda el formulario de Reportar: estacionamiento y tipo de problema |
| Back · controlador | [IncidenciaControlador.js](../back/controladores/IncidenciaControlador.js#L1) | Recibe el reporte, revisa que haya sesión y devuelve la incidencia creada |
| Back · servicio | [IncidenciaServicio.js](../back/servicios/IncidenciaServicio.js#L1) | Registra la incidencia como «pendiente» si el estacionamiento existe y está abierto |
| Back · DTO | [IncidenciaDTO.js](../back/dto/IncidenciaDTO.js#L1) | Lo que llega del formulario y lo que se devuelve, sin el correo de quien reporta |
| Back · modelo | [Incidencia.js](../back/modelos/Incidencia.js#L1) | La incidencia nace «pendiente», con fecha y hora, solo en estacionamientos abiertos |
| Back · repositorio | [EstacionamientoRepositorio.js](../back/repositorios/EstacionamientoRepositorio.js#L12) | solo los abiertos aparecen en el formulario |
| Back · repositorio | [IncidenciaRepositorio.js](../back/repositorios/IncidenciaRepositorio.js#L1) | Guarda las incidencias reportadas |
| Pruebas (front) | [IncidenciaControlador.test.js](../front/pruebas/controladores/IncidenciaControlador.test.js#L1) | Prueba el control de Reportar: valida, manda por fetch y elige el mensaje |
| Pruebas (front) | [IncidenciaValidador.test.js](../front/pruebas/validadores/IncidenciaValidador.test.js#L1) | Prueba que el formulario diga todo lo que falta elegir (CA2) |
| Pruebas de unidad | [Incidencia.test.js](../back/pruebas/unidad/Incidencia.test.js#L1) | Prueba las reglas de negocio de la incidencia |
| Pruebas de unidad | [IncidenciaServicio.test.js](../back/pruebas/unidad/IncidenciaServicio.test.js#L1) | Prueba que la incidencia se guarde pendiente y solo en estacionamientos abiertos |
| Pruebas de integración | [api.test.js](../back/pruebas/integracion/api.test.js#L10) | Prueba GET y POST /api/incidencias |
| Pruebas de aceptación | [criterios_sprint1.test.js](../back/pruebas/aceptacion/criterios_sprint1.test.js#L11) | Prueba el criterio de aceptación de Crear una incidencia |

**Qué hace.** `IncidenciaControlador` (front) valida con `IncidenciaValidador` (dice todo lo que falta, CA2), manda el `IncidenciaDTO` por fetch y muestra el mensaje que toca. En el back, `ControlDeAcceso` exige la sesión (precondición) e `IncidenciaServicio` + el modelo `Incidencia` aplican las reglas: solo en abiertos, tres tipos, nace «pendiente» con fecha y hora.

---

## Piezas que usan todas las HU (sin etiqueta de una HU)

| Capa | Archivo | Qué hace |
|---|---|---|
| Back | [Fabrica.js](../back/Fabrica.js) | Crea una sola vez cada pieza y las conecta: repositorios → tácticas → servicios → controladores |
| Back · controlador | [Controlador.js](../back/controladores/Controlador.js) | Clase base: leer el cuerpo, responder y convertir un `ErrorDeNegocio` en su código HTTP |
| Back · controlador | [EventoControlador.js](../back/controladores/EventoControlador.js) | Canal en vivo `GET /api/eventos` (HU 4.3) |
| Back · controlador | [PruebasControlador.js](../back/controladores/PruebasControlador.js) | `POST /api/pruebas/reiniciar` (solo desarrollo) |
| Back · servicio | [EventosEnVivoServicio.js](../back/servicios/EventosEnVivoServicio.js) | Avisa a quien esté mirando cada cambio (HU 4.3) |
| Back · servicio | [PruebasServicio.js](../back/servicios/PruebasServicio.js) | Vuelve a los datos de ejemplo |
| Back · repositorio | [Repositorio.js](../back/repositorios/Repositorio.js) | Clase base de acceso a datos |
| Back · modelo | [ErrorDeNegocio.js](../back/modelos/ErrorDeNegocio.js) | Error que lanza una regla de negocio, con su motivo |
| Back · datos | [AlmacenEnMemoria.js](../back/basedatos/AlmacenEnMemoria.js) | Los datos mientras no hay base de datos |
| Front · controlador | [Controlador.js](../front/controladores/Controlador.js) | Clase base: `+valida()` `+muestra()` `+redirige()` |
| Front · validador | [Validador.js](../front/validadores/Validador.js) | Clase base de las validaciones |
| Front · servicio | [ClienteHttp.js](../front/servicios/ClienteHttp.js) | Clase base de los servicios: `fetch` a la API |
| Front · servicio | [EventosEnVivoServicio.js](../front/servicios/EventosEnVivoServicio.js) | Escucha el canal en vivo |
| Front · vista | [MensajeDatosNoValidos.js](../front/vistas/comunes/MensajeDatosNoValidos.js), [MensajeHecho.js](../front/vistas/comunes/MensajeHecho.js) | Mensajes comunes de los formularios |
| Front · vista | [MenuPrincipal.js](../front/vistas/comunes/MenuPrincipal.js), [Pestanas.js](../front/vistas/comunes/Pestanas.js), [MenuAdmin.js](../front/vistas/comunes/MenuAdmin.js), [Iconos.js](../front/vistas/comunes/Iconos.js), [Formato.js](../front/vistas/comunes/Formato.js), [ActualizacionPWA.js](../front/vistas/comunes/ActualizacionPWA.js) | Encabezado, pestañas, íconos, formato de cifras y aviso de versión nueva (D-008) |

---

## Preguntas típicas de la profesora

**¿Reglas y datos son clases?**
Sí. Todo lo que decide o guarda algo es una clase con el nombre de su capa: el modelo
[Estacionamiento](../back/modelos/Estacionamiento.js) tiene sus atributos privados (`#capacidad`, `#ocupados`) y sus
reglas como métodos (`registrarEntrada()`, `libres()`, `semaforo()`); los datos los toca solo su
[EstacionamientoRepositorio](../back/repositorios/EstacionamientoRepositorio.js), que hereda de [Repositorio](../back/repositorios/Repositorio.js).
Los componentes de React son la vista; la lógica del front está en controladores, validadores, servicios y modelos.

**¿Cómo llega la data del front al back?** (HU 9.1)
Siempre por `fetch`: [FormularioIncidencia](../front/vistas/reportar/FormularioIncidencia.js) →
[IncidenciaControlador (front)](../front/controladores/IncidenciaControlador.js) `reportar()` →
[IncidenciaValidador](../front/validadores/IncidenciaValidador.js) → [IncidenciaServicio (front)](../front/servicios/IncidenciaServicio.js)
`POST /api/incidencias` → [route.js](../front/app/api/incidencias/route.js) →
[IncidenciaControlador (back)](../back/controladores/IncidenciaControlador.js) `crear()` →
[ControlDeAcceso](../back/tacticas/ControlDeAcceso.js) (precondición) → [IncidenciaServicio (back)](../back/servicios/IncidenciaServicio.js)
`reportar()` → [Incidencia](../back/modelos/Incidencia.js) `crear()` → [IncidenciaRepositorio](../back/repositorios/IncidenciaRepositorio.js)
→ ← [IncidenciaDTO](../back/dto/IncidenciaDTO.js) (201) → el front muestra [MensajeIncidenciaCreada](../front/vistas/reportar/MensajeIncidenciaCreada.js).

**¿Y si alguien se salta el front (Postman) y manda datos mal escritos?**
El back no repite las validaciones de formato (decisión del equipo). Lo que protege al sistema sigue
en el back: la **precondición** (sesión y rol, [ControlDeAcceso](../back/tacticas/ControlDeAcceso.js)), la
clave de los sensores ([AutenticadorDeSensores](../back/tacticas/AutenticadorDeSensores.js)) y las **reglas de
negocio** de modelos y servicios (lleno/vacío, solo abiertos, «pendiente», placa y nombre únicos,
rol según el dominio).

**¿Qué pasa si un sensor falla y manda avisos imposibles?** (táctica de disponibilidad)
[FiltroDeAvisos](../back/tacticas/FiltroDeAvisos.js) los ignora sin detener el sistema y los registra como
[AvisoRechazado](../back/modelos/AvisoRechazado.js); con 3 seguidos marca el sensor «con falla». Si un sensor
deja de avisar, [MonitorDeSensores](../back/tacticas/MonitorDeSensores.js) lo marca «sin avisar» pasado el
tiempo límite (30 min). Los dos se ven en Administrar › Garita.

**¿Qué pasa con un aviso de un estacionamiento cerrado?**
Se acepta y se cuenta: los carros siguen entrando y saliendo aunque esté cerrado; solo deja de
mostrarse con libres y de sugerirse ([Estacionamiento.motivoDeRechazo](../back/modelos/Estacionamiento.js)).

**¿Cómo entra el simulador a la app?**
Por la misma API que usaría un sensor real ([ClienteAppBase.aviso](../../RadarEstacionamientos_simulador/conexion_app/ClienteAppBase.js)
→ `POST /api/avisos` con `x-clave-sensor`). La app no tiene código del simulador (D-002, D-006).

**¿Dónde se guardan los datos?**
En memoria ([AlmacenEnMemoria](../back/basedatos/AlmacenEnMemoria.js)) mientras el equipo elige la base de
datos; solo lo usan los repositorios, así que al llegar la base de datos se cambia esa capa y nada más.

**¿Dónde se prueba el criterio N de la HU X?**
En [`criterios_sprint1.test.js`](../back/pruebas/aceptacion/criterios_sprint1.test.js) hay un `describe` por HU y cada
`test` nombra su criterio (CA) o regla (RN). Los criterios de mensajes de formulario están en
`front/pruebas/validadores/`. Todo corre con `npm test` dentro de `RadarEstacionamientos_code/`.
