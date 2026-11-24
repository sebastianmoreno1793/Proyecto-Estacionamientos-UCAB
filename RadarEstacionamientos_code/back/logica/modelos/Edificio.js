// @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — Un edificio del catálogo: nombre, ubicación e id que no se repite
// Modelo · Edificio del Campus Montalbán. Que el nombre tenga letras y que la ubicación esté dentro
// del campus lo revisa el front (front/validadores/EdificioValidador.js); que el nombre no se
// repita es una regla de negocio y la revisa EdificioServicio.

export class Edificio {
  #id;
  #nombre;
  #ubicacion;

  constructor({ id, nombre, ubicacion = null }) {
    this.#id = id;
    this.#nombre = nombre;
    this.#ubicacion = ubicacion ? [...ubicacion] : null;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get ubicacion() { return this.#ubicacion ? [...this.#ubicacion] : null; }

  tieneUbicacion() {
    return Boolean(this.#ubicacion);
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — modificar
  cambiar({ nombre, ubicacion = null }) {
    this.#nombre = nombre;
    this.#ubicacion = ubicacion ? [...ubicacion] : null;
  }

  // «Edificio de Aulas» y «edificio  de AULAS» son el mismo nombre.
  tieneElMismoNombreQue(nombre) {
    return Edificio.normalizarNombre(this.#nombre) === Edificio.normalizarNombre(nombre);
  }

  // Pasa el nombre a minúsculas, sin tildes ni espacios de más.
  static normalizarNombre(nombre) {
    return String(nombre ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  // @HU-6.1 Registrar y actualizar el catálogo de edificios UCAB · German — el id no se repite
  // «Edificio de Aulas» → «edif-edificio-de-aulas»; si ya existe, le agrega -2, -3…
  static crearId(nombre, idsExistentes) {
    const base =
      "edif-" +
      Edificio.normalizarNombre(nombre)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    let id = base;
    for (let n = 2; idsExistentes.includes(id); n += 1) id = `${base}-${n}`;
    return id;
  }

  static crear({ nombre, ubicacion = null }, idsExistentes) {
    return new Edificio({ id: Edificio.crearId(nombre, idsExistentes), nombre, ubicacion });
  }

  static desde(registro) {
    return new Edificio(registro);
  }

  aRegistro() {
    return { id: this.#id, nombre: this.#nombre, ubicacion: this.ubicacion };
  }
}
