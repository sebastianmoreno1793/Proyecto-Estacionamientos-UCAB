# escenarios_prueba · qué avisos mandar

`escenarios.js` decide **qué** avisos se envían en cada escenario: repartir llegadas o salidas,
llenar o vaciar estacionamientos, placas al azar e incidencias al azar. Son funciones puras: no llaman a la app; eso lo hace `conexion_app/`. La
ocupación nunca se fija a mano: la calcula la app con cada aviso.
