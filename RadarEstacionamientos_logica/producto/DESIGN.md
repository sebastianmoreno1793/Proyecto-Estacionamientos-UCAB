---
name: Radar de Estacionamientos UCAB
description: Encuentra puesto en el Campus Montalbán antes de llegar.
colors:
  azul-montalban: "#1d4f91"
  azul-boton-oscuro: "#2f6bbd"
  azul-montalban-hondo: "#163d72"
  azul-carnet: "#12315c"
  bruma-carnet: "#c9d7ec"
  oro-de-sello: "#c8962e"
  fondo-agrupado: "#f4f4f6"
  noche: "#16161a"
  lavanda: "#cecbf6"
  ambar: "#fac775"
  cielo: "#b5d4f4"
  coral: "#f5c4b3"
  superficie: "#ffffff"
  superficie-hundida: "#e9e9ee"
  separador: "rgba(60, 60, 67, 0.18)"
  tinta: "#111114"
  tinta-secundaria: "#6b6b76"
  hay-puesto: "#1e7b4f"
  hay-puesto-relleno: "#2f9e57"
  no-hay-puesto: "#b42318"
  no-hay-puesto-relleno: "#d93a2e"
  cerrado: "#6c6c70"
  cerrado-relleno: "#8e8e93"
  entorno-maqueta: "#bdb789"
  entorno-maqueta-oscuro: "#8e8a6a"
  error: "#b42318"
  fondo-oscuro: "#000000"
  superficie-oscura: "#1c1c1e"
  azul-montalban-oscuro: "#6a9ee6"
  tinta-oscura: "#f2f2f7"
  tinta-secundaria-oscura: "#a1a1a6"
typography:
  headline: { fontFamily: "system-ui", fontSize: "34px", fontWeight: 700, lineHeight: "41px" }
  title: { fontFamily: "system-ui", fontSize: "22px", fontWeight: 700, lineHeight: "28px" }
  body: { fontFamily: "system-ui", fontSize: "17px", fontWeight: 400, lineHeight: "22px" }
  secondary: { fontFamily: "system-ui", fontSize: "15px", fontWeight: 400, lineHeight: "20px" }
  label: { fontFamily: "system-ui", fontSize: "13px", fontWeight: 400, lineHeight: "18px" }
  data: { fontFamily: "system-ui", fontWeight: 700, fontFeature: "tnum" }
rounded: { campo: "10px", celda: "12px", control: "14px", hoja: "22px", pildora: "999px" }
spacing: { xs: "4px", sm: "8px", md: "12px", lg: "16px", xl: "24px", xxl: "32px" }
---

# Sistema de diseño: Radar de Estacionamientos UCAB

**Estado:** 🟢 Vigente — es la regla de [D-007](../decisiones/D-007-diseno-ios-institucional-ucab.md).
**Obligatorio para todo el equipo.** Sale de Thinkdy (`~/UCAB/App-Estudio/DESIGN.md`) y del
movimiento de Te Cambio. Se revisa con la skill `impeccable`.

## Idea central: «La maqueta en el parabrisas»

Quien lo abre va manejando hacia el campus, o está en la cola de la garita. En dos segundos
tiene que saber **adónde ir**. Por eso la pantalla de inicio es una **maqueta del campus vista
desde arriba** (no un mapa de calles) y lo único fuerte encima es el semáforo: verde si hay
puesto, rojo si no hay (D-009). Todo lo demás (menú, tarjetas, formularios) es tranquilo, plano
y de iOS. La identidad UCAB vive en pocos lugares: la barra Azul Carnet, el ícono y el punto
dorado del radar.

Modo de la superficie (`impeccable`): **Operate**. Prima que se pueda escanear, que sea
consistente y que se comporte como espera la gente; el estilo se nota en los detalles.

## ⭐ Versión 2 (09/nov/26): «menos texto, más toque»

