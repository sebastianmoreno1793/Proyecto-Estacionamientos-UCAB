# back/dto · lo que entra y lo que sale

`desdeCuerpo(cuerpo)` arma lo que llega en la petición (solo pasa a mayúsculas, recorta espacios o
convierte a número; **no valida**). `desdeModelo(modelo)` arma lo que sale: nunca el modelo «bruto»,
nunca correos, contraseñas ni placas al público.

| DTO | Requisito | Entra / sale |
|---|---|---|
| `AvisoDTO` | HU 3.1, 4.1 | Entra: `{ estacionamientoId, tipo, idAviso }` |
| `MovimientoDTO`, `AvisoRechazadoDTO` | HU 3.1, 4.1 | Salen al administrador |
| `EstacionamientoDTO` | HU 4.2, 5.1, 5.4 | Sale: libres, porcentaje, `semaforo { nivel, texto }` y forma · entran los cambios `{ capacidad, activo }` |
| `IncidenciaDTO` | HU 9.1 | Entra `{ estacionamientoId, tipo }` · sale sin el correo de quien reporta |
| `LecturaDePlacaDTO` | HU 3.2 | Entra `{ placa, sentido, idLectura }` · sale solo al lector y al administrador |
| `EdificioDTO` | HU 6.1 | `{ id, nombre, ubicacion }` |
| `CredencialesDTO` | HU 1.1 | Entra `{ correo, contrasena }` (nunca sale) |
| `UsuarioDTO` | HU 1.1 | Sale `{ correo, rol }`, sin contraseña |
| `VehiculoDTO` | HU 2.1 | `{ placa, marca, modelo, color }` |
| `SugerenciaDTO` | HU 7.2 | `{ edificio, sugerido, alternativas }` |
