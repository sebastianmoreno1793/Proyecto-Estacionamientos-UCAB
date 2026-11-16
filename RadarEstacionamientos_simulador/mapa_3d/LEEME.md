# mapa_3d · cálculos del mundo 3D (sin dibujar nada)

Clases sin Three.js ni navegador: se prueban con `npm test`.

- `Coordenadas`: GPS → metros (1 unidad de Three.js = 1 metro; origen en `CENTRO_CAMPUS`).
- `Poligono`: dentro/fuera, áreas, distancias, punto interior y reparto de puestos.
- `Relieve`: altura del terreno real (SRTM), suavizada.
- `Suelo`: el relieve con terrazas planas (estacionamientos, canchas, plazas).
- `GrafoDeVias`: el camino del carro por las vías reales, desde y hacia la garita.
- `Aleatorio`: números al azar; con semilla, siempre la misma serie.

Las usan las clases de `escena_3d/` y los escenarios de prueba.
