# back/control_de_acceso · quién puede entrar y qué puede hacer

| Archivo | Qué hace | Simulador |
|---|---|---|
| `sesion.js` | Dice quién es el usuario que está conectado (por la cookie que guarda el navegador al entrar) y si es administrador | ✅ el puente reenvía la cookie |
| `clave_sensores.js` | Valida la clave de los sensores y del lector de placas | ✅ el puente manda la clave |
