# front/app · rutas (una carpeta por URL)

Aquí solo hay rutas. Cada `page.js` arma su pantalla con piezas de `../componentes/`.

| Carpeta | URL | Qué es |
|---|---|---|
| `page.js` | `/` | Inicio |
| `mapa/` | `/mapa` | Maqueta del campus |
| `reportar/` | `/reportar` | Crear una incidencia (HU 9.1) |
| `perfil/` | `/perfil` | Vehículos, notificaciones, Administrar y Salir |
| `sugerencia/` | `/sugerencia` | Sugerir estacionamiento (HU 7.2) |
| `entrar/`, `registro/` | `/entrar`, `/registro` | Inicio de sesión y cuenta (HU 1.1) |
| `admin/` | `/admin/...` | Puestos, Garita y Edificios (solo administrador) |
| `api/` | `/api/...` | Conecta cada URL con su endpoint en `back/api` (✅ simulador y Postman) |

`layout.js` es el marco de todas las pantallas; `manifest.js`, los datos de la PWA.