Sebastian la decidió después de revisar apps de estacionamiento de Europa (EasyPark, PayByPhone,
Parclick), apps venezolanas (Yummy, **Cashea**) y referencias de Pinterest (Scoopa, «Popular Food»,
«My Spots», el anillo «8.8»). Lo que cambia frente a la versión 1 (lo demás sigue igual):

1. **Responsive: una parte de teléfono y una de web, de la misma familia** (mismos colores,
   letra, tarjetas y pestañas).
   - **Teléfono y tableta (menos de 1024 px):** una columna; en tableta la rejilla pasa a 3
     columnas. Barra de pestañas flotante abajo.
   - **Computador (1024 px o más):** encabezado blanco con las pestañas en una píldora junto a la
     marca y el perfil a la derecha; contenido a lo ancho (hasta 1200 px) en columnas. Inicio:
     sugerencia y total a la izquierda (fijos al bajar), rejilla de estacionamientos a la derecha.
     Mapa: panel de puestos a la izquierda (360 px). Perfil en dos columnas y Administrar en
     rejilla.
2. **Cuatro pestañas** (Inicio, Mapa, Reportar, Perfil). En el teléfono son una píldora oscura
   flotante: la activa se vuelve blanca y muestra su nombre; las otras, solo el ícono (el nombre
   sigue ahí para los lectores de pantalla). En el computador muestran ícono y nombre.
3. **Fondo claro y letra negra gruesa, como Cashea.** Títulos de 34 px en peso 800; la marca ya no
   va en una barra Azul Carnet. El **Azul Carnet** queda para la acción principal (píldora) y el
   círculo del perfil.
4. **Sin textos que expliquen el sistema** («los libres se calculan…», fechas, «¿Qué pasa?»).
   Cada pantalla dice solo lo que el usuario necesita para actuar.
5. **Inicio:** chips de edificios → tarjeta oscura con la sugerencia (HU 7.2) → total en grande
   con un anillo verde/rojo (HU 4.2) → cuadrícula de dos columnas con un estacionamiento por
   tarjeta. La maqueta pasa a la pestaña **Mapa**.
6. **Reportar (como armar un pedido en Scoopa):** tres mosaicos pastel de un toque para el tipo,
   chips para el lugar y «Enviar reporte». La confirmación muestra el tipo, el lugar, la hora y
   una línea de estado (Enviado · Pendiente · Atendido).
7. **Perfil:** vehículos, interruptor de notificaciones, Administrar (solo administrador) y Salir.
   **Administrar** usa chips (Puestos, Incidencias, Garita, Edificios) y la capacidad se cambia
   con «−» / «+», sin botón «Guardar».
8. **Pastel con significado:** lavanda, ámbar, cielo y coral identifican **tipos** (por ejemplo,
   el tipo de incidencia). **El verde y el rojo siguen siendo solo del semáforo (D-009)**; los
   interruptores encendidos son azules, no verdes.

## Colores

- **Azul Montalbán** `#1d4f91`: el único color de acción (botones, enlaces, selección, foco).
  En oscuro, el texto azul sube a `#6a9ee6` y el fondo de los botones a `#2f6bbd`, para que el
  texto blanco siga en 4,5:1. **Regla Una Voz:** si es azul, se puede tocar.
- **Azul Carnet** `#12315c`: la barra de la marca, el ícono y el color de tema de la PWA. Su
  texto secundario va en **Bruma Carnet** `#c9d7ec`.
- **Oro de Sello** `#c8962e`: solo el punto del radar, en el ícono y en la marca. **Regla Oro
  Escaso.**
- **Semáforo de dos estados** (HU 4.2, ⭐ D-009). Solo dice si hay o no hay puesto:

  | Estado | Cuándo | Color (con texto blanco) | Relleno de áreas | Texto |
  |---|---|---|---|---|
  | Hay puesto | al menos 1 libre | `#1e7b4f` | `#2f9e57` | «Hay puesto» · «N libres» |
  | No hay puesto | 0 libres | `#b42318` | `#d93a2e` | «No hay puesto» |
  | Cerrado | desactivado | `#6c6c70` | `#8e8e93` | «Cerrado» |

  **Nada de amarillo ni naranja**, ni «Se está llenando», «Casi lleno» o «Lleno». **Regla Color
  con Significado:** verde y rojo no se usan para nada más (el rojo, también para errores). El
  estado **siempre** se dice también en texto.
