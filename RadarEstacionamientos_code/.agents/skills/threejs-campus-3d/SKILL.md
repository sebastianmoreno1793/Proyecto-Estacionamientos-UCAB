---
name: threejs-campus-3d
description: >-
  Skill para construir y mantener la maqueta 3D del campus UCAB Montalbán
  usando Three.js. Activar cuando el usuario pida cambios al mapa 3D,
  maqueta, edificios, estacionamientos, terreno, vías o cualquier
  elemento visual del campus en 3D.
---

# Three.js Campus 3D — Guía para la maqueta UCAB Montalbán

## Principio fundamental

La maqueta 3D debe ser una representación **geográficamente fiel** del campus
real de la UCAB Montalbán, Caracas. TODAS las posiciones se derivan de
coordenadas GPS reales. NUNCA inventes posiciones arbitrarias.

---

## 1. Fuente de verdad de posiciones

| Qué | Archivo | Fuente |
|---|---|---|
| 14 estacionamientos (polígonos, `soloProfesores`, `pisos`) | `data/estacionamientos.js` | Satelital, OSM y lo que marcó German |
| Contorno, edificios, vías, canchas, plazas, puntos de interés | `data/campus.js` | OpenStreetMap |
| Garita y trayectos de llegada/salida por la Av. Teherán | `data/campus.js` (`GARITA`) | OpenStreetMap |
| Relieve (rejilla de alturas) | `data/campus.js` (`RELIEVE`) | SRTM 30 m (NASA) |

- `CENTRO_CAMPUS = [10.4637, -66.9770]` es el origen `(0, 0, 0)` del mundo 3D.
- Para corregir un dato, se cambia el archivo de datos; el componente no se toca.
- Para agregar algo que falte, sácalo de OpenStreetMap (ver skill `campus-ucab-datos`)
  y agrégalo a `data/campus.js` con su id de OSM. Lo que sea estimado se marca como tal.

---

## 2. Conversión GPS → metros 3D

SIEMPRE usa `gpsAMetros` de `lib/mapa3d/geo.js`. 1 unidad Three.js = 1 metro real.

```js
const LAT_CENTER = 10.4637;
const LON_CENTER = -66.9770;
const M_PER_DEG_LAT = 110540;
const M_PER_DEG_LON = 111320 * Math.cos(LAT_CENTER * Math.PI / 180);

function gpsAMetros(lat, lon) {
  return {
    x: (lon - LON_CENTER) * M_PER_DEG_LON,   // Este (+) / Oeste (−)
    z: -(lat - LAT_CENTER) * M_PER_DEG_LAT   // Sur (+) / Norte (−)
  };
}
```

Contra el elipsoide WGS84 (el de los GPS) el error es de ~0,06%: medio metro en todo el
campus. No la compares con haversine sobre una esfera, que exagera el norte-sur un 0,5%.

### Verificación rápida

- Campus (contorno de OSM): **~930 m de este a oeste × 610 m de norte a sur, ~20 ha**.
- El relieve cubre ~1150 × 885 m, con el campus y sus alrededores.
- Garita (noreste) → Playa: ~340 m. Playa → Sambilito: ~265 m.

---

## 3. Polígonos reales con THREE.Shape

```js
// Forma en el plano XY; rotateX(−π/2) la acuesta y manda y → −z.
// Por eso se usa −z: con Vector2(x, z) el mapa sale ESPEJADO de norte a sur.
function formaDe(pts) {
  return new THREE.Shape(pts.map((p) => new THREE.Vector2(p.x, -p.z)));
}

function losa(pts, abajo, arriba) {
  const geo = new THREE.ExtrudeGeometry(formaDe(pts), { depth: arriba - abajo, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, abajo, 0);
  return geo;
}
```

**Reglas:**
- NO uses BoxGeometry para estacionamientos ni edificios. Usa la forma real del polígono.
- El sentido de los vértices (horario o antihorario) no importa: ExtrudeGeometry lo
  corrige. Lo que importa es el signo de z.
- Cada estacionamiento es una losa sobre su terraza del relieve. Los que se tocan
  (Sambilito, Presambilito…) comparten terraza.
- El Sambilito (`pisos: 3`) lleva losas cada 3,2 m (techo a ~9,6 m), columnas y antepechos.
- Los estacionamientos con `soloProfesores: true` llevan losa `0x1e3a5f`, borde violeta y
  un letrero «SOLO PROFESORES».
