# back/basedatos · los datos mientras no hay base de datos

`AlmacenEnMemoria.js` guarda registros simples (como tablas) en memoria; se borran al apagar el
servidor. Solo lo usan los repositorios. `reiniciar()` vuelve el campus a los datos de ejemplo y
conserva las cuentas y sesiones; `reiniciarTodo()` (pruebas) borra también usuarios y vehículos.

| `datos_iniciales/` | Qué tiene | Simulador |
|---|---|---|
| `estacionamientos.js` | Los 14 estacionamientos con su forma (HU 5.1) | ✅ una prueba del simulador comprueba que coincidan |
| `capacidad_inicial.js` | Capacidad y ocupación con las que arranca la demo | — |
| `edificios.js` | Catálogo inicial de edificios con su ubicación (HU 6.1 y 7.2) | — |
| `usuarios_de_prueba.js` | Las tres cuentas de prueba (solo en desarrollo) | — |

La proyección de la maqueta (`maqueta.json`) es del front: está en `front/public/maqueta/`.
