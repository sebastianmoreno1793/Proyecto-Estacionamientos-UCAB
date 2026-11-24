# escena_3d · el mundo virtual en Three.js

Clases que dibujan y animan el campus. Usan los cálculos de `mapa_3d/` y los datos de `datos_campus/`.

| Clase | Qué hace |
|---|---|
| `MundoVirtual3D` | Arma la escena (cámara, luces, controles), reúne las partes y corre el bucle de animación |
| `EstadoDelMapa` | Lo que llegó de la app base y las órdenes pendientes (carros, enfocar) |
| `TerrenoDelCampus` | Relieve con terrazas, cerca, vías, canchas, plazas, edificios, puntos de interés y árboles |
| `Garita3D` | Caseta, talanquera, semáforo y lector de placas |
| `Estacionamiento3D` | Un estacionamiento: losa, puestos, carros estacionados, cartel del semáforo, cierre e incidencias |
| `TraficoDeCarros` | Los carros que entran y salen por las vías; piden enviar la lectura de placa y el aviso |
| `Etiquetas3D` | Etiquetas de texto que cambian de tamaño con la distancia |
| `Texturas3D`, `Piezas3D`, `Medidas3D` | Texturas de texto, geometrías que se repiten, y medidas y colores |
| `MaquetaDelCampus`, `TexturasDeMaqueta` | El render estático desde arriba que usa el Mapa de la app |

Los componentes de React (`componentes_visuales/Mapa3D.js` y `MaquetaRender.js`) solo crean estas
clases y les pasan lo que llega de la página.
