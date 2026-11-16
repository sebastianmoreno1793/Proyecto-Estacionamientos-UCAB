# front/app · rutas (una carpeta por URL)

Cada `page.js` **solo monta su vista** (`../vistas/`). La sesión y el rol los revisa `../middleware.js`
antes de llegar aquí.

| Carpeta | URL | Vista |
|---|---|---|
| `page.js` | `/` | `vistas/inicio/Inicio` |
| `mapa/` | `/mapa` | `vistas/mapa/MaquetaCampus` |
| `reportar/` | `/reportar` | `vistas/reportar/FormularioIncidencia` (HU 9.1) |
| `perfil/` | `/perfil` | `vistas/perfil/PantallaPerfil` |
| `sugerencia/` | `/sugerencia` | `vistas/sugerencia/BuscadorSugerencia` (HU 7.2) |
| `entrar/`, `registro/` | `/entrar`, `/registro` | `vistas/cuenta/FormularioCuenta` (HU 1.1) |
| `admin/` | `/admin/...` | Puestos, Garita y Edificios (solo administrador) |
| `api/` | `/api/...` | **La ruta del back**: cada `route.js` pasa la petición a su controlador de `back/controladores/` (✅ simulador y Postman) |

`layout.js` es el marco de todas las pantallas; `manifest.js`, los datos de la PWA.
