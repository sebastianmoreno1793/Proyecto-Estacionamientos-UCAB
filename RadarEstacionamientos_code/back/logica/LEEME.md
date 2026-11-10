# back/logica · reglas y datos por tema

Una carpeta por tema y, en cada una, dos archivos:

- `reglas.js`: funciones puras que validan o calculan (no guardan nada). Etiqueta `[regla]`.
- `datos.js`: leen y guardan en el almacén (`../comun/almacen.js`) usando las reglas. Etiqueta `[datos]`.

| Tema | HU |
|---|---|
| `estacionamientos/` | 3.1, 4.1, 4.2, 5.4 |
| `garita/` | 3.2 |
| `incidencias/` | 9.1 |
| `edificios/` | 6.1 |
| `sugerencia/` | 7.2 |
| `usuarios/` | 1.1 |
| `vehiculos/` | 2.1 |

**Dónde se guarda cada cosa (en memoria, mientras no hay base de datos):** estacionamientos,
movimientos, lecturas e incidencias van en el almacén común (`../comun/almacen.js`), que es lo que
borra «Reiniciar» del simulador. Usuarios y sesiones (`usuarios/datos.js`) y vehículos
(`vehiculos/datos.js`) tienen su propia lista y **no** se borran al reiniciar la demo, para no
cerrarle la sesión a nadie. Todo se pierde al apagar el servidor.
