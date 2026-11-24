// Repositorio · Clase base de acceso a datos. Es lo ÚNICO que toca el almacén: al llegar la base de
// datos se cambia esta capa y nada más. Recibe modelos y devuelve modelos (nunca el registro crudo).
import { AlmacenEnMemoria } from "../basedatos/AlmacenEnMemoria.js";

export class Repositorio {
  #tabla;
  #Modelo;
  #almacen;

  // tabla: nombre de la tabla · Modelo: la clase con desde() y aRegistro()
  constructor(tabla, Modelo, almacen = AlmacenEnMemoria) {
    this.#tabla = tabla;
    this.#Modelo = Modelo;
    this.#almacen = almacen;
  }

  get registros() {
    return this.#almacen.tabla(this.#tabla);
  }

  // Todos, en el orden en que se guardaron.
  async listar() {
    return this.registros.map((r) => this.#Modelo.desde(r));
  }

  // Los últimos `limite`, el más reciente primero.
  async ultimos(limite = 50) {
    return this.registros
      .slice(-limite)
      .reverse()
      .map((r) => this.#Modelo.desde(r));
  }

  async buscarPorId(id) {
    return this.buscarUno((r) => this.idDe(r) === id);
  }

  // El primero que cumpla la condición (sobre el registro), o null.
  async buscarUno(condicion) {
    const registro = this.registros.find(condicion);
    return registro ? this.#Modelo.desde(registro) : null;
  }

  // Inserta o reemplaza (por id).
  async guardar(modelo) {
    const registro = modelo.aRegistro();
    const posicion = this.registros.findIndex((r) => this.idDe(r) === modelo.id);
    if (posicion === -1) this.registros.push(registro);
    else this.registros[posicion] = registro;
    return this.#Modelo.desde(registro);
  }

  // Quita por id y devuelve lo quitado (o null).
  async eliminar(id) {
    const posicion = this.registros.findIndex((r) => this.idDe(r) === id);
    if (posicion === -1) return null;
    const [quitado] = this.registros.splice(posicion, 1);
    return this.#Modelo.desde(quitado);
  }

  // Vuelve el campus a los datos de ejemplo (solo desarrollo; lo usa PruebasServicio).
  async reiniciarDatosDeEjemplo() {
    this.#almacen.reiniciar();
  }

  // Cómo se llama el id en el registro (las subclases lo cambian si hace falta).
  idDe(registro) {
    return registro.id;
  }
}
