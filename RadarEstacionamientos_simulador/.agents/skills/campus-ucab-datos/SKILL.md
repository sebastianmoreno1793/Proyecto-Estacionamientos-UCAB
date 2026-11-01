---
name: campus-ucab-datos
description: >-
  Datos de referencia del campus UCAB Montalbán: edificios, topografía,
  vías, estacionamientos y distribución espacial. Activar cuando se
  necesite saber la disposición real del campus para la maqueta 3D,
  posicionar edificios, trazar vías o verificar la fidelidad geográfica.
---

# Campus UCAB Montalbán — Datos de referencia

Datos medidos el 13/oct/26 con OpenStreetMap y SRTM; están cargados en
`data/campus.js` del simulador. Las posiciones `(x, z)` son metros desde `CENTRO_CAMPUS`:
x = este (+), z = sur (+).

## Cómo conseguir datos que falten

La web casi no tiene información de los edificios del campus. **OpenStreetMap es la
fuente útil**:

1. **API de OSM** (todo lo que hay en un recuadro, rápido y sin límite de tiempo):
   `https://api.openstreetmap.org/api/0.6/map?bbox=-66.9825,10.4595,-66.9720,10.4670`
   (oeste, sur, este, norte). Pide un `User-Agent` propio.
2. **Overpass** (consultas por etiqueta): `overpass-api.de` suele saturarse; el espejo
   `overpass.private.coffee` respondió bien. Contorno del campus: relación `3644537`.
3. **Relieve**: `https://api.opentopodata.org/v1/srtm30m?locations=lat,lon|lat,lon…`
   (máx. 100 puntos por llamada, 1 llamada por segundo).
4. **Google Maps / fotos**: sirven para estimar alturas o confirmar formas, no para
   coordenadas.
5. Lo que se agregue lleva su id de OSM. Lo que sea estimado se marca como estimado.

---

## Ubicación geográfica

| Dato | Valor |
|---|---|
| Nombre completo | Universidad Católica Andrés Bello — Sede Montalbán |
| Dirección | Final Av. Teherán, Urb. Montalbán, La Vega, Caracas |
| Coordenadas centro | 10.4637° N, 66.9770° O |
| Entorno | Límite suroeste del valle de Caracas: la Autopista Gran Cacique Guaicaipuro al norte, los cerros de La Vega y Antímano al sur |
| Altitud | ~920 m (norte) a ~975 m (sur) sobre el nivel del mar (SRTM) |
| Dimensiones (contorno OSM) | ~930 m de este a oeste × ~610 m de norte a sur, ~20 ha |
| Forma | Franja diagonal suroeste–noreste, pegada a la autopista |

---

## Topografía

El campus **sube de norte a sur**: la parte baja está junto a la autopista y la alta,
contra los cerros del sur. No está en la ladera del Ávila.

| Punto | Altitud (SRTM suavizado) |
|---|---|
| Playa (norte) | ~920 m — lo más bajo |
| Garita (noreste) | ~927 m |
| Núcleo académico (Aulas, Centro Cultural) | ~923–933 m |
| Sambilito | ~936 m |
| Pádel (suroeste) | ~948 m |
| Canchas de fútbol y béisbol (sur) | ~966–975 m — lo más alto |

- Desnivel dentro del campus: ~55 m. Al sureste, fuera del campus, el cerro pasa de 1000 m.
- En el 3D, `RELIEVE` es una rejilla de 33 × 43 puntos (~28 m); `crearRelieve` la suaviza
  y `crearSuelo` hace terrazas planas bajo estacionamientos, canchas y plazas.
- SRTM es un modelo de superficie (incluye algo de árboles y techos); por eso se suaviza.

---

## Edificios principales (OSM)

| Edificio | OSM | Posición (x, z) | Pisos | Notas |
|---|---|---|---|---|
| Edificio de Aulas (Módulos) | 571493130 | (63, −56) centro | 5 *estimado* | OSM dice 12 niveles, pero SRTM no muestra un edificio de ~42 m. Confirmar |
| Edificio Cincuentenario | 571493131 | (−99, 16) centro-oeste | 6 (OSM) | |
| Centro Cultural (Biblioteca) | 571493133 | (35, −153) norte | 4 *estimado* | Biblioteca según OSM |
| Biblioteca «Antigua» | 571493134 | (97, −166) norte | 2 *estimado* | |
| Edificio de Laboratorios | 571493135 | (284, −119) este | 3 (OSM) | Junto a `est-labs` (labs de Ingeniería) |
| Edificio de Postgrado | 680700222 | (−85, −66) oeste | 3 *estimado* | Junto a `est-postgrado` |
| Capilla Nuestra Señora de Coromoto | 680700224 | (172, −149) noreste | 1 alto | Paredes de ~8 m, techo a dos aguas y cruz |
| Aula Magna | 680700227 | (154, −174) noreste | 3 *estimado* | Teatro |
| Cafetín (Mr. Sub) | 1253401640 | (−43, −14) centro | 2 *estimado* | Sin nombre en OSM; el punto «Mr. Sub» cae dentro |
| Sambilito | 680700245 | (43, 16) centro-sur | 3 | Es un estacionamiento: está en `data/estacionamientos.js` de la app base |

