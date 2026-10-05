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
| `components/` | Piezas de la interfaz, por ejemplo `MapaCampus.js` (HU 5.1) |
| `data/` | Datos fijos, por ejemplo la lista de estacionamientos (provisional) |
| `tests/` | Pruebas que se corren con `npm test` |
| `docs/` | Copia de la carpeta de lógica. **No se edita aquí.** |
