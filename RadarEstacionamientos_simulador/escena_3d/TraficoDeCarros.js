// TraficoDeCarros · Los carros que entran y salen del campus por las vías reales: uno por orden,
// varios a la vez en hora pico. El carro del simulador, al pasar por la garita y al llegar o salir
// del estacionamiento, pide enviar la lectura de placa y el aviso del sensor; el de un aviso
// externo (Postman, otro simulador) solo se dibuja.
import { Medidas3D } from "./Medidas3D.js";
import { Piezas3D } from "./Piezas3D.js";

const { COLORES_CARROS, MAX_CARROS_EN_MOVIMIENTO, limitar } = Medidas3D;

export class TraficoDeCarros {
  #escena;
  #terreno;
  #garita;
  #grafo;
  #nodoGarita;
  #estacionamientos;
  #estado;
  #disparar;
  #informar;
  #activos = [];
  #reserva = []; // carros que ya terminaron, para reutilizarlos
  #semillaColor = 0;

  // estacionamientos: { id: Estacionamiento3D } · disparar(evento): avisa a la página
  // informar(texto): cambia el recuadro de estado
  constructor(escena, { terreno, garita, grafo, estacionamientos, estado, disparar, informar }) {
    this.#escena = escena;
    this.#terreno = terreno;
    this.#garita = garita;
    this.#grafo = grafo;
    this.#nodoGarita = grafo.nodoMasCercano(garita.punto);
    this.#estacionamientos = estacionamientos;
    this.#estado = estado;
    this.#disparar = disparar;
    this.#informar = informar;
  }

  static esDelSimulador(comando) {
    return comando.origen !== "externo";
  }

  // Órdenes de carro (ENTRADA o SALIDA). Si llegan muchas a la vez (llenar el campus), solo se
  // animan las últimas; las demás se resuelven al instante.
  procesar(comandos) {
    let sobran = comandos.length - MAX_CARROS_EN_MOVIMIENTO;
    for (const comando of comandos) {
      if (sobran-- > 0) this.#resolverSinAnimar(comando);
      else this.#iniciar(comando);
    }
  }

  // En cada cuadro: mueve los carros y termina los que llegaron.
  actualizar(delta, reloj) {
    for (let i = this.#activos.length - 1; i >= 0; i--) {
      if (this.#mover(this.#activos[i], delta, reloj)) {
        const [carro] = this.#activos.splice(i, 1);
        this.#terminar(carro);
      }
    }
  }

  // ¿Algún carro está pasando por la garita? (sube la talanquera)
  talanqueraAbierta() {
    return this.#activos.some((c) => Math.abs(c.s - c.sGarita) < 18 && (c.paso || c.s >= c.sGarita - 8));
  }

  // El último carro que arrancó (la cámara lo sigue), o undefined.
  seguido() {
    return this.#activos.at(-1);
  }

  // En cada cuadro: el marcador flotante de cada carro crece con la distancia y sube y baja.
  actualizarMarcadores(camara, reloj) {
    for (const carro of this.#activos) {
      const d = camara.position.distanceTo(carro.malla.position);
      const marcador = carro.malla.userData.marcador;
      marcador.scale.setScalar(limitar(d / 80, 1, 9));
      marcador.position.y = 4 + limitar(d / 80, 1, 9) * 0.6 + Math.sin(reloj * 4) * 0.3;
    }
  }

