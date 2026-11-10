# app · rutas de Next.js

El nombre `app/` lo exige Next.js. Aquí solo hay rutas:

- `page.js`: la pantalla del simulador (estado, canal en vivo y lo que hace cada botón del menú).
- `maqueta/page.js`: el render de la maqueta desde arriba; la imagen se copia a la app.
- `api/base/[...ruta]/route.js`: **el puente hacia la app**. Recibe `/api/base/...` desde el
  navegador del simulador y lo reenvía a `http://localhost:3000/api/...`. Agrega la clave de los
  sensores en el servidor (nunca llega al navegador) y solo deja pasar las rutas de una lista.
- `api/exportar-maqueta/route.js`: solo en desarrollo, guarda el render en `exportes/`.
