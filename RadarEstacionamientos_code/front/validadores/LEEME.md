# front/validadores · ★ todas las validaciones están aquí, y solo aquí

`Validador.validar(datos)` → `{ valido, errores: { campo: mensaje }, error, datos limpios }`. Los usa
el controlador del front antes de llamar al servicio. El back no repite estas validaciones: conserva
la precondición (sesión y rol) y las reglas de negocio.

| Componente | Requisito | Qué revisa |
|---|---|---|
| `IncidenciaValidador` | HU 9.1 | Eligió un estacionamiento de la lista y el tipo; dice todo lo que falta (CA2) |
| `CapacidadValidador` | HU 5.4 | Capacidad entera de 1 a 2000; «activo» sí o no |
| `CuentaValidador` | HU 1.1 | Correo `@est.ucab.edu.ve` o `@ucab.edu.ve`, contraseña de 8 o más y que coincidan (mensajes del escenario, pasos 7.1, 8.1 y 9.1) |
| `EdificioValidador` | HU 6.1 | Nombre con letras (2 a 80); latitud y longitud juntas, con coma o punto, dentro del campus |
| `VehiculoValidador` | HU 2.1 | Placa de 6 o 7 letras y números; marca, modelo y color |
