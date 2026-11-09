# back · lógica y API

Todo lo que pasa en el servidor: las reglas del negocio, los datos y los endpoints que usan el
front, Postman, el simulador y los sensores. No depende de Next.

| Carpeta | Qué tiene |
|---|---|
| `api/` | Un archivo por endpoint (`/api/...`): recibe la petición, valida, llama a `logica/` y responde JSON |
| `logica/` | Reglas y datos por tema (estacionamientos, incidencias, edificios…) |
| `campus/` | Datos fijos del campus: estacionamientos, edificios y la maqueta |
| `pruebas/` | Pruebas automáticas (`npm test`) de los criterios de aceptación |
