# back/pruebas · `npm test`

| Carpeta | Qué prueba |
|---|---|
| `unidad/` | Una prueba por clase: modelos, tácticas, servicios, el repositorio base y los datos iniciales |
| `integracion/` | Controlador + servicio + repositorio, con el código HTTP que vería Postman o el simulador (`ayuda.js` arma las peticiones) |
| `aceptacion/` | `criterios_sprint1.test.js`: un `describe` por HU y cada `test` nombra su criterio (CA) o regla (RN) |

Las pruebas de las **validaciones** están en `front/pruebas/validadores/`, porque las validaciones son del front.
