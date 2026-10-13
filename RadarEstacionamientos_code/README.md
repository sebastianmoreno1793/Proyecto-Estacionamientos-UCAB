# Radar de Estacionamientos UCAB — código

Aplicación web en Next.js (ver `docs/stack_y_arquitectura.md`).

## Cómo correrla

```bash
cd RadarEstacionamientos_code
npm install
npm run dev      # abre http://localhost:3000
npm test         # pruebas de los datos
```

## Dónde está cada cosa

| Carpeta | Qué hay |
|---|---|
| `app/` | Páginas (Next.js App Router) |
| `components/` | Piezas de la interfaz, por ejemplo `MapaCampus.js` (HU 5.1) y `Mapa3D.js` (HU 3.2) |
| `data/` | Datos fijos: los estacionamientos (provisional) y el campus para el 3D (`campus.js`) |
| `maqueta_3d/` | **Capturas y guía de la maqueta 3D del campus** (se abre en `/simulacion`) |
| `tests/` | Pruebas que se corren con `npm test` |
| `docs/` | Copia de la carpeta de lógica. **No se edita aquí.** |
