# Mapa de las historias de usuario en el código

Dónde está cada HU del Sprint 1 (Iteración 1) y cómo explicarla. Los códigos, nombres y
responsables son los de [`backlog_y_iteraciones.md`](backlog_y_iteraciones.md) y los de los
Issues de GitHub. Cada enlace abre el archivo en la línea exacta (en la vista previa de Markdown
de VS Code: <kbd>⌘</kbd> + clic; en GitHub, clic).

## Cómo buscar una HU en segundos

- **Etiqueta fija en el código:** `@HU-3.2` (arroba ancha `@`, sin espacio y con guion). Está en
  la primera línea de cada archivo que implementa la HU y encima de cada función o componente
  principal, junto al comentario que ya lo explicaba:
  `// @HU-3.2 Simular sensores y placas · Aaron`.
- **Terminal** (en `RadarEstacionamientos_code/`): `grep -rn "@HU-3.2" front back --exclude-dir=node_modules`.
- **VS Code:** la extensión *Todo Tree* (recomendada en `.vscode/extensions.json`) muestra un árbol
  con las etiquetas agrupadas por HU; `.vscode/HU.code-search` es una búsqueda guardada de `@HU-`
  agrupada por archivo. Las dos están en la carpeta `.vscode/` de la raíz del repo, la misma que se abre para Run Code.

## Cómo está organizado (vale para todas las HU)

| Carpeta | Qué va | Capa |
|---|---|---|
| `front/app/<pantalla>/page.js` | Solo la ruta de cada pantalla | Front |
| `front/componentes/<pantalla>/` | Lo que se ve, agrupado por pantalla | Front |
| `front/acciones/<tema>.js` | Formularios: reciben lo escrito y llaman directo a `back/logica` | Front → Back |
| `front/app/api/…/route.js` | Solo conecta la URL con su archivo de `back/api/` | Front → Back |
| `back/api/<tema>.js` | Un archivo por endpoint: permisos y código HTTP. La usan sensores, Postman y el simulador | Back |
| `back/logica/<tema>/reglas.js` | Reglas puras: validan y calculan sin guardar nada (se prueban sin navegador) | Back |
| `back/logica/<tema>/datos.js` | Leen y guardan en el almacén (`back/comun/almacen.js`, en memoria) | Back |
| `back/campus/` | Datos fijos del campus: estacionamientos y edificios | Datos |
| `back/pruebas/`, `front/pruebas/` | Una prueba por tema y `criterios_sprint1.test.js`, un `describe` por HU | Pruebas |

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