- **Neutros de iOS:** fondo agrupado `#f2f2f7`, superficie `#ffffff`, superficie hundida
  `#e9e9ee`, tinta `#0f1b2d` y tinta secundaria `#6c6c70`. El oscuro usa negro y `#1c1c1e`.

## Tipografía

La fuente del sistema (`system-ui`: SF Pro en iPhone, Roboto en Android). No se descarga
ninguna fuente. Las **cifras que cambian** (libres, porcentajes, horas) usan
`font-variant-numeric: tabular-nums` y peso 700. Jerarquía de iOS: título grande de 34 px en las
páginas, 22 px en hojas y tarjetas, cuerpo de 17 px, secundario de 15 px y etiqueta de 13 px.
**Los campos de texto usan 16 px o más**, para que el iPhone no haga zoom.

## Estructura

- **Celular y tableta (menos de 1024 px):** la marca va arriba, compacta. La **barra de
  pestañas** va abajo, fija, translúcida y respetando el área segura: Mapa · Reportar y, para el
  personal autorizado, Incidencias · Garita · Administrar (etiquetas de 11 px). En menos de
  768 px, la lista de puestos es una **hoja** que sube desde abajo y se recoge.
- **Computador:** la marca y las pestañas van arriba. En la maqueta, el panel de puestos queda a
  la izquierda (360 px) y la maqueta ocupa el resto.
- **Páginas de formulario o listas:** una columna de hasta 640 px, título grande y **listas
  agrupadas** (tarjetas blancas de 12 px de radio sobre el fondo gris).
- **Sin scroll horizontal** en ningún ancho, ni siquiera en 320 px.

## Maqueta (signature)

**No es un mapa de calles.** Es una **maqueta de arquitectura del Campus Montalbán vista desde
arriba**, estática y con texturas, como las maquetas físicas y los renders de urbanismo que
eligió Sebastian como guía (27/oct/26): grama de fieltro, árboles redondos con algunos en flor,
techos de teja y de concreto con pretiles y casetas, fachadas con ventanas, asfalto claro, canchas
pintadas y los estacionamientos con sus puestos marcados.

- **De dónde sale:** la página `/maqueta` del simulador fotografía la escena 3D con medidas reales
  (OpenStreetMap) en una cámara casi cenital (34°) y exporta la imagen
  (`front/public/maqueta/campus.jpg`, 2400 × 1560) y la proyección (`back/campus/maqueta.json`: dónde cae
  cada estacionamiento y cada edificio en la imagen). Si cambian los edificios o los
  estacionamientos, se vuelve a exportar; la app no dibuja el campus.
- **Encima, el semáforo:** cada estacionamiento se pinta con su relleno al 50 % y su borde. El
  borde **punteado** marca «Solo profesores».
- **Píldoras que se tocan:** de lejos, un círculo con el número de libres (si no, se amontonan);
  al acercarse, «N libres»; el elegido, también su nombre. Cerrado muestra «Cerrado».
- **Nombres de los edificios** al acercarse (rótulos blancos).
- **Gestos:** arrastrar, pellizcar y la rueda. Controles de texto «Alejar · Acercar · Ver todo»
  (44 px, nunca solo íconos).
- Al tocar un estacionamiento, la maqueta se acerca y aparece la **tarjeta del estacionamiento**:
  nombre, estado en texto y tres datos (**Libres · Ocupación · Capacidad**). Debajo, «Reportar un
  problema aquí».
- La **lista de puestos** va del que tiene más libres al que tiene menos, y los cerrados al final.
  Arriba, el total del campus en tinta («**312** puestos libres») y el estado del canal.