  // El carro del simulador pasa por la garita: el lector lee su placa.
  #enviarLectura(carro) {
    const { comando } = carro;
    if (!TraficoDeCarros.esDelSimulador(comando) || carro.lecturaEnviada) return;
    carro.lecturaEnviada = true;
    if (comando.placa) this.#dispararLectura(comando);
  }

  // El sensor del estacionamiento ve entrar o salir al carro del simulador.
  #enviarAviso(carro) {
    const { comando } = carro;
    if (!TraficoDeCarros.esDelSimulador(comando) || carro.avisoEnviado) return;
    carro.avisoEnviado = true;
    this.#dispararAviso(comando);
  }

  #dispararLectura(comando) {
    this.#disparar({ tipo: "LECTURA_PLACA", placa: comando.placa, sentido: comando.tipo, idLectura: `${comando.idAviso}-garita` });
  }

  #dispararAviso(comando) {
    this.#disparar({ tipo: "AVISO", estacionamientoId: comando.estacionamientoId, movimiento: comando.tipo, idAviso: comando.idAviso });
  }

  #resolverSinAnimar(comando) {
    if (TraficoDeCarros.esDelSimulador(comando)) {
      if (comando.placa) this.#dispararLectura(comando);
      this.#dispararAviso(comando);
    } else if (comando.tipo === "ENTRADA") {
      this.#estado.llegoCarroExterno(comando.estacionamientoId);
      this.#estacionamientos[comando.estacionamientoId]?.aplicar();
    }
  }

  #iniciar(comando) {
    const delSimulador = TraficoDeCarros.esDelSimulador(comando);
    const zona = this.#estacionamientos[comando.estacionamientoId];
    if (!zona) {
      if (comando.tipo === "ENTRADA" && !delSimulador) this.#estado.llegoCarroExterno(comando.estacionamientoId);
      this.#informar(`⚠️ El estacionamiento «${comando.estacionamientoId}» no está en el mapa.`);
      return;
    }
    if (this.#activos.length >= MAX_CARROS_EN_MOVIMIENTO) this.#terminar(this.#activos.shift());

    let puesto = null;
    if (comando.tipo === "ENTRADA") {
      const indice = zona.visibles + zona.reservados;
      if (indice < zona.orden.length) puesto = zona.puestos[zona.orden[indice]];
      zona.reservados++;
    } else if (!delSimulador) {
      // La app ya descontó el carro: sale del puesto que acaba de quedar libre.
      if (zona.visibles < zona.orden.length) puesto = zona.puestos[zona.orden[zona.visibles]];
    } else if (zona.visibles > 0) {
      puesto = zona.puestos[zona.orden[zona.visibles - 1]];
      zona.mostrarCarros(zona.visibles - 1); // el carro sale de ese puesto
    }

    const recorrido = this.#planificar(comando.tipo, zona, puesto);
    const malla = this.#reserva.pop() ?? Piezas3D.carro();
    const colorMarcador = delSimulador ? 0x38bdf8 : 0xf472b6; // azul: del simulador; rosa: externo
    malla.children[0].material.color.setHex(COLORES_CARROS[this.#semillaColor++ % COLORES_CARROS.length]);
    malla.userData.marcador.material.color.setHex(colorMarcador);
    malla.userData.marcador.material.emissive.setHex(colorMarcador);
    malla.visible = true;
    if (!malla.parent) this.#escena.add(malla);
    const carro = { ...recorrido, comando, zona, malla, s: 0, espera: 0, paso: false, pasoGarita: false, tiempo: 0, rumbo: null };
    this.#activos.push(carro);
    if (comando.tipo === "SALIDA") this.#enviarAviso(carro); // el sensor lo ve salir del estacionamiento
  }

  #terminar(carro) {
    const { comando, zona, malla } = carro;
    this.#enviarLectura(carro); // por si no alcanzó a pasar por la garita
    malla.visible = false;
    this.#reserva.push(malla);
    if (comando.tipo === "ENTRADA") {
      this.#enviarAviso(carro);
      zona.reservados = Math.max(0, zona.reservados - 1);
      if (!TraficoDeCarros.esDelSimulador(comando)) this.#estado.llegoCarroExterno(zona.est.id);
    }
    zona.aplicar();
    // Mientras la app base confirma el aviso, el carro ya se ve estacionado.
    if (comando.tipo === "ENTRADA" && TraficoDeCarros.esDelSimulador(comando)) zona.mostrarCarros(zona.visibles + 1);
    this.#informar(
      comando.tipo === "ENTRADA"
        ? `✅ ${comando.placa ?? "Un carro"} se estacionó en ${zona.nombreCartel}.`
        : `👋 ${comando.placa ?? "Un carro"} salió por la garita de la Av. Teherán.`,
    );
  }

  // Recorrido por las vías reales: de la garita al puesto (ENTRADA) o del puesto a la garita (SALIDA).
  #planificar(tipo, zona, puesto) {
    const destino = puesto ?? { ...zona.interior, y: null, haciaPasillo: 1 };
    const despeje = zona.reparto.largoPuesto / 2 + 3.5;
    const frente = {
      x: destino.x + zona.reparto.v.x * despeje * (destino.haciaPasillo ?? 1),
      z: destino.z + zona.reparto.v.z * despeje * (destino.haciaPasillo ?? 1),
    };
    const { llegada, salida } = this.#garita;
    let puntos;
    if (tipo === "ENTRADA") {
      const ruta = this.#grafo.rutaDesdeGarita(this.#nodoGarita, zona.pts, destino);
      puntos = [...llegada.slice(0, -1), ...ruta.puntos, frente, destino];
    } else {
      const ruta = this.#grafo.rutaHaciaGarita(this.#nodoGarita, zona.pts, destino);
      puntos = [destino, frente, ...ruta.puntos, ...salida.slice(1)];
    }

    const muestras = Piezas3D.suavizar(puntos, 1.5);
    const alturas = muestras.map((p) => this.#terreno.alturaDeRodado(p.x, p.z));
    // Pisos altos del Sambilito: la última (o primera) parte del trayecto sube/baja la rampa.
    if (destino.y != null && destino.piso > 0) {
      const tramo = 12;
      const n = muestras.length;
      for (let i = 0; i < n; i++) {
        const desdePuesto = (tipo === "ENTRADA" ? n - 1 - i : i) * 1.5;
        if (desdePuesto < tramo) {
          const t = 1 - desdePuesto / tramo;
          alturas[i] = alturas[i] + (destino.y + 0.02 - alturas[i]) * t;
        }
      }
    }
    const acumulado = [0];
    for (let i = 1; i < muestras.length; i++) {
      acumulado.push(acumulado[i - 1] + Math.hypot(muestras[i].x - muestras[i - 1].x, muestras[i].z - muestras[i - 1].z));
    }
    const { punto } = this.#garita;
    let sGarita = 0;
    let mejor = Infinity;
    muestras.forEach((p, i) => {
      const d = Math.hypot(p.x - punto.x, p.z - punto.z);
      if (d < mejor) {
        mejor = d;
        sGarita = acumulado[i];
      }
    });
    const largo = acumulado.at(-1);
    return { muestras, alturas, acumulado, largo, sGarita, velocidad: limitar(largo / 12, 18, 60) };
  }

  // Avanza el carro; frena en la talanquera para que lean la placa. Devuelve true al llegar.
  #mover(carro, delta, reloj) {
    const { muestras, alturas, acumulado, largo, sGarita, velocidad, malla } = carro;
    carro.tiempo += delta;
    // Frena al acercarse a la talanquera y al estacionar; arranca suave
    let factor = 0.35 + 0.65 * limitar(Math.abs(carro.s - sGarita) / 60, 0, 1);
    factor *= limitar((largo - carro.s) / 35, 0.15, 1);
    factor *= limitar(0.3 + carro.s / 40, 0.3, 1);
    if (!carro.paso && carro.s >= sGarita - 7) {
      carro.espera += delta;
      if (!carro.pasoGarita) {
        carro.pasoGarita = true;
        if (carro.comando.placa) this.#garita.mostrarPlaca(carro.comando.placa, reloj);
        this.#enviarLectura(carro);
      }
      if (carro.espera < 1.1) factor = 0;
      else carro.paso = true;
    }
    carro.s = Math.min(largo, carro.s + velocidad * factor * delta);

    let i = 1;
    while (i < acumulado.length - 1 && acumulado[i] < carro.s) i++;
    const tramo = acumulado[i] - acumulado[i - 1] || 1;
    const t = limitar((carro.s - acumulado[i - 1]) / tramo, 0, 1);
    const a = muestras[i - 1];
    const b = muestras[i];
    malla.position.set(a.x + (b.x - a.x) * t, alturas[i - 1] + (alturas[i] - alturas[i - 1]) * t, a.z + (b.z - a.z) * t);
    const rumbo = Math.atan2(-(b.z - a.z), b.x - a.x);
    if (carro.rumbo === null) carro.rumbo = rumbo;
    let diferencia = rumbo - carro.rumbo;
    diferencia = Math.atan2(Math.sin(diferencia), Math.cos(diferencia));
    carro.rumbo += diferencia * (1 - Math.exp(-delta * 10));
    malla.rotation.y = carro.rumbo;
    malla.rotation.z = Math.atan2(alturas[i] - alturas[i - 1], tramo);
    return carro.s >= largo;
  }
}
