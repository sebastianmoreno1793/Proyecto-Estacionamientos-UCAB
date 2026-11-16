// EstadoDelMapa · Lo que el mapa 3D sabe de la app base y lo que le falta por dibujar:
// el último estado de cada estacionamiento, las órdenes pendientes (carros que entran o salen,
// enfocar) y los carros externos que todavía van en camino. Vive aunque la escena no exista.
export class EstadoDelMapa {
  seguir = true; // la cámara sigue al último carro

  #datos = new Map(); // id → lo último que llegó de la app base
  #enCamino = new Map(); // id → carros externos que aún no llegan
  #pendientes = [];
  #ultimaSecuencia = 0;

  // Guarda el estado que trajo la app base. Devuelve los ids que cambiaron.
  actualizar(estacionamientos) {
    const ids = [];
    for (const e of estacionamientos) {
      if (!e?.id) continue;
      this.#datos.set(e.id, e);
      ids.push(e.id);
    }
    return ids;
  }

  datosDe(id) {
    return this.#datos.get(id);
  }

  etiquetaDe(id) {
    return this.#datos.get(id)?.etiqueta ?? id;
  }

  // Recibe una orden (o un lote `{ ordenes: [...] }`, cada una con `seq` creciente: si React junta
  // varias en un solo render, ninguna se pierde). Devuelve las órdenes nuevas.
  recibir(ultimoEvento) {
    if (!ultimoEvento) return [];
    const nuevas = [];
    for (const orden of ultimoEvento.ordenes ?? [ultimoEvento]) {
      if (orden.seq != null) {
        if (orden.seq <= this.#ultimaSecuencia) continue;
        this.#ultimaSecuencia = orden.seq;
      }
      // La app ya contó el carro externo: el cartel espera a que el carro llegue en el mapa.
      if (orden.tipo === "ENTRADA" && orden.origen === "externo") {
        this.#enCamino.set(orden.estacionamientoId, this.carrosEnCamino(orden.estacionamientoId) + 1);
      }
      this.#pendientes.push(orden);
      nuevas.push(orden);
    }
    return nuevas;
  }

  // Saca todas las órdenes pendientes.
  tomarPendientes() {
    return this.#pendientes.splice(0);
  }

  carrosEnCamino(id) {
    return this.#enCamino.get(id) ?? 0;
  }

  // Un carro externo llegó (o no se va a animar): el cartel ya puede mostrar el dato.
  llegoCarroExterno(id) {
    const n = this.carrosEnCamino(id);
    if (n <= 1) this.#enCamino.delete(id);
    else this.#enCamino.set(id, n - 1);
  }

  // Texto para el recuadro de estado cuando un carro empieza a moverse, o null.
  describir({ tipo, estacionamientoId, placa, origen }) {
    if (tipo !== "ENTRADA" && tipo !== "SALIDA") return null;
    const nombre = this.etiquetaDe(estacionamientoId);
    const entra = tipo === "ENTRADA";
    return origen === "externo"
      ? `📡 Aviso externo: ${entra ? "entrada en" : "salida de"} ${nombre}`
      : `${entra ? "🚗" : "🚙"} ${placa ?? "Vehículo"} ${entra ? "va hacia" : "sale de"} ${nombre}`;
  }
}
