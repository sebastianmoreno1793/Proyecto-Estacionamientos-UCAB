# D-007 — ⭐ La app se ve como una app de iOS institucional de la UCAB (obligatoria para todo el equipo)

**Estado:** 🟢 Tomada
**Fecha:** 27/oct/26
**Decide:** Sebastian Moreno

> **Para el equipo:** toda pantalla, componente o estilo que se agregue al Radar sigue esta
> decisión y `producto/DESIGN.md` (en el código: `RadarEstacionamientos_code/DESIGN.md`). Un PR
> que no la cumpla no se fusiona. Si crees que algo debe cambiar, se propone una nueva decisión;
> no se cambia en el código.

## Contexto

El Radar se usa sobre todo **desde el celular, llegando al campus**: hay que entender en un
vistazo dónde hay puesto. Hasta el 27/oct cada pantalla tenía un estilo distinto (menú azul
genérico, formularios sueltos) y no había una guía. Si cada integrante diseña a su manera, la
app se ve hecha por partes, y eso también se ve en la defensa.

Sebastian ya tiene un sistema de diseño probado en dos PWA propias:
- **Thinkdy** (`~/UCAB/App-Estudio/DESIGN.md`): estilo iOS institucional UCAB, con Azul
  Montalbán, oro escaso y color con significado.
- **Te Cambio** (D-007 de ese proyecto): el vocabulario de movimiento.

## Opciones consideradas

| Opción | A favor | En contra |
|---|---|---|
| Cada uno diseña su pantalla | Nada que acordar | La app se ve armada por partes; nadie revisa |
| Una librería de componentes (Material, Bootstrap) | Rápido | Se ve genérica, «hecha por IA»; Sebastian ya la rechazó en Thinkdy |
| **Sistema propio de Thinkdy, adaptado al Radar** | Probado, institucional, documentado, y la skill `impeccable` ya lo sabe revisar | Hay que aprenderlo (1 página: `DESIGN.md`) |

## Decisión

**Estructura iOS, identidad institucional UCAB, una maqueta del campus en vez de un mapa de
calles y color solo con significado.** Las reglas completas están en `producto/DESIGN.md`. Las
que no se pueden romper son estas:

0. **La pantalla de inicio es una maqueta del campus vista desde arriba** (estática, con
   texturas, como una maqueta física de arquitectura), con el semáforo encima. No se usan mapas
   de calles. La imagen sale del render del simulador (`/maqueta`); ver `DESIGN.md › Maqueta`.

1. **Una Voz:** el **Azul Montalbán** (`#1d4f91`) es el único color que invita a tocar.
2. **Color con significado:** verde y rojo son **solo el semáforo** (hay o no hay puesto,
   D-009; el rojo, también los errores). Gris es «cerrado» o «sin datos». Nada decorativo de
   esos colores.
3. **Oro escaso:** el Oro de Sello (`#c8962e`) solo aparece en la marca (el punto del radar).
4. **Fuente del sistema** (SF Pro en Apple, Roboto en Android). Las cifras que cambian (puestos
   libres, porcentajes, horas) van en **cifras tabulares**. No se descargan fuentes.
5. **Celular primero:** se diseña y se prueba primero a 375 px y a 320 px, sin scroll
   horizontal. Todo control mide **44 px** de alto como mínimo y los campos de texto usan
   **16 px** o más.
6. **Botones con texto:** ningún botón es solo un ícono. Los íconos son SVG de línea, no emoji.
7. **Plano por defecto:** sin sombras en listas ni tarjetas; solo flota lo que flota (hojas,
   avisos, la tarjeta del panel sobre el mapa).
8. **Movimiento de Te Cambio y nada más:** al pulsar baja a escala 0,97; las hojas suben desde
   abajo (340 ms); las cifras cuentan. Todo se apaga con «reducir movimiento».
9. **Tema claro y oscuro**, los dos diseñados (el oscuro sigue al sistema).
10. **Accesible:** contraste 4,5:1 para el texto, foco visible, y el estado nunca solo por
    color (el semáforo también se dice en texto: «No hay puesto», «12 libres»).

**Cómo se revisa:** con la skill **`impeccable`** (instalada en cada computadora; no va en el
repo). Antes de pedir revisión de un PR con interfaz, se corre `/impeccable critique` sobre la
pantalla y se arreglan los P1. En la revisión del PR se marca la casilla de diseño de la
plantilla.

## Por qué

- La profesora evalúa lo que ve en la defensa: una app coherente se defiende mejor.
- El usuario está en el carro: necesita leer el semáforo de un vistazo, con una mano.
- El sistema ya existe y está documentado. Adaptarlo cuesta menos que inventar uno.

## Consecuencias

- `producto/DESIGN.md` y `producto/PRODUCT.md` se copian a la raíz del código con
  `sincronizar.sh`, porque ahí los busca la skill `impeccable`.
- La plantilla de PR agrega la casilla «Sigue D-007 (diseño) y D-008 (PWA)».
- Lo que ya está hecho (formularios de 5.4, 6.1, 8.1 y 9.1) se ajusta al sistema en su
  próximo cambio. El mapa y el menú ya se ajustaron el 27/oct (HU 4.2).

## Revisión del 09/nov/26 (versión 2)

**Decide:** Sebastian Moreno. Se mantiene la idea (iOS, maqueta, semáforo de dos estados, Azul
Carnet como identidad) y se simplifica la superficie: **responsive, con una parte de teléfono y una de web de la misma
familia**, cuatro pestañas (flotantes abajo en el teléfono, arriba en el computador) (Inicio, Mapa, Reportar, Perfil), fondo claro con letra
negra gruesa (referencia: Cashea), sin textos que expliquen el sistema, y tarjetas pastel solo
para identificar tipos. Detalle en `DESIGN.md` › «Versión 2».

**Por qué:** la app se veía sobrecargada; las apps de referencia resuelven cada tarea con pocos
toques y casi sin texto. **Reemplaza** de la versión 1: la barra Azul Carnet arriba y la regla «Azul Montalbán como único color»
(ahora los pastel identifican tipos; el verde y el rojo siguen reservados al semáforo).

## Cuándo revisarla

Si la profesora o el equipo piden otra identidad, o si una prueba con usuarios muestra que algo
no se entiende. Se cambia con una decisión nueva, no en el código.