| Capa | Dónde |
|---|---|
| Front · pantallas | [registro/page.js](../front/app/registro/page.js#L12) «Crear cuenta» · [entrar/page.js](../front/app/entrar/page.js#L12) «Entrar» |
| Front · componente | [FormularioCuenta.js](../front/componentes/cuenta/FormularioCuenta.js#L13): en Crear cuenta [noValidate](../front/componentes/cuenta/FormularioCuenta.js#L19) apaga los avisos del navegador y [muestra el mensaje del escenario](../front/componentes/cuenta/FormularioCuenta.js#L53) |
| Front · acciones | [crearCuenta](../front/acciones/cuenta.js#L12) (crea, abre la sesión y va a `/mapa`) · [entrar](../front/acciones/cuenta.js#L28) · [salir](../front/acciones/cuenta.js#L40) · sesión: [servidor/sesion.js](../front/servidor/sesion.js#L21) |
| Back · reglas | [validarRegistro](../back/logica/usuarios/reglas.js#L51) (en el orden del diagrama) · [los cuatro mensajes del escenario](../back/logica/usuarios/reglas.js#L13) (pasos 7.1, 8.1, 9.1 y 10.1) · [esCorreoUcab](../back/logica/usuarios/reglas.js#L34) · [rolSegunCorreo](../back/logica/usuarios/reglas.js#L41) |
| Back · datos | [registrarUsuario](../back/logica/usuarios/datos.js#L72) (contraseña cifrada, sin cuentas repetidas) · [comprobarCredenciales](../back/logica/usuarios/datos.js#L84) · [crearSesion](../back/logica/usuarios/datos.js#L95) |
| Back · API | No tiene: se entra por el formulario. |
| Pruebas | Correo UCAB crea la cuenta: [usuarios.test.js](../back/pruebas/usuarios.test.js#L45) · otro correo se rechaza y se explica: [usuarios.test.js](../back/pruebas/usuarios.test.js#L53) · ya tiene cuenta: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L47) · 8 caracteres: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L53) · los cuatro textos, letra por letra: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L59) · vacío o mal escrito: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L68) |

**Qué hace.** Solo la comunidad UCAB crea cuenta (@est.ucab.edu.ve o @ucab.edu.ve, y el rol sale del dominio). El sistema revisa en el orden del diagrama y, si algo falla, muestra el mensaje del escenario en vez del aviso del navegador: dominio (7.1, también si el correo está vacío o mal escrito), contraseña de menos de 8 caracteres (8.1, también si está vacía), contraseñas distintas (9.1) o cuenta ya existente (10.1). Si todo está bien, abre la sesión y muestra el mapa.

**Por qué está organizado así.** Las validaciones y sus cuatro textos viven en `back/logica/usuarios/reglas.js` y no en el navegador, para que las pruebas comprueben cada mensaje letra por letra y se vea igual en cualquier navegador.

---

## HU 2.1 · Registrar mis vehículos

**Responsable:** Samuel · **Issue:** [#14](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/14) · **Etiqueta:** `@HU-2.1`

| Capa | Dónde |
|---|---|
| Front · pantalla | [perfil/page.js](../front/app/perfil/page.js#L22) «Mis vehículos» dentro de Perfil |
| Front · componente | [FormularioVehiculo.js](../front/componentes/perfil/FormularioVehiculo.js#L14) |
| Front · acción | [agregarVehiculo](../front/acciones/vehiculos.js#L12) |
| Back · reglas | [normalizarPlaca](../back/logica/vehiculos/reglas.js#L10) · [esPlacaValida](../back/logica/vehiculos/reglas.js#L19) (las mismas que usa la garita, HU 3.2) · [validarVehiculo](../back/logica/vehiculos/reglas.js#L31) |
| Back · datos | [registrarVehiculo](../back/logica/vehiculos/datos.js#L23) (placa única) · [listarVehiculosDe](../back/logica/vehiculos/datos.js#L42) · [buscarPorPlaca](../back/logica/vehiculos/datos.js#L50) |
| Back · API | No tiene: se registra desde el formulario. |
| Pruebas | Registrar: [vehiculos.test.js](../back/pruebas/vehiculos.test.js#L31) · cada uno ve los suyos: [vehiculos.test.js](../back/pruebas/vehiculos.test.js#L47) · placa única: [vehiculos.test.js](../back/pruebas/vehiculos.test.js#L52) · sin sesión no: [vehiculos.test.js](../back/pruebas/vehiculos.test.js#L65) · misma placa que la garita: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L87) |

**Qué hace.** En Perfil, el usuario registra uno o varios vehículos con placa, marca, modelo y color. La placa se guarda en mayúsculas y sin guiones, y no puede estar registrada por otra persona; cada quien ve solo los suyos.

**Por qué está organizado así.** La regla de la placa está una sola vez, en `back/logica/vehiculos/reglas.js`, y la garita (HU 3.2) la importa: así el registro y el lector aceptan exactamente las mismas placas.

---

## HU 3.1 · Recibir avisos de entrada y salida

**Responsable:** Aaron · **Issue:** [#3](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/3) · **Etiqueta:** `@HU-3.1`

| Capa | Dónde |
|---|---|
| Front · pantalla | [admin/garita/page.js](../front/app/admin/garita/page.js#L29) (solo el administrador ve lo registrado) |
| Front · URL | [app/api/avisos/route.js](../front/app/api/avisos/route.js#L5) solo conecta la URL |
| Back · API | [POST /api/avisos](../back/api/avisos.js#L17) (pide el encabezado `x-clave-sensor`) |
| Back · reglas | [esClaveDeSensorValida](../back/seguridad/clave_sensores.js#L21) · [aplicarMovimiento](../back/logica/estacionamientos/reglas.js#L51) |
| Back · datos | [registrarAviso](../back/logica/estacionamientos/datos.js#L70) (estacionamiento, tipo y hora) · [listarMovimientos](../back/logica/estacionamientos/datos.js#L110) |
| Pruebas | Queda registrada con estacionamiento, tipo y hora: [avisos.test.js](../back/pruebas/avisos.test.js#L32) · por la API: [api.test.js](../back/pruebas/api.test.js#L66) · clave: [avisos.test.js](../back/pruebas/avisos.test.js#L124) · sin clave, 401: [api.test.js](../back/pruebas/api.test.js#L45) |

**Qué hace.** Es la puerta de los sensores: cada uno manda «entró» o «salió» a `POST /api/avisos` con su clave, y la app lo guarda con la hora. El simulador y Postman entran por el mismo camino (D-002). Cada aviso se cuenta una vez por llamada: la app no detecta avisos repetidos.

**Por qué está organizado así.** El aviso se guarda en `back/logica/estacionamientos/datos.js` porque el mismo aviso actualiza el aforo (HU 4.1): una sola función hace las dos cosas y no se pueden desincronizar.

---

## HU 3.2 · Simular sensores y placas

**Responsable:** Aaron · **Issue:** [#4](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/4) · **Etiqueta:** `@HU-3.2`

| Capa | Dónde |
|---|---|
| Panel de pruebas (simulador, proyecto aparte, puerto 3001) | [PanelDeControl.js](../../RadarEstacionamientos_simulador/componentes_visuales/PanelDeControl.js#L79) pestaña «Garita» · [cliente_api.js](../../RadarEstacionamientos_simulador/conexion_app/cliente_api.js#L36) llama a la API pública de la app |
| Front · pantalla de la app | [admin/garita/page.js](../front/app/admin/garita/page.js#L29) muestra las placas leídas (solo el administrador) |
| Back · API | [POST /api/garita/lecturas](../back/api/garita.js#L12) · los carros simulados usan [POST /api/avisos](../back/api/avisos.js#L17), igual que un sensor real |
| Back · reglas | [validarLectura](../back/logica/garita/reglas.js#L15), que usa [la regla de placa de la HU 2.1](../back/logica/garita/reglas.js#L9) |
| Back · datos | [registrarLecturaDePlaca](../back/logica/garita/datos.js#L10) · [listarLecturasDePlaca](../back/logica/garita/datos.js#L27) |
| Pruebas | Lectura con hora: [avisos.test.js](../back/pruebas/avisos.test.js#L111) · por la API: [api.test.js](../back/pruebas/api.test.js#L118) · formato: [avisos.test.js](../back/pruebas/avisos.test.js#L104) · «reacciona igual que un aviso real»: las pruebas de la 3.1, porque el simulador entra por la misma API; más las 19 del simulador |

**Qué hace.** El simulador tiene un panel con botones para meter o sacar carros y leer placas en la garita. Cada botón llama a la API pública de la app, así que la app reacciona igual que con un sensor o un lector real.

**Por qué está organizado así.** La simulación vive fuera de la app (D-002, D-006): la app no sabe que el simulador existe, así que con sensores reales no hay que quitar nada. La garita es un tema propio (`back/logica/garita/`) porque lee placas del campus, no puestos de un estacionamiento.

---

## HU 4.1 · Actualizar el aforo con cada entrada o salida

**Responsable:** Aaron · **Issue:** [#5](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/5) · **Etiqueta:** `@HU-4.1`

| Capa | Dónde |
|---|---|
| Front | Sin pantalla propia: el cambio se ve en el mapa y el Inicio (HU 4.2) por el [canal en vivo](../front/componentes/mapa/MaquetaCampus.js#L93); los avisos rechazados, en [admin/garita](../front/app/admin/garita/page.js#L17) |
| Back · API | [POST /api/avisos](../back/api/avisos.js#L17) (409 si está lleno o vacío) |
| Back · reglas | [aplicarMovimiento](../back/logica/estacionamientos/reglas.js#L51) (entrada ocupa, salida libera; también en un estacionamiento cerrado) · [puestosLibres](../back/logica/estacionamientos/reglas.js#L13) |
| Back · datos | [registrarAviso](../back/logica/estacionamientos/datos.js#L70) · [listarAvisosRechazados](../back/logica/estacionamientos/datos.js#L101) |
| Pruebas | CA1 y CA2: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L99) · CA3 y CA4: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L118) · CA5: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L109) · cerrado también cuenta: [avisos.test.js](../back/pruebas/avisos.test.js#L63) |

**Qué hace.** Con cada aviso, la app suma o resta un carro y recalcula los puestos libres, que nunca bajan de 0 ni pasan de la capacidad. Si el aviso rompería esos límites, no cambia nada y queda anotado como anomalía con su hora; si el estacionamiento no existe, queda como rechazado. Un estacionamiento cerrado sigue contando sus entradas y salidas.

**Por qué está organizado así.** La cuenta es una función pura (`aplicarMovimiento`) junto a `puestosLibres`, que también usa la HU 5.4: la regla «entre 0 y la capacidad» existe una sola vez.

---

## HU 4.2 · Consultar el semáforo de ocupación

**Responsable:** Aaron · **Issue:** [#6](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/6) · **Etiqueta:** `@HU-4.2`

| Capa | Dónde |
|---|---|
| Front · mapa | [MaquetaCampus.js](../front/componentes/mapa/MaquetaCampus.js#L57): cada área [con su color](../front/componentes/mapa/MaquetaCampus.js#L290) y una píldora con [los libres y el estado en texto](../front/componentes/mapa/MaquetaCampus.js#L321) · [PanelPuestos.js](../front/componentes/mapa/PanelPuestos.js#L56) lista «¿dónde hay puesto?» |
| Front · Inicio | [Inicio.js](../front/componentes/inicio/Inicio.js#L41) rejilla con libres y estado |
| Front · conexión con el back | [fetch a /api/estacionamientos](../front/componentes/mapa/MaquetaCampus.js#L79) y [canal en vivo](../front/componentes/mapa/MaquetaCampus.js#L93) |
| Back · API | [GET /api/estacionamientos](../back/api/estacionamientos.js#L16) |
| Back · reglas | [SEMAFORO](../back/logica/estacionamientos/reglas.js#L28) · [nivelDelSemaforo](../back/logica/estacionamientos/reglas.js#L36) (verde con ≥ 1 libre, rojo con 0, gris si está cerrado; D-009) |
| Back · datos | [vistaPublica](../back/logica/estacionamientos/datos.js#L23) |
| Pruebas | Verde: [semaforo.test.js](../back/pruebas/semaforo.test.js#L11) · rojo: [semaforo.test.js](../back/pruebas/semaforo.test.js#L16) · gris: [semaforo.test.js](../back/pruebas/semaforo.test.js#L20) · siempre con texto: [semaforo.test.js](../back/pruebas/semaforo.test.js#L29) · siempre dice los libres: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L136) |

**Qué hace.** Cada estacionamiento sale en verde («Hay puesto») si tiene al menos un puesto libre, en rojo («No hay puesto») si no tiene ninguno y en gris («Cerrado») si el administrador lo cerró. En el mapa, en la lista y en el Inicio aparece siempre el estado en texto junto a la cantidad de libres, y cambia solo cuando llega un aviso.

**Por qué está organizado así.** El estado lo decide una sola función (`nivelDelSemaforo`) que usan el mapa, la lista y el Inicio: cuando D-009 cambió la regla de tres colores a dos, se cambió en un solo lugar.

---

## HU 5.1 · Consultar los estacionamientos en el mapa del campus

**Responsable:** German · **Issue:** [#7](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/7) · **Etiqueta:** `@HU-5.1`

| Capa | Dónde |
|---|---|
| Front · pantalla | [mapa/page.js](../front/app/mapa/page.js#L13) (pide sesión) |
| Front · componente | [MaquetaCampus.js](../front/componentes/mapa/MaquetaCampus.js#L57): dibuja [cada área](../front/componentes/mapa/MaquetaCampus.js#L290) y [su nombre](../front/componentes/mapa/MaquetaCampus.js#L320) desde que se abre; si falla, [«Reintentar» y «Salir»](../front/componentes/mapa/MaquetaCampus.js#L340) |
| Back · API | [GET /api/estacionamientos](../back/api/estacionamientos.js#L16) (estado + forma de cada uno) |
| Datos | [ESTACIONAMIENTOS](../back/campus/estacionamientos.js#L29) · `back/campus/maqueta.json` (dónde cae cada uno en la imagen) · [capacidades de ejemplo](../back/campus/capacidad_inicial.js#L6) |
| Pruebas | El mapa dibuja todos: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L151) · todos con nombre: [estacionamientos.test.js](../back/pruebas/estacionamientos.test.js#L19) · todos se pueden dibujar: [estacionamientos.test.js](../back/pruebas/estacionamientos.test.js#L40) |

**Qué hace.** Al entrar, el usuario ve la maqueta del Campus Montalbán con cada estacionamiento dibujado y su nombre visible desde el primer momento, en el computador y en el celular. Se puede acercar, alejar y tocar un estacionamiento para ver su tarjeta (desde ahí se reporta un problema, HU 9.1).

**Por qué está organizado así.** La lista de estacionamientos está en `back/campus/` porque no cambia con el uso y la usan el mapa, el aforo (4.1) y la administración (5.4); la imagen sale de la maqueta 3D del simulador, así los dos muestran el mismo campus (D-006).

---

## HU 5.4 · Modificar la capacidad y el estado de un estacionamiento

**Responsable:** Sebastian · **Issue:** [#12](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/12) · **Etiqueta:** `@HU-5.4`

| Capa | Dónde |
|---|---|
| Front · pantalla | [admin/puestos/page.js](../front/app/admin/puestos/page.js#L15) (solo el administrador) |
| Front · componente | [FilaPuesto.js](../front/componentes/admin/FilaPuesto.js#L18) (capacidad y «Activo») |
| Front · acción | [guardarEstacionamiento](../front/acciones/puestos.js#L13) |
| Back · API | [PATCH /api/estacionamientos/:id](../back/api/estacionamientos.js#L28) (403 si no es administrador) |
| Back · reglas | [validarCapacidad](../back/logica/estacionamientos/reglas.js#L68) · [puestosLibres](../back/logica/estacionamientos/reglas.js#L13) · [estacionamientosSugeribles](../back/logica/estacionamientos/reglas.js#L87) (un cerrado no se sugiere) |
| Back · datos | [cambiarEstacionamiento](../back/logica/estacionamientos/datos.js#L41) |
| Pruebas | Libres con la capacidad nueva: [capacidad.test.js](../back/pruebas/capacidad.test.js#L98) · cerrado no se sugiere: [capacidad.test.js](../back/pruebas/capacidad.test.js#L104) · por la API: [api.test.js](../back/pruebas/api.test.js#L109) · 403: [api.test.js](../back/pruebas/api.test.js#L93) |

**Qué hace.** El administrador cambia la capacidad de un estacionamiento o lo cierra desmarcando «Activo». Los libres se recalculan con la capacidad nueva, el mapa se actualiza al instante y uno cerrado sale en gris y no se sugiere.

**Por qué está organizado así.** La pantalla y la API usan la misma función `cambiarEstacionamiento`, así el administrador y Postman siguen las mismas reglas; y `estacionamientosSugeribles` es de donde parte la HU 7.2.

---

## HU 6.1 · Registrar y actualizar el catálogo de edificios UCAB

**Responsable:** German · **Issue:** [#8](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/8) · **Etiqueta:** `@HU-6.1`

| Capa | Dónde |
|---|---|
| Front · pantalla | [admin/edificios/page.js](../front/app/admin/edificios/page.js#L16) (solo el administrador) |
| Front · componentes | [NuevoEdificio.js](../front/componentes/admin/NuevoEdificio.js#L13) · [FilaEdificio.js](../front/componentes/admin/FilaEdificio.js#L13) · [CamposEdificio.js](../front/componentes/admin/CamposEdificio.js#L8) · la lista que ve el usuario: [SelectorEdificio.js](../front/componentes/comunes/SelectorEdificio.js#L9) |
| Front · acciones | [agregar](../front/acciones/edificios.js#L23) · [modificar](../front/acciones/edificios.js#L37) · [quitar](../front/acciones/edificios.js#L50) |
| Back · reglas | [validarEdificio](../back/logica/edificios/reglas.js#L49) (nombre único, ubicación en el campus) · [crearId](../back/logica/edificios/reglas.js#L27) · [ordenarPorNombre](../back/logica/edificios/reglas.js#L85) |
| Back · datos | [listarEdificios](../back/logica/edificios/datos.js#L9) · [agregarEdificio](../back/logica/edificios/datos.js#L15) · [modificarEdificio](../back/logica/edificios/datos.js#L31) · [quitarEdificio](../back/logica/edificios/datos.js#L46) · catálogo inicial: [EDIFICIOS](../back/campus/edificios.js#L15) |
| Back · API | No tiene: se administra desde la pantalla. |
| Pruebas | Agregar: [edificios.test.js](../back/pruebas/edificios.test.js#L91) · modificar: [edificios.test.js](../back/pruebas/edificios.test.js#L97) · quitar: [edificios.test.js](../back/pruebas/edificios.test.js#L104) · la misma lista que ve el usuario: [edificios.test.js](../back/pruebas/edificios.test.js#L82) |

**Qué hace.** El administrador agrega, modifica o quita edificios (nombre y, si quiere, latitud y longitud). Esa misma lista, ordenada por nombre, es la que el usuario ve al elegir un edificio en el Inicio y en Sugerir.

**Por qué está organizado así.** Hay una sola lista (`listarEdificios`) para el administrador y para el usuario, guardada con su ubicación porque la sugerencia (7.2) mide la distancia desde cada edificio.

---

## HU 7.2 · Sugerir el estacionamiento libre más cercano

**Responsable:** Manuel · **Issue:** [#9](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/9) · **Etiqueta:** `@HU-7.2`

| Capa | Dónde |
|---|---|
| Front · pantallas | [Inicio.js](../front/componentes/inicio/Inicio.js#L41) chips de edificios y «Más cerca» · [sugerencia/page.js](../front/app/sugerencia/page.js#L15) con [BuscadorSugerencia.js](../front/componentes/sugerencia/BuscadorSugerencia.js#L25) |
| Front · conexión con el back | [fetch a /api/sugerencia](../front/componentes/sugerencia/BuscadorSugerencia.js#L36) |
| Back · API | [GET /api/sugerencia](../back/api/sugerencia.js#L16) |
| Back · reglas | [sugerirMasCercano](../back/logica/sugerencia/reglas.js#L39) (abiertos y con libres, el más cercano; considera todos, también los de solo profesores) · [distanciaEnMetros](../back/logica/sugerencia/reglas.js#L16) · parte de [estacionamientosSugeribles](../back/logica/estacionamientos/reglas.js#L87) (5.4) |
| Back · datos | [sugerirParaEdificio](../back/logica/sugerencia/datos.js#L12) |
| Pruebas | El más cercano con libres: [sugerencia.test.js](../back/pruebas/sugerencia.test.js#L39) · salta los llenos: [sugerencia.test.js](../back/pruebas/sugerencia.test.js#L45) · salta los cerrados: [sugerencia.test.js](../back/pruebas/sugerencia.test.js#L50) · considera los de profesores: [sugerencia.test.js](../back/pruebas/sugerencia.test.js#L55) · por la API: [api.test.js](../back/pruebas/api.test.js#L147) |

**Qué hace.** El usuario elige el edificio al que va y la app le sugiere el estacionamiento abierto con puestos libres más cercano a ese edificio, sin tomar en cuenta su horario ni su rol.

**Por qué está organizado así.** La sugerencia es un tema propio porque combina dos que ya existen, los edificios (6.1) y los estacionamientos abiertos (5.4), sin copiar sus reglas.

---

## HU 8.1 · Activar las notificaciones

**Responsable:** Manuel · **Issue:** [#10](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/10) · **Etiqueta:** `@HU-8.1`

| Capa | Dónde |
|---|---|
| Front · pantallas | Invitación en el [Inicio](../front/app/page.js#L29) y en el [Mapa](../front/app/mapa/page.js#L21) · interruptor en [Perfil](../front/app/perfil/page.js#L75) |
| Front · componente | [Notificaciones.js](../front/componentes/notificaciones/Notificaciones.js#L22) |
| Front · lógica | [debeMostrarSolicitud](../front/notificaciones/GestorNotificaciones.js#L111) (paso 2.2) · [pedirPermiso](../front/notificaciones/GestorNotificaciones.js#L200) (CA1) · [bloquear](../front/notificaciones/GestorNotificaciones.js#L120) (CA2) · [enviarNotificacionPrueba](../front/notificaciones/GestorNotificaciones.js#L167) · [Notificacion.js](../front/notificaciones/Notificacion.js#L6) |
| Front · service worker | [sw.js](../front/public/sw.js#L14) (único, D-008). La prueba la muestra `showNotification`; no hay envío de notificaciones reales (push) |
| Back | No tiene: todo pasa en el navegador. |
| Pruebas | CA1: [notificaciones.test.js](../front/pruebas/notificaciones.test.js#L189) · CA2: [notificaciones.test.js](../front/pruebas/notificaciones.test.js#L145) · CA3: [notificaciones.test.js](../front/pruebas/notificaciones.test.js#L209) · paso 2.2: [notificaciones.test.js](../front/pruebas/notificaciones.test.js#L197) |

**Qué hace.** La primera vez que entra, la app le pide permiso para mandarle notificaciones. Si acepta, recibe una notificación de prueba; si no, no se le vuelve a preguntar y puede activarlas después desde Perfil.

**Por qué está organizado así.** La lógica está en `front/notificaciones/` y no en el back porque los permisos y las notificaciones son del navegador; el service worker es uno solo para toda la app (D-008).

---

## HU 9.1 · Crear una incidencia

**Responsable:** Sebastian · **Issue:** [#11](https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB/issues/11) · **Etiqueta:** `@HU-9.1`

| Capa | Dónde |
|---|---|
| Front · pantalla | [reportar/page.js](../front/app/reportar/page.js#L14) «Reportar»: se abre desde la pestaña del menú o desde la tarjeta del mapa (paso 1 del escenario) |
| Front · tarjeta del mapa | [TarjetaEstacionamiento.js](../front/componentes/mapa/TarjetaEstacionamiento.js#L14), que se abre al [tocar un estacionamiento](../front/componentes/mapa/MaquetaCampus.js#L380), con el botón [«Reportar un problema aquí»](../front/componentes/mapa/TarjetaEstacionamiento.js#L50), que llega con [ese estacionamiento ya elegido](../front/app/reportar/page.js#L19) |
| Front · componente | [FormularioIncidencia.js](../front/componentes/reportar/FormularioIncidencia.js#L27) (tipo, estacionamiento, «Enviar reporte» y «Cancelar») |
| Front · acción | [reportarIncidencia](../front/acciones/incidencias.js#L15) |
| Back · API | [POST /api/incidencias](../back/api/incidencias.js#L21) (mismas reglas que el formulario) |
| Back · reglas | [TIPOS_DE_INCIDENCIA](../back/logica/incidencias/reglas.js#L5) · [validarReporte](../back/logica/incidencias/reglas.js#L22) (dice qué falta) |
| Back · datos | [registrarIncidencia](../back/logica/incidencias/datos.js#L14) (con la hora y como pendiente) |
| Pruebas | CA1, con hora y pendiente: [incidencias.test.js](../back/pruebas/incidencias.test.js#L22) · CA2, dice qué falta: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L182) · CA3, un cerrado no aparece: [criterios_sprint1](../back/pruebas/criterios_sprint1.test.js#L194) · por la API: [api.test.js](../back/pruebas/api.test.js#L136) |

> **Datos de apoyo de la tarjeta, sin HU propia en el Sprint 1 (decisión del equipo):** [Ocupación %, Capacidad y pisos](../front/componentes/mapa/TarjetaEstacionamiento.js#L41). La tarjeta está por la HU 9.1; esos datos solo acompañan al estacionamiento elegido.

**Qué hace.** El conductor abre «Reportar» desde el menú o desde la tarjeta de un estacionamiento en el mapa (entonces ese ya viene elegido), elige el tipo de problema (batería descargada, conos atravesados o vehículo mal estacionado) y el estacionamiento, y envía el reporte. Queda registrado con la hora y como «pendiente», y ve la confirmación; si falta algo, el sistema le dice qué.

**Por qué está organizado así.** Las incidencias son un tema propio (`back/logica/incidencias/`) porque la épica 9 sigue con la 9.2 (estado), la 9.3 (listado) y la 9.4 (eliminar), que usarán las mismas reglas y datos.

---

## Preguntas típicas de la profesora

**¿Por qué organizaron el código por tema y no por HU?**
Porque varias HU comparten reglas y, separadas por HU, quedarían copiadas. La placa de «Mis vehículos» (2.1) es la misma que lee la garita (3.2): [garita/reglas.js](../back/logica/garita/reglas.js#L9) importa [esPlacaValida](../back/logica/vehiculos/reglas.js#L19). `puestosLibres` la usan la 4.1 y la 5.4 ([reglas.js](../back/logica/estacionamientos/reglas.js#L13)); un mismo aviso registra el movimiento (3.1) y actualiza el aforo (4.1) en [registrarAviso](../back/logica/estacionamientos/datos.js#L70); y el estado del semáforo sale de una sola función ([nivelDelSemaforo](../back/logica/estacionamientos/reglas.js#L36)). Para encontrar una HU basta la etiqueta `@HU-x.y` o este mapa.

**¿Por qué separaron front y back, y `reglas.js` de `datos.js`?**
El front es lo que ve la persona; el back, las reglas y los datos, y cada parte se prueba sola. `reglas.js` valida y calcula sin guardar nada, así se prueba con `npm test` sin servidor ni navegador; `datos.js` es lo único que toca el almacén ([almacen.js](../back/comun/almacen.js#L36)), así que el día que haya base de datos solo cambian los `datos.js`.

**¿Por qué los formularios no pasan por la API?**
Las acciones de Next ya corren en el servidor y llaman directo a `back/logica` (por ejemplo [crearCuenta](../front/acciones/cuenta.js#L12) → [registrarUsuario](../back/logica/usuarios/datos.js#L72)). La API es para quien está fuera de la app: sensores, Postman y el simulador. Las dos usan las mismas reglas.

**¿Dónde se conecta el mapa con el back?**
[MaquetaCampus.js](../front/componentes/mapa/MaquetaCampus.js#L79) pide los estacionamientos a [GET /api/estacionamientos](../back/api/estacionamientos.js#L16) y abre el [canal en vivo](../front/componentes/mapa/MaquetaCampus.js#L93) para enterarse de cada aviso sin recargar.

**¿Dónde se conecta un formulario con el back?** (el de incidencias)
[FormularioIncidencia.js](../front/componentes/reportar/FormularioIncidencia.js#L28) → [reportarIncidencia](../front/acciones/incidencias.js#L15) → [registrarIncidencia](../back/logica/incidencias/datos.js#L14) → [validarReporte](../back/logica/incidencias/reglas.js#L22). Todos siguen el mismo camino: pantalla → componente → `front/acciones/<tema>.js` → `back/logica/<tema>/datos.js` → `reglas.js`.

**¿Dónde se prueba el criterio N de la HU X?**
En [`criterios_sprint1.test.js`](../back/pruebas/criterios_sprint1.test.js) hay un `describe` por HU y cada `test` nombra su criterio (CA) o regla (RN); el resto, en la prueba del tema. La tabla de cada HU, arriba, enlaza la prueba de cada criterio. Todas corren con `npm test` dentro de `RadarEstacionamientos_code/` (back y front).

**¿Qué pasa si un sensor manda dos veces el mismo aviso?**
Se cuentan los dos: detectar avisos repetidos no está en el alcance de la HU 4.1. Cada llamada a [registrarAviso](../back/logica/estacionamientos/datos.js#L70) es un carro.

**¿Qué pasa con un aviso de un estacionamiento cerrado?**
Se acepta y se cuenta: los carros siguen entrando y saliendo aunque esté cerrado; solo deja de mostrarse con libres y de sugerirse ([aplicarMovimiento](../back/logica/estacionamientos/reglas.js#L51), prueba: [avisos.test.js](../back/pruebas/avisos.test.js#L63)).

**¿Cómo sabe la app que un aviso viene de un sensor?**
Por el encabezado `x-clave-sensor`, que compara [esClaveDeSensorValida](../back/seguridad/clave_sensores.js#L21). Sin clave responde 401.

**¿Cómo entra el simulador a la app?**
Por la misma API que usaría un sensor real ([cliente_api.js](../../RadarEstacionamientos_simulador/conexion_app/cliente_api.js#L36) → [POST /api/avisos](../back/api/avisos.js#L17)). La app no tiene código del simulador (D-002, D-006).

**¿Quién puede cambiar la capacidad o los edificios?**
Solo el administrador: lo comprueban [guardarEstacionamiento](../front/acciones/puestos.js#L13), [PATCH](../back/api/estacionamientos.js#L28) (403) y [las acciones de edificios](../front/acciones/edificios.js#L23), con [esAdministrador](../back/seguridad/sesion.js#L37).

**¿Dónde se guardan los datos?**
En memoria ([almacen.js](../back/comun/almacen.js#L36)) mientras el equipo elige la base de datos; se borran al apagar el servidor.
