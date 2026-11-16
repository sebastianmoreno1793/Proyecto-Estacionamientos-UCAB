# front/app/admin · Administrar (solo administrador)

Se entra desde Perfil. Los chips de arriba (`vistas/comunes/MenuAdmin.js`) cambian entre `puestos/`
(HU 5.4), `garita/` (HU 3.1, 3.2 y 4.1, con el estado de los sensores) y `edificios/` (HU 6.1). Las
vistas están en `vistas/admin/` y sus controladores en `controladores/`. Si alguien sin rol de
administrador abre `/admin/...`, `middleware.js` lo manda a Perfil.
