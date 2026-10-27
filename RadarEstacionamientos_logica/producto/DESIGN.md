---
name: Radar de Estacionamientos UCAB
description: Encuentra puesto en el Campus Montalbán antes de llegar.
colors:
  azul-montalban: "#1d4f91"
  azul-montalban-hondo: "#163d72"
  azul-carnet: "#12315c"
  bruma-carnet: "#c9d7ec"
  oro-de-sello: "#c8962e"
  fondo-agrupado: "#f2f2f7"
  superficie: "#ffffff"
  superficie-hundida: "#e9e9ee"
  separador: "rgba(60, 60, 67, 0.18)"
  tinta: "#0f1b2d"
  tinta-secundaria: "#6c6c70"
  semaforo-verde: "#2f9e57"
  semaforo-amarillo: "#e0a800"
  semaforo-naranja: "#e8730c"
  semaforo-rojo: "#d93a2e"
  cerrado: "#8e8e93"
  error: "#b42318"
  fondo-oscuro: "#000000"
  superficie-oscura: "#1c1c1e"
  azul-montalban-oscuro: "#4a86d8"
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

## Idea central: «El radar en el parabrisas»

Quien lo abre va manejando hacia el campus, o está en la cola de la garita. En dos segundos
tiene que saber **adónde ir**. Por eso el mapa ocupa toda la pantalla y el color del semáforo
es lo único fuerte. Todo lo demás (menú, tarjetas, formularios) es tranquilo, plano y de iOS.
La identidad UCAB vive en pocos lugares: la barra Azul Carnet, el ícono y el punto dorado del
radar.

Modo de la superficie (`impeccable`): **Operate**. Prima que se pueda escanear, que sea
consistente y que se comporte como espera la gente; el estilo se nota en los detalles.

## Colores

- **Azul Montalbán** `#1d4f91`: el único color de acción (botones, enlaces, selección, foco).
  En oscuro, `#4a86d8`. **Regla Una Voz:** si es azul, se puede tocar.
- **Azul Carnet** `#12315c`: la barra de la marca, el ícono y el color de tema de la PWA. Su
  texto secundario va en **Bruma Carnet** `#c9d7ec`.
- **Oro de Sello** `#c8962e`: solo el punto del radar, en el ícono y en la marca. **Regla Oro
  Escaso.**
- **Semáforo** (solo estado de ocupación, HU 4.2):

  | Nivel | Ocupación | Color | Texto |
  |---|---|---|---|
  | Verde | menos de 50 % | `#2f9e57` | Hay puestos |
  | Amarillo | 50 % a menos de 80 % | `#e0a800` | Se está llenando |
  | Naranja | 80 % a menos de 95 % | `#e8730c` | Casi lleno |
  | Rojo | 95 % o más | `#d93a2e` | Lleno |
  | Gris | desactivado | `#8e8e93` | Cerrado |

  **Regla Color con Significado:** estos colores no se usan para nada más. El estado **siempre**
  se dice también en texto.
- **Neutros de iOS:** fondo agrupado `#f2f2f7`, superficie `#ffffff`, superficie hundida
  `#e9e9ee`, tinta `#0f1b2d` y tinta secundaria `#6c6c70`. El oscuro usa negro y `#1c1c1e`.

## Tipografía

La fuente del sistema (`system-ui`: SF Pro en iPhone, Roboto en Android). No se descarga
ninguna fuente. Las **cifras que cambian** (libres, porcentajes, horas) usan
`font-variant-numeric: tabular-nums` y peso 700. Jerarquía de iOS: título grande de 34 px en las
páginas, 22 px en hojas y tarjetas, cuerpo de 17 px, secundario de 15 px y etiqueta de 13 px.
**Los campos de texto usan 16 px o más**, para que el iPhone no haga zoom.

## Estructura

- **Celular (menos de 768 px):** la marca va arriba, compacta. La **barra de pestañas** va
  abajo, fija, translúcida y respetando el área segura: Mapa · Reportar · y, para el personal
  autorizado, Incidencias · Admin. En el mapa, la lista de puestos es una **hoja** que sube
  desde abajo y se recoge.
- **Computador:** la marca y las pestañas van arriba. En el mapa, el panel de puestos queda a la
  izquierda (360 px) y el mapa ocupa el resto.
- **Páginas de formulario o listas:** una columna de hasta 640 px, título grande y **listas
  agrupadas** (tarjetas blancas de 12 px de radio sobre el fondo gris).
- **Sin scroll horizontal** en ningún ancho, ni siquiera en 320 px.

## Mapa (signature)

Patrón de las mejores apps de estacionamiento: mapa a pantalla completa con una **tarjeta
flotante** abajo.

- Cada estacionamiento se pinta con el color de su semáforo, al 45 % de relleno. El borde
  **punteado morado** marca «solo profesores».
- Etiqueta permanente: el nombre y «**12** libres» (o «Cerrado»).
- Al tocar un estacionamiento, en el panel o en el mapa, el mapa vuela hasta él y aparece la
  **tarjeta del estacionamiento**: nombre, nivel en texto, y tres datos en columnas
  (**Libres · Ocupación · Capacidad**) con cifras tabulares. Debajo, el botón «Reportar un
  problema aquí».
- La **lista de puestos** va del que tiene más libres al que tiene menos, y los cerrados al
  final. Arriba muestra el total del campus («**312** puestos libres») y el estado del canal
  («En vivo» · «Reconectando…» · «Sin conexión»).
- Cuando llega un aviso, la cifra cambia y el estacionamiento **late una vez**.

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

Nada más se anima. **Todo se apaga con `prefers-reduced-motion`.**

## Accesibilidad

Contraste de 4,5:1 para el texto. El semáforo también se dice en texto (lectores de pantalla y
daltonismo). El foco es un anillo azul de 2 px. Las regiones vivas (`aria-live`) se usan para
el total y para los avisos. Zonas táctiles de 44 px como mínimo.

## Qué sí y qué no

**Sí:** un botón principal por pantalla · listas agrupadas · cifras tabulares · diseñar claro y
oscuro · probar en 320 y 375 px · respetar «reducir movimiento».

**No:** emoji como íconos · botones de solo ícono · colores del semáforo como decoración ·
sombras en tarjetas en reposo · librerías de componentes (Material, Bootstrap) · etiquetas en
mayúsculas encima de títulos · fuentes descargadas.

## Referencias

- Thinkdy (`~/UCAB/App-Estudio/DESIGN.md`) y Te Cambio (D-007 de ese proyecto), de Sebastian.
- Pinterest, búsqueda «parking app ui design» (27/oct/26): se tomó solo el patrón (mapa a
  pantalla completa con tarjeta flotante, tres datos en columnas y leyenda corta), no un diseño
  en particular.
