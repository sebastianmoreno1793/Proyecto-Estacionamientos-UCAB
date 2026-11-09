# back/logica · reglas y datos

Una carpeta por tema y, en cada una, dos archivos:

- `reglas.js`: funciones puras (validar, calcular). No guardan nada; se prueban fácil.
- `datos.js`: leen y guardan en `almacen.js` usando las reglas.

Sueltos: `almacen.js` (datos en memoria mientras no hay base de datos), `sesion.js` (quién es el
usuario según su cookie), `clave_sensores.js`, `eventos_en_vivo.js` (avisa los cambios al canal en
vivo), `capacidad_inicial.js` (ocupación de la demo) y `fechas.js`.