- Edificios: altura = `pisos × 3,5 m`, fachada con franjas de ventanas (textura de canvas).

---

## 4. Semáforo de ocupación (NO modificar)

```
Verde   → ocupación < 50%
Amarillo → ocupación 50% a < 80%
Naranja  → ocupación 80% a < 95%
Rojo     → ocupación ≥ 95%
```

Las funciones `obtenerColorSemaforo()` y `crearTexturaCartel()` se mantienen sin cambios.
- El cartel es un `Sprite` sobre un tótem, en el punto interior del polígono. Su tamaño
  cambia con la distancia para leerse siempre.
- El cartel mide 512 px de ancho: los nombres largos se acortan con `nombreParaCartel`
  (p. ej., «Prof. Centro Cultural»).
- A la textura se le pone `colorSpace = SRGBColorSpace` fuera de la función.
- Los puestos libres salen de `puestosLibres()` (`lib/estacionamientos/reglas.js`).

---

## 5. Performance Three.js

### Obligatorio
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
- Shadow map máximo: 2048 × 2048
- Disponer geometrías, materiales y texturas en el cleanup del useEffect
- `cancelAnimationFrame()` en el cleanup

### Three.js r186
- `PCFSoftShadowMap` ya no existe (avisa y cae a `PCFShadowMap`): usa `PCFShadowMap`.
- `THREE.Clock` está obsoleto desde r183: usa `THREE.Timer` (`timer.update(t)` en cada
  fotograma y `timer.connect(document)`).

### Optimización para objetos repetidos
- Usa `THREE.InstancedMesh` para árboles (>20 instancias del mismo árbol)
- Usa `THREE.InstancedMesh` para carros estáticos decorativos
- Máximo 6 luces puntuales con sombras. Usa AmbientLight + 1 DirectionalLight
  como base.
- Las vías van en una sola malla por tipo (cintas pegadas al relieve), no una por calle.

### Si hay lag
- Reducir cantidad de árboles
- Simplificar geometría de edificios secundarios
- Desactivar sombras en objetos pequeños

---

## 6. Animación del carro

- La garita está en la esquina **noreste**, sobre la Av. Teherán (talanquera = nodo OSM
  1811067139). Su posición y los trayectos `llegada`/`salida` salen de `GARITA`.
- El carro llega por la calzada de la Av. Teherán que va hacia el este y entra por el
  ramal de un carril. Sale por el otro ramal, que vuelve a la Av. Teherán.
- Dentro del campus sigue las vías reales con `lib/mapa3d/rutas.js`: es un grafo de las
  vías de OSM que respeta los sentidos únicos.
- La vía principal es un **anillo de sentido único**: desde la garita se va al oeste por la
  calzada sur y se vuelve al este por la norte. Por eso ir a la Playa da la vuelta entera.
- Cada evento crea su propio carro; en hora pico hay varios a la vez. El carro entra de
  trompa a un puesto libre y, al llegar, la ocupación del cartel se actualiza con la que
  devolvió la API.
- Mantener los props del componente: `estacionamientos`, `ultimoEvento`,
  `onDispararEvento`.

---

## 7. Validación post-cambio

`npm test` corre `tests/mapa3d.test.js`, que comprueba casi todo esto. Además, a ojo:

1. **Distancias**: Playa ↔ Sambilito ≈ 265 m; el test compara todas las parejas
   contra el elipsoide WGS84 (±0,5%).
2. **Orientación**: Playa al norte, Sambilito al centro-sur, Postgrado al oeste,
   Cincuentenario al oeste-suroeste, Pádel al suroeste, Centro de Estudiantes al noreste.
   Usa la brújula (abajo a la izquierda) o la vista cenital con el norte arriba.
3. **Garita**: en la esquina noreste, donde termina la Av. Teherán.
4. **Escala total**: el contorno mide ~930 × 610 m.
5. **Relieve**: lo más bajo es la Playa (norte, ~920 m) y lo más alto las canchas
   (sur, ~975 m).
6. **Puestos libres**: los letreros muestran datos correctos con colores del
   semáforo.
7. **Animación**: el carro entra por la garita, espera la talanquera y llega al
   estacionamiento correcto por las vías, sin atravesar edificios.
