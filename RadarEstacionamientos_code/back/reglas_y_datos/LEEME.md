# back/reglas_y_datos · qué se permite y dónde se guarda, por tema

Una carpeta por tema y, en cada una, dos archivos:

- `reglas.js`: dice qué se permite y hace las cuentas (por ejemplo «la placa tiene que tener este
  formato» o «quedan 3 puestos libres»). No guarda nada, por eso se prueba fácil. Etiqueta `[regla]`.
- `datos.js`: guarda y busca los datos usando esas reglas. Los guarda en
  `../piezas_compartidas/almacen.js`. Etiqueta `[datos]`.

| Tema | HU |
|---|---|
| `estacionamientos/` | 3.1, 4.1, 4.2, 5.4 |
| `garita/` | 3.2 |
| `incidencias/` | 9.1 |
| `edificios/` | 6.1 |
| `sugerencia/` | 7.2 |
| `usuarios/` | 1.1 |
| `vehiculos/` | 2.1 |

**Dónde se guarda cada cosa (todavía no hay base de datos, así que vive mientras la app está
prendida):** estacionamientos, movimientos, lecturas e incidencias van en
`../piezas_compartidas/almacen.js`, que es lo que borra «Reiniciar» del simulador. Usuarios y sesiones (`usuarios/datos.js`) y vehículos
(`vehiculos/datos.js`) tienen su propia lista y **no** se borran al reiniciar la demo, para no
cerrarle la sesión a nadie. Todo se pierde al apagar el servidor.
