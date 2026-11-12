# front/sesion_del_usuario · saber quién está conectado

Al entrar, el navegador guarda una cookie (un código de la sesión). `sesion.js` la guarda, la lee
y la borra al salir. Quién es el usuario de ese código lo decide el back
(`back/control_de_acceso/sesion.js`).
