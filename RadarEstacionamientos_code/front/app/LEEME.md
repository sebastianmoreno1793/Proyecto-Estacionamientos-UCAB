# front/app · pantallas (una carpeta por URL)

| Carpeta | URL | Qué es |
|---|---|---|
| `page.js` | `/` | Inicio |
| `mapa/` | `/mapa` | Maqueta del campus |
| `reportar/` | `/reportar` | Crear una incidencia (HU 9.1) |
| `perfil/` | `/perfil` | Vehículos, notificaciones, Administrar y Salir |
| `sugerencia/` | `/sugerencia` | Sugerir estacionamiento (HU 7.2) |
| `entrar/`, `registro/`, `cuenta/` | `/entrar`, `/registro` | Inicio de sesión y cuenta (HU 1.1) |
| `admin/` | `/admin/...` | Puestos, Incidencias, Garita y Edificios (solo administrador) |
| `api/` | `/api/...` | Conecta cada URL con su endpoint en `back/api` |
| `sin-conexion/` | `/sin-conexion` | Lo que se ve sin internet (PWA) |

`layout.js` es el marco de todas las pantallas; `globals.css` y `formularios.module.css`, los
estilos (D-007, ver `DESIGN.md`).
