# controladores · el control del simulador

`SimuladorControlador` guarda lo que se ve (estacionamientos, incidencias, registro, tarea en
curso), escucha el canal en vivo de la app base, convierte lo que pasa en el mundo 3D en llamadas a
la API y corre los escenarios. La página (`app/page.js`) solo dibuja su estado con
`useSyncExternalStore`.
