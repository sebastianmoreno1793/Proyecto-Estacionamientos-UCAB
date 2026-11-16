// Controlador (front) · Clase base de los controladores del front, como el «ManejoProducto» del ejemplo
// de la profesora: +valida(datos) +muestra() +redirige(). Recibe el evento de la vista, valida con su
// validador, llama al servicio (fetch) y decide qué interfaz (mensaje) muestra la vista.
export class Controlador {
  #navegador;

  // navegador: el router de Next (useRouter) para cambiar de pantalla sin recargar; si no hay, window.location.
  constructor({ navegador = null } = {}) {
    this.#navegador = navegador;
  }

  // +valida(datos): usa el validador del caso de uso.
  valida(validador, datos) {
    return validador.validar(datos);
  }

  // +muestra(): lo que la vista debe mostrar: el nombre de la interfaz (mensaje) y sus datos.
  muestra(interfaz, datos = {}) {
    return { interfaz, ...datos };
  }

  // +redirige(): lleva a otra pantalla.
  redirige(ruta) {
    if (this.#navegador) this.#navegador.push(ruta);
    else if (typeof window !== "undefined") window.location.assign(ruta);
    return this.muestra("Redirigiendo", { ruta });
  }

  // Un objeto simple a partir de un FormData (o el mismo objeto si ya lo es).
  leer(formulario) {
    return typeof formulario?.entries === "function" ? Object.fromEntries(formulario.entries()) : { ...formulario };
  }
}