- **Sin conexión no se engaña:** fuera de «En vivo», el semáforo se apaga (gris al 55 %) y el
  panel dice «Reconectando… · cifras de hace N minutos».
- Cuando llega un aviso, el estacionamiento **late una vez**.

## Componentes

- **Botón principal:** fondo Azul Montalbán, texto blanco de 17 px semibold, 50 px de alto,
  radio de 14 px. Uno solo por pantalla, y su texto dice la acción exacta («Enviar reporte»).
- **Botón secundario:** relleno gris translúcido con texto azul.
- **Botón de texto:** solo texto azul, 44 px de alto.
- **Nunca un botón que sea solo ícono.** Los íconos son SVG de línea de 1,75 px.
- **Campos:** sin borde, fondo de superficie, radio de 10 px, 48 px de alto y texto de 16 px o
  más. El grupo de opciones (tipo de incidencia) es una lista agrupada con círculo de selección.
- **Avisos:** un toast flotante abajo, sobre la barra de pestañas, para «Reporte enviado» y
  para «Hay una versión nueva · Actualizar» (PWA, D-008).
- **Sombras:** solo en lo que flota (hoja, tarjeta del mapa, toast):
  `0 10px 30px rgba(19, 35, 58, 0.18)`. Listas y tarjetas en reposo, planas.

## Movimiento (vocabulario de Te Cambio)

| Animación | Dónde |
|---|---|
| Al pulsar, baja a escala 0,97 (140 ms) | Botones, filas, pestañas |
| La hoja sube desde abajo (340 ms) | Lista de puestos en el celular; tarjeta del mapa |
| La cifra cuenta hasta el valor nuevo | Total de puestos libres |
| El estacionamiento late una vez | Cuando llega un aviso de su sensor |
| La maqueta se desliza hasta el elegido (420 ms) | Al tocar un estacionamiento o «Ver todo» |

Nada más se anima. **Todo se apaga con `prefers-reduced-motion`.**

## Accesibilidad

Contraste de 4,5:1 para el texto. El semáforo también se dice en texto (lectores de pantalla y
daltonismo). El foco es un anillo azul de 2 px. Las regiones vivas (`aria-live`) se usan para
el total y para los avisos. Zonas táctiles de 44 px como mínimo.

## Qué sí y qué no

**Sí:** un botón principal por pantalla · listas agrupadas · cifras tabulares · diseñar claro y
oscuro · probar en 320 y 375 px · respetar «reducir movimiento».

**No:** mapas de calles (OpenStreetMap, Google Maps) en la pantalla de inicio · amarillo o
naranja en el semáforo · emoji como íconos · botones de solo ícono · colores del semáforo como
decoración ·
sombras en tarjetas en reposo · librerías de componentes (Material, Bootstrap) · etiquetas en
mayúsculas encima de títulos · fuentes descargadas.

## Referencias

- Thinkdy (`~/UCAB/App-Estudio/DESIGN.md`) y Te Cambio (D-007 de ese proyecto), de Sebastian.
- Versión 2 (09/nov/26): Cashea, Yummy, EasyPark, PayByPhone, Parclick y pines de Pinterest
  (Scoopa, «Popular Food», «My Spots», «Elegant Concept Fitness», el anillo «8.8»). Se tomaron los
  patrones (pasos cortos, chips, tarjetas grandes, cifras grandes, barra flotante), no los diseños.
- Pinterest, búsqueda «parking app ui design» (27/oct/26): se tomó solo el patrón (vista a
  pantalla completa con tarjeta flotante, tres datos en columnas y leyenda corta), no un diseño
  en particular.
- Guía de Sebastian para la maqueta (27/oct/26): una maqueta física de urbanismo vista desde
  arriba y un render arquitectónico de viviendas con techos de teja. Se tomó el acabado
  (texturas, árboles, techos, luz cálida), no el contenido.
- Crítica `impeccable` del 27/oct/26 (26/40): sus P1 (total en gris, contraste de las píldoras y
  de los botones en oscuro, datos viejos mostrados como vivos) se resolvieron ese mismo día.
