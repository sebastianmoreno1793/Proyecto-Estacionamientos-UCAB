# back · lo que pasa en el servidor

Aquí se decide todo lo que el usuario no ve: qué se permite, qué se guarda y qué se le contesta a
cada pantalla. No depende de Next.
La columna **Simulador** dice qué usa la app del simulador (`RadarEstacionamientos_simulador`).
En VS Code, busca `[simulador]` (⌘⇧F) para ver cada función que conecta con él.

| Carpeta | Qué hay dentro, dicho fácil | Simulador |
|---|---|---|
| `pedidos_y_respuestas/` | Recibe lo que piden las pantallas, el simulador o Postman (por ejemplo «dame los estacionamientos») y contesta. Un archivo por dirección `/api/...` | ✅ casi todos (ver su `LEEME.md`) |
| `reglas_y_datos/` | Una carpeta por tema (vehículos, incidencias, edificios…). `reglas.js` dice qué se permite y `datos.js` guarda y busca | — (lo usa a través de `pedidos_y_respuestas/`) |
| `piezas_compartidas/` | Lo que usan todos los temas: dónde se guardan los datos mientras la app está prendida, el aviso en vivo cuando algo cambia y el formato de las fechas | ✅ el aviso en vivo (`eventos_en_vivo.js`) |
| `control_de_acceso/` | Quién puede entrar: la sesión del usuario y la clave de los sensores | ✅ los dos (el simulador manda la clave y reenvía la sesión) |
| `datos_del_campus/` | Los edificios, los estacionamientos y cuántos puestos tiene cada uno al arrancar | ✅ `estacionamientos.js` y `maqueta.json` |
| `pruebas_automaticas/` | Revisan solas que todo funcione (`npm test`) | — |
