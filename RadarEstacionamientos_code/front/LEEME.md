# front · lo que ve y usa la persona (en capas, como Angular)

Todo pasa por `fetch` a la API (`/api/...`), las mismas URL que usan Postman y el simulador. No hay
acciones de servidor: el front no llama al back por dentro.

```
vistas/ (interfaz) → controladores/ (control) → validadores/ → servicios/ (fetch) → /api/... → back
                                                     dto/ y modelos/ (lo que viaja y lo que se recuerda)
```

| Carpeta | Capa | Qué tiene | Simulador |
|---|---|---|---|
| `app/` | Rutas (nombre que exige Next) | Una carpeta por URL. Cada `page.js` **solo monta su vista**. `app/api/**/route.js` es **la ruta del back**: una línea que pasa la petición a su controlador | ✅ `app/api/` |
| `middleware.js` | (nombre que exige Next) | Antes de cada pantalla, `NavegacionControlador` revisa la sesión y el rol | — |
| `vistas/` | «interfaz» | Componentes de React: uno por pantalla y uno por mensaje. Solo dibujan y avisan al controlador | — |
| `controladores/` | Control | `+valida()` `+muestra()` `+redirige()`: reciben el evento, validan, llaman al servicio y deciden qué interfaz mostrar | — |
| `validadores/` | ★ Validación | **Todas** las validaciones de formato, y solo aquí | — |
| `servicios/` | Servicio | Clases que hablan con el back por `fetch`; heredan de `ClienteHttp` | — |
| `dto/` | DTO | Lo que el front manda y recibe | — |
| `modelos/` | Modelo | Clases del cliente: `SesionUsuario`, `Notificacion` | — |
| `estilos/`, `public/` | — | Colores y formas (`DESIGN.md`); íconos, maqueta, `sw.js` (D-008) | ✅ `public/maqueta/` sale del simulador |
| `pruebas/` | — | Validadores y controladores (`npm test`) | — |

Los componentes de React son funciones (lo estándar hoy): son la **vista**. Toda la lógica está en
clases (controladores, validadores, servicios y modelos).

¿Dónde está una pantalla? ⌘⌥H y escribe `pantalla` (o `pantalla login`, `pantalla mapa`…).
