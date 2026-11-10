# back · lógica y API

Todo lo que pasa en el servidor: reglas del negocio, datos y endpoints. No depende de Next.
La columna **Simulador** dice qué usa la app del simulador (`RadarEstacionamientos_simulador`).
En VS Code, busca `[simulador]` (⌘⇧F) para ver cada función que conecta con él.

| Carpeta | Qué tiene | Simulador |
|---|---|---|
| `api/` | Un archivo por endpoint (`/api/...`): valida, llama a `logica/` y responde JSON | ✅ casi todos (ver `api/LEEME.md`) |
| `logica/` | Reglas y datos por tema (estacionamientos, incidencias, edificios…) | — (lo usa a través de `api/`) |
| `comun/` | Almacén en memoria, canal en vivo y fechas | ✅ el canal en vivo (`eventos_en_vivo.js`) |
| `seguridad/` | Sesión (cookie) y clave de los sensores | ✅ los dos (el simulador manda la clave y reenvía la cookie) |
| `campus/` | Datos fijos del campus y capacidad inicial de la demo | ✅ `estacionamientos.js` y `maqueta.json` |
| `pruebas/` | Pruebas automáticas (`npm test`) | — |
