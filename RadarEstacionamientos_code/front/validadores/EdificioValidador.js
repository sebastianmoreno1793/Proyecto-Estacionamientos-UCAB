// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Revisa el nombre (con letras, 2 a 80) y que la ubicación esté dentro del campus
// Validador · Edificio. Que el nombre no se repita es una regla de negocio: la revisa el back.
import { Validador } from "./Validador.js";

export class EdificioValidador extends Validador {
  static LARGO_MINIMO_NOMBRE = 2;
  static LARGO_MAXIMO_NOMBRE = 80;
  static CENTRO_CAMPUS = [10.4637, -66.977];
  // 0,015° ≈ 1,6 km a esta latitud: más lejos ya no es el Campus Montalbán.
  static DISTANCIA_MAXIMA_GRADOS = 0.015;

  revisar({ nombre, latitud, longitud }, anotar) {
    const limpio = String(nombre ?? "").replace(/\s+/g, " ").trim();
    const sinTildes = limpio.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    if (limpio.length < EdificioValidador.LARGO_MINIMO_NOMBRE) anotar("nombre", "Escribe el nombre del edificio.");
    else if (!/[a-z0-9]/.test(sinTildes)) anotar("nombre", "El nombre debe tener letras o números.");
    else if (limpio.length > EdificioValidador.LARGO_MAXIMO_NOMBRE) {
      anotar("nombre", `El nombre no puede pasar de ${EdificioValidador.LARGO_MAXIMO_NOMBRE} caracteres.`);
    }

    const lat = this.#leerCoordenada(latitud);
    const lon = this.#leerCoordenada(longitud);
    let ubicacion = null;
    if (lat.error || lon.error) anotar("ubicacion", "La latitud y la longitud deben ser números, por ejemplo 10.4642 y -66.9762.");
    else if (lat.vacia !== lon.vacia) anotar("ubicacion", "Escribe la latitud y la longitud juntas, o deja las dos vacías.");
    else if (!lat.vacia) {
      const [lat0, lon0] = EdificioValidador.CENTRO_CAMPUS;
      const lejos =
        Math.abs(lat.numero - lat0) > EdificioValidador.DISTANCIA_MAXIMA_GRADOS ||
        Math.abs(lon.numero - lon0) > EdificioValidador.DISTANCIA_MAXIMA_GRADOS;
      if (lejos) anotar("ubicacion", "Esa ubicación queda fuera del Campus Montalbán.");
      else ubicacion = [lat.numero, lon.numero];
    }
    return { nombre: limpio, ubicacion };
  }

  // Una latitud o longitud escrita a mano (acepta coma). { numero }, { vacia } o { error }.
  #leerCoordenada(valor) {
    const texto = this.texto(valor).replace(",", ".");
    if (texto === "") return { vacia: true };
    if (!/^-?\d+(\.\d+)?$/.test(texto)) return { error: true };
    return { numero: Number(texto) };
  }
}