- Otros 12 edificios sin nombre en OSM se dibujan grises con 2 pisos *estimados*.
- Puntos de interés en OSM: Estatua de Andrés Bello (25, −92), Granier (44, −56),
  Banco Mercantil (en el Edificio de Aulas) y un punto de recarga eléctrica (−101, −99).
- **No están en OSM ni en la web** (por eso no se dibujan): Rectorado y Centro de
  Estudiantes. Hay que ubicarlos en la visita o pedírselos a German.

---

## Los 14 estacionamientos

Fuente de verdad: `RadarEstacionamientos_code/data/estacionamientos.js` de la app base
(coordenadas GPS reales); el simulador los pide por `GET /api/estacionamientos`.
Centro aproximado de cada uno, en metros (x, z).

### Estudiantes (10 zonas)
| ID | Nombre | Centro (x, z) | Zona | Notas |
|---|---|---|---|---|
| est-playa | Playa | (80, −238) | Norte, junto a la autopista | Lo más bajo del campus |
| est-postgrado | Postgrado | (−144, −38) | Oeste | Al lado del Edificio de Postgrado |
| est-centro-estudiantes | Centro de Estudiantes | (273, −163) | Noreste | Alargado de este a oeste, cerca de la garita |
| est-labs | Labs | (207, −113) | Este | Pequeño (~380 m²), junto al Edificio de Laboratorios |
| est-cincuentenario | Cincuentenario | (−73, 49) | Oeste-suroeste | Al sur del Edificio Cincuentenario |
| est-sambilito | Sambilito | (37, 23) | Centro-sur | EDIFICIO de 3 pisos |
| est-presambilito | Presambilito | (120, 4) | Centro-sur | Al aire libre, al este del Sambilito |
| est-presambilito-oeste | Presambilito (oeste) | (96, 11) | Centro-sur | Se superpone con Presambilito |
| est-padel | Pádel | (−363, 204) | Suroeste, extremo del campus | Se llega por una vía de servicio desde el anillo |
| est-padel-norte | Pádel (norte) | (−229, 90) | Suroeste | |

### Profesores (4 zonas — `soloProfesores: true`)
| ID | Nombre | Centro (x, z) | Zona |
|---|---|---|---|
| prof-centro-cultural | Profesores · Centro Cultural | (28, −188) | Norte |
| prof-postgrado | Profesores · Postgrado | (−96, −44) | Oeste |
| prof-aulas | Profesores · Aulas | (116, −42) | Centro, franja al sur del Edificio de Aulas |
| prof-presambilito | Profesores · Presambilito | (195, −15) | Centro-este |

---

## Vías del campus (OSM)

### Acceso
- Entrada y salida por la **Av. Teherán**, en la **esquina noreste** del campus. La
  talanquera es el nodo OSM 1811067139, en (409, −150).
- La Av. Teherán es de doble calzada (sentido único cada una, 3 carriles).
  - **Entrada:** se toma desde la calzada que va hacia el este (OSM 229363420) por un ramal
    de 1 carril (OSM 169959633) hasta la talanquera.
  - **Salida:** por otro ramal (OSM 169959636), que vuelve a la Av. Teherán hacia el este.
- En `data/campus.js`, `GARITA.llegada` y `GARITA.salida` son esos trayectos.
- En la app base, el lector de placas de esta garita es `POST /api/garita/lecturas` y los
  sensores de los estacionamientos, `POST /api/avisos`.

### Circulación interna
- Anillo de **sentido único** (~700 m por lado) alrededor del núcleo académico:
  - desde la garita se va hacia el **oeste** por la calzada sur (OSM 169959635);
  - se vuelve hacia el **este** por la calzada norte (OSM 245061143).
- En el extremo oeste del anillo hay un ramal de salida a la autopista (Distribuidor
  Antímano, OSM 245061149). El 3D no lo usa: todos los carros salen por la garita.
- Vías de servicio y pasillos de los estacionamientos: tipo `interna`. El Pádel se alcanza
  por la vía de servicio OSM 169959631.
- Caminerías peatonales (tipo `peatonal`), incluida la «Pasarela de la UCAB» sobre la autopista.

### Para el mapa 3D
- Asfalto `0x272f3d` en el anillo y los accesos. Anchos: anillo 7 m, accesos 5,5 m,
  internas 4,5 m, peatonales 2,2 m.
- Líneas viales amarillas discontinuas (`0xfacc15`) en el anillo y los accesos.
- Las curvas se suavizan (Catmull-Rom) y las vías siguen el relieve.

---

## Vegetación y paisaje

- La UCAB tiene **abundante vegetación**, pero OSM no tiene árboles marcados en el campus.
- En el 3D hay 60 árboles **decorativos** (tronco + copa, `InstancedMesh`). Se reparten al
  azar con semilla fija en las áreas verdes, lejos de edificios, vías y estacionamientos.
- Áreas de OSM: «Jardines centrales» (`leisure=park`), Plaza Mickey, canchas de fútbol,
  béisbol y baloncesto al sur.
