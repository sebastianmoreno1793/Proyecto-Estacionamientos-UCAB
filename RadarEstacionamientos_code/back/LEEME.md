# back · el servidor, en capas (estilo Spring MVC, con nombres en español)

Recibe lo que piden las pantallas, los sensores, Postman y el simulador, aplica las reglas de
negocio y guarda los datos. No depende de Next: usa `Request` y `Response` estándar.

El back tiene **2 supracomponentes** y una **clase central**:

- `logica/` · **Lógica de negocio**: controladores, servicios, modelos, DTO y tácticas.
- `datos/` · **Acceso a datos**: repositorios y base de datos (almacén en memoria).
- `Fabrica.js` · **clase central**: crea una sola vez cada pieza de los dos supracomponentes y las conecta.

```
ruta (front/app/api/**/route.js) → logica/controladores/ → logica/servicios/ → datos/repositorios/ → datos/basedatos/
                                        │                    │  └─ logica/modelos/ (reglas de negocio)
                                        │                    └──── logica/dto/ (lo que entra y sale)
                                        └─ logica/tacticas/ (precondición y disponibilidad)
```

| Carpeta | Capa | Qué va | Regla de la capa |
|---|---|---|---|
| `logica/controladores/` | Control | Uno por recurso de la API. Revisa la **precondición** (táctica), arma el DTO, llama al servicio y responde con el código HTTP | **No valida** datos (eso es del front) |
| `logica/servicios/` | Servicio | Las reglas de negocio de cada HU que necesitan varios modelos o datos guardados (placa única, nombre de edificio único…) | Solo llama a repositorios, modelos, DTO y tácticas |
| `datos/repositorios/` | Acceso a datos | Lo **único** que toca los datos. Recibe y devuelve modelos | Al llegar la base de datos se cambia solo esta capa |
| `logica/dto/` | DTO | Lo que entra (cuerpo de la petición) y lo que sale (nunca el modelo «bruto», nunca correos ni contraseñas al público) | Solo arma datos; no decide nada |
| `logica/modelos/` | Modelo | Entidades con atributos **privados** (`#`) y sus reglas de negocio como métodos | No saben de HTTP ni de datos guardados |
| `logica/tacticas/` | Tácticas de calidad | Una clase por táctica, dibujada en el diagrama de clases | Ver la tabla de abajo |
| `datos/basedatos/` | Datos | `AlmacenEnMemoria` (mientras no hay base de datos) y `datos_iniciales/` del campus | Solo la usan los repositorios |
| `Fabrica.js` | — | Crea una sola vez cada pieza y las conecta de abajo hacia arriba | — |
| `pruebas/` | — | `unidad/` (una por clase), `integracion/` (controlador + servicio + repositorio, como Postman) y `aceptacion/` (criterios del Sprint 1) | `npm test` |

## Tácticas

| Táctica | Atributo | Táctica del catálogo | Dónde actúa |
|---|---|---|---|
| `AutenticadorDeSensores` | Seguridad | Autenticar actores | `x-clave-sensor` en `POST /api/avisos` y `POST /api/garita/lecturas` (401) |
| `ControlDeAcceso` | Seguridad | Autorizar actores (precondición) | Sesión iniciada (401) y rol de administrador (403) |
| `FiltroDeAvisos` | Disponibilidad | Ignorar comportamiento defectuoso + límite | Un aviso imposible (lleno, vacío) no cambia el aforo, queda registrado y el sistema sigue; con 3 seguidos, «sensor con falla» |
| `MonitorDeSensores` | Disponibilidad | Detectar fallas con timeout | Un estacionamiento que no avisa en 30 min (`TIEMPO_LIMITE_SENSOR_MIN`) se marca «sin avisar» |

## Validación, precondición y regla de negocio

| Qué es | Ejemplo | Dónde |
|---|---|---|
| Validación (formato) | capacidad entera 1–2000, correo `@ucab.edu.ve`, placa de 6 o 7, contraseña de 8 | **Front**: `front/validadores/` |
| Precondición | tener sesión, ser administrador | **Back**: `logica/tacticas/ControlDeAcceso.js` |
| Regla de negocio | lleno/vacío, solo abiertos, «pendiente», placa y nombre únicos, rol según el dominio | **Back**: `logica/modelos/` y `logica/servicios/` |

Lo que el simulador usa: la API pública (controladores) y `datos/basedatos/datos_iniciales/estacionamientos.js`
(una prueba del simulador comprueba que su maqueta 3D coincida).
