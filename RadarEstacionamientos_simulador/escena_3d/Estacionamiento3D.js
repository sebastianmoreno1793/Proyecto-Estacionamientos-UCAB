// Estacionamiento3D · Un estacionamiento en el mapa 3D, con su forma real: losa, puestos pintados,
// carros estacionados (tantos como diga la app base), tótem con el cartel del semáforo, conos
// cuando está cerrado y las incidencias reportadas, dibujadas donde ocurren.
import * as THREE from "three";
import { Aleatorio } from "@/mapa_3d/Aleatorio";
import { Poligono } from "@/mapa_3d/Poligono";
import { Medidas3D } from "./Medidas3D.js";
import { Piezas3D } from "./Piezas3D.js";
import { Texturas3D } from "./Texturas3D.js";

const { ALTO_PISO_SAMBILITO, ALTO_TOTEM, ESPESOR_LOSA, limitar } = Medidas3D;

export class Estacionamiento3D {
  // Geometrías y materiales que comparten todos los estacionamientos de una escena.
  static recursosCompartidos() {
    return {
      geoCarroceria: new THREE.BoxGeometry(4.3, 1.0, 1.8).translate(0, 0.75, 0),
      geoCabina: new THREE.BoxGeometry(2.2, 0.6, 1.6).translate(-0.2, 1.55, 0),
      matCabina: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 }),
      matColumna: new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.8 }),
      matConcreto: new THREE.MeshStandardMaterial({ color: 0x8b9099, roughness: 0.85 }),
      geoPoste: new THREE.CylinderGeometry(0.25, 0.3, ALTO_TOTEM, 8).translate(0, ALTO_TOTEM / 2, 0),
      matPoste: new THREE.MeshStandardMaterial({ color: 0x475569 }),
    };
  }

  // Lo que necesitan los carros: datos, forma, puestos y cuántos se ven.
  est;
  pts;
  tope;
  interior;
  nombreCartel;
  puestos = [];
  orden = [];
  reparto;
  visibles = 0;
  reservados = 0;

  #escena;
  #estado;
  #pisos;
  #esProfesores;
  #colorLosa;
  #alturaDePiso;
  #plataforma;
  #resaltado;
  #carrocerias;
  #cabinas;
  #baliza;
  #cartel;
  #baseCartel;
  #distintivo = null;
  #cierre;
  #claveCartel = "";
  #incidencias = new Map(); // id → marcador

  // zona: { est, pts, nivel } de TerrenoDelCampus · estado: EstadoDelMapa · grafo: GrafoDeVias
  // seleccionables: lista de objetos que responden al clic
  constructor(escena, { est, pts, nivel }, { estado, grafo, recursos, seleccionables }) {
    this.#escena = escena;
    this.#estado = estado;
    this.est = est;
    this.pts = pts;
    this.tope = nivel + ESPESOR_LOSA;
    this.#pisos = est.pisos ?? 1;
    this.#esProfesores = Boolean(est.soloProfesores);
    this.#colorLosa = this.#esProfesores ? 0x1e3a5f : 0x1f2937;
    this.#alturaDePiso = (k) => this.tope + k * ALTO_PISO_SAMBILITO;
    this.nombreCartel = Medidas3D.nombreParaCartel(est);

    this.#dibujarLosa(nivel, seleccionables);
    this.#dibujarPuestos();
    if (this.#pisos > 1) this.#dibujarEdificio(recursos, seleccionables);
    this.#prepararCarros(recursos);
    this.#dibujarTotem(recursos, seleccionables);
    this.#dibujarCierre(grafo);
  }

  // Muestra `cantidad` carros estacionados.
  mostrarCarros(cantidad) {
    this.visibles = limitar(Math.round(cantidad), 0, this.puestos.length);
    this.#carrocerias.count = this.visibles;
    this.#cabinas.count = this.visibles;
  }

  // Se pone al día con lo último que llegó de la app base.
  aplicar() {
    const d = this.#estado.datosDe(this.est.id) ?? this.est;
    const activo = d.activo !== false;
    const capacidad = d.capacidad ?? 0;
    const ocupados = d.ocupados ?? 0;
    const libres = d.libres ?? Math.max(0, capacidad - ocupados);
    const porcentaje = d.porcentaje ?? (capacidad > 0 ? Math.round((Math.min(ocupados, capacidad) / capacidad) * 100) : 100);

    this.#resaltado.visible = Boolean(d.seleccionado);
    this.#cierre.visible = !activo;
    this.#plataforma.material.color.setHex(activo ? this.#colorLosa : 0x3f3f46);
    this.#sincronizarIncidencias(d.incidencias ?? []);

    // Si un carro externo va en camino, el cartel espera a que llegue.
    if (this.#estado.carrosEnCamino(this.est.id) > 0) return;

    const clave = activo ? `${libres}|${porcentaje}` : "cerrado";
    if (clave !== this.#claveCartel) {
      this.#claveCartel = clave;
      this.#cartel.material.map?.dispose();
      this.#cartel.material.map = activo
        ? Texturas3D.cartel(this.nombreCartel, libres, porcentaje)
        : Texturas3D.cartelEstado(this.nombreCartel, "CERRADO", "No recibe carros");
      this.#cartel.material.needsUpdate = true;
      const colorLuz = activo ? Medidas3D.colorSemaforo(libres) : 0x64748b;
      this.#baliza.material.color.setHex(colorLuz);
      this.#baliza.material.emissive.setHex(colorLuz);
      this.#baliza.material.emissiveIntensity = activo ? 0.8 : 0.15;
    }
    if (capacidad > 0) this.mostrarCarros((this.puestos.length * Math.min(ocupados, capacidad)) / capacidad);
  }

  // Punto donde mira la cámara al enfocarlo.
  objetivo() {
    return new THREE.Vector3(this.interior.x, this.tope, this.interior.z);
  }

  // En cada cuadro: cartel e incidencias del tamaño justo para leerse; el resaltado late.
  actualizar(camara, reloj, pulso, parpadeo) {
    const baliza = this.#baliza.position;
    const alto = limitar(camara.position.distanceTo(baliza) * 0.03, 7, 34);
    this.#cartel.scale.set(alto * 2, alto, 1);
    this.#cartel.position.set(baliza.x, this.#baseCartel, baliza.z);
    if (this.#distintivo) {
      const altoD = alto * 0.32;
      this.#distintivo.scale.set(altoD * this.#distintivo.userData.aspecto, altoD, 1);
      this.#distintivo.position.set(baliza.x, this.#baseCartel + alto + 0.6, baliza.z);
    }
    if (this.#resaltado.visible) this.#resaltado.material.opacity = pulso;

    for (const m of this.#incidencias.values()) {
      const altoM = limitar(camara.position.distanceTo(m.grupo.position) * 0.022, 3, 20);
      m.sprite.scale.set(altoM * m.aspecto, altoM, 1);
      m.sprite.position.set(m.grupo.position.x, m.base + altoM * m.indice * 1.15 + Math.sin(reloj * 3 + m.indice) * 0.4, m.grupo.position.z);
      for (const luz of m.intermitentes) luz.visible = parpadeo;
    }
  }

  // Plataforma de asfalto con la forma exacta del polígono, su borde y el contorno de selección.
  #dibujarLosa(nivel, seleccionables) {
    const { pts, tope } = this;
    this.#plataforma = new THREE.Mesh(
      Piezas3D.losa(pts, nivel - 2, tope),
      new THREE.MeshStandardMaterial({ color: this.#colorLosa, roughness: 0.85 }),
    );
    this.#plataforma.receiveShadow = true;
    this.#plataforma.userData.estacionamientoId = this.est.id;
    seleccionables.push(this.#plataforma);
    this.#escena.add(this.#plataforma);

    // Borde: violeta en los de profesores
    this.#escena.add(
      new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, tope + 0.05, p.z))),
        new THREE.LineBasicMaterial({ color: this.#esProfesores ? 0xa78bfa : 0xcbd5e1 }),
      ),
    );

    // Contorno de selección (clic en el mapa o en el menú)
    this.#resaltado = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, tope + 0.4, p.z))),
      new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true }),
    );
    this.#resaltado.visible = false;
    this.#escena.add(this.#resaltado);
  }

  // Puestos pintados (en cada piso si es un edificio).
  #dibujarPuestos() {
    this.reparto = Poligono.distribuirPuestos(this.pts);
    for (let k = 0; k < this.#pisos; k++) {
      for (const p of this.reparto.puestos) this.puestos.push({ ...p, piso: k, y: this.#alturaDePiso(k) });
    }
    const lineas = { posiciones: [], indices: [] };
    for (const p of this.puestos) {
      for (const [a, b] of [p.lineaIzquierda, p.lineaDerecha]) {
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const largo = Math.hypot(dx, dz) || 1;
        const nx = (-dz / largo) * 0.07;
        const nz = (dx / largo) * 0.07;
        const k0 = lineas.posiciones.length / 3;
        const y = p.y + 0.03;
        lineas.posiciones.push(a.x + nx, y, a.z + nz, a.x - nx, y, a.z - nz, b.x + nx, y, b.z + nz, b.x - nx, y, b.z - nz);
        lineas.indices.push(k0, k0 + 2, k0 + 1, k0 + 1, k0 + 2, k0 + 3);
      }
    }
    if (lineas.indices.length > 0) {
      this.#escena.add(
        new THREE.Mesh(
          Piezas3D.geometria(lineas),
          new THREE.MeshBasicMaterial({ color: this.#esProfesores ? 0xc4b5fd : 0xe5e7eb, side: THREE.DoubleSide }),
        ),
      );
    }
  }

  // Sambilito: edificio de estacionamiento con losas, columnas y antepechos.
  #dibujarEdificio({ matConcreto, matColumna }, seleccionables) {
    const { pts } = this;
    const pisos = this.#pisos;
    for (let k = 1; k <= pisos; k++) {
      const piso = new THREE.Mesh(Piezas3D.losa(pts, this.#alturaDePiso(k) - ESPESOR_LOSA, this.#alturaDePiso(k)), matConcreto);
      piso.castShadow = true;
      piso.receiveShadow = true;
      piso.userData.estacionamientoId = this.est.id;
      seleccionables.push(piso);
      this.#escena.add(piso);
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const a = pts[j];
        const b = pts[i];
        const largo = Math.hypot(b.x - a.x, b.z - a.z);
        const antepecho = new THREE.Mesh(new THREE.BoxGeometry(largo, 1, 0.25), matConcreto);
        antepecho.position.set((a.x + b.x) / 2, this.#alturaDePiso(k) + 0.5, (a.z + b.z) / 2);
        antepecho.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
        antepecho.castShadow = true;
        this.#escena.add(antepecho);
      }
    }
    const { u, v } = this.reparto;
    const us = pts.map((p) => p.x * u.x + p.z * u.z);
    const vs = pts.map((p) => p.x * v.x + p.z * v.z);
    const columnas = [];
    for (let cu = Math.min(...us) + 1.5; cu < Math.max(...us) - 1; cu += 7.5) {
      for (let cv = Math.min(...vs) + 1.5; cv < Math.max(...vs) - 1; cv += 7.5) {
        const x = cu * u.x + cv * v.x;
        const zc = cu * u.z + cv * v.z;
        if (Poligono.contiene(x, zc, pts) && Poligono.distanciaAlBorde(x, zc, pts) > 0.8) columnas.push({ x, z: zc });
      }
    }
    const altoColumna = ALTO_PISO_SAMBILITO - ESPESOR_LOSA;
    const mallaColumnas = new THREE.InstancedMesh(new THREE.BoxGeometry(0.6, altoColumna, 0.6), matColumna, columnas.length * pisos);
    const m = new THREE.Matrix4();
    let n = 0;
    for (let k = 0; k < pisos; k++) {
      for (const c of columnas) mallaColumnas.setMatrixAt(n++, m.makeTranslation(c.x, this.#alturaDePiso(k) + altoColumna / 2, c.z));
    }
    mallaColumnas.castShadow = true;
    this.#escena.add(mallaColumnas);
  }

  // Carros estacionados (InstancedMesh), en un orden al azar pero siempre el mismo.
  #prepararCarros({ geoCarroceria, geoCabina, matCabina }) {
    const { puestos, reparto } = this;
    this.orden = Aleatorio.desdeTexto(this.est.id).mezclar(puestos.map((_, i) => i));
    this.#carrocerias = new THREE.InstancedMesh(geoCarroceria, new THREE.MeshStandardMaterial({ roughness: 0.4 }), Math.max(1, puestos.length));
    this.#cabinas = new THREE.InstancedMesh(geoCabina, matCabina, Math.max(1, puestos.length));
    const giro = Math.atan2(-reparto.v.z, reparto.v.x); // trompa hacia el fondo del puesto
    const matriz = new THREE.Matrix4();
    const cuaternion = new THREE.Quaternion();
    const unidad = new THREE.Vector3(1, 1, 1);
    const colorCarro = new THREE.Color();
    const aleatorioColor = Aleatorio.desdeTexto(`${this.est.id}-color`);
    this.orden.forEach((indicePuesto, i) => {
      const p = puestos[indicePuesto];
      cuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), giro + (p.haciaPasillo > 0 ? Math.PI : 0));
      matriz.compose(new THREE.Vector3(p.x, p.y, p.z), cuaternion, unidad);
      this.#carrocerias.setMatrixAt(i, matriz);
      this.#cabinas.setMatrixAt(i, matriz);
      this.#carrocerias.setColorAt(i, colorCarro.setHex(aleatorioColor.elegir(Medidas3D.COLORES_CARROS)));
    });
    this.#carrocerias.count = 0;
    this.#cabinas.count = 0;
    this.#escena.add(this.#carrocerias, this.#cabinas);
  }

  // Tótem con el cartel del semáforo (sobre el techo si es edificio) y, si es de profesores, su distintivo.
  #dibujarTotem({ geoPoste, matPoste }, seleccionables) {
    this.interior = Poligono.puntoInterior(this.pts);
    const { interior } = this;
    const baseTotem = this.#pisos > 1 ? this.#alturaDePiso(this.#pisos) : this.tope;
    const poste = new THREE.Mesh(geoPoste, matPoste);
    poste.position.set(interior.x, baseTotem, interior.z);
    this.#escena.add(poste);

    this.#baliza = new THREE.Mesh(
      new THREE.SphereGeometry(1.3, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.8 }),
    );
    this.#baliza.position.set(interior.x, baseTotem + ALTO_TOTEM + 1.3, interior.z);
    this.#escena.add(this.#baliza);
    this.#baseCartel = baseTotem + ALTO_TOTEM + 2.8;

    this.#cartel = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true }));
    this.#cartel.center.set(0.5, 0);
    this.#cartel.userData.estacionamientoId = this.est.id;
    seleccionables.push(this.#cartel);
    this.#escena.add(this.#cartel);

    if (this.#esProfesores) {
      const { textura, aspecto } = Texturas3D.etiqueta("SOLO PROFESORES", { color: "#ede9fe", fondo: "rgba(76, 29, 149, 0.92)", borde: "#a78bfa" });
      this.#distintivo = new THREE.Sprite(new THREE.SpriteMaterial({ map: textura, transparent: true }));
      this.#distintivo.center.set(0.5, 0);
      this.#distintivo.userData.aspecto = aspecto;
      this.#escena.add(this.#distintivo);
    }
  }

  // Conos y barrera en la entrada, para cuando el administrador lo desactiva.
  #dibujarCierre(grafo) {
    const accesoVial = grafo.nodos[grafo.nodoMasCercano(this.interior)];
    const entrada = Poligono.puntoMasCercanoEnBorde(this.pts, accesoVial);
    this.#cierre = new THREE.Group();
    for (let i = -2; i <= 2; i++) {
      const cono = Piezas3D.cono();
      cono.position.set(Math.cos(entrada.angulo) * i * 1.6, 0, Math.sin(entrada.angulo) * i * 1.6);
      this.#cierre.add(cono);
    }
    const barrera = new THREE.Mesh(new THREE.BoxGeometry(7, 0.15, 0.15), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    barrera.position.y = 1;
    barrera.rotation.y = -entrada.angulo;
    this.#cierre.add(barrera);
    this.#cierre.position.set(entrada.x, this.tope, entrada.z);
    this.#cierre.visible = false;
    this.#escena.add(this.#cierre);
  }

  // Dibuja las incidencias pendientes y quita las que ya se atendieron.
  #sincronizarIncidencias(incidencias) {
    const pendientes = incidencias.filter((i) => i.estado !== "atendida");
    const vigentes = new Set(pendientes.map((i) => i.id));
    for (const [id, marcador] of this.#incidencias) {
      if (vigentes.has(id)) continue;
      this.#escena.remove(marcador.grupo, marcador.sprite);
      Piezas3D.liberar(marcador.grupo);
      marcador.sprite.material.map?.dispose(); // la geometría del Sprite es compartida: no se libera
      marcador.sprite.material.dispose();
      this.#incidencias.delete(id);
    }
    pendientes.forEach((incidencia, indice) => {
      if (!this.#incidencias.has(incidencia.id)) this.#incidencias.set(incidencia.id, this.#crearIncidencia(incidencia, indice));
    });
  }

  // Una incidencia en uno de los puestos de planta baja: carro sin batería, mal estacionado o conos.
  #crearIncidencia(incidencia, indice) {
    const candidatos = this.orden.map((i) => this.puestos[i]).filter((p) => p.piso === 0).reverse();
    const puesto = candidatos.length ? candidatos[indice % candidatos.length] : { ...this.interior, haciaPasillo: 1 };
    const { u, v, largoPuesto } = this.reparto;
    const giro = Math.atan2(-v.z, v.x) + ((puesto.haciaPasillo ?? 1) > 0 ? Math.PI : 0);
    const grupo = new THREE.Group();
    grupo.position.set(puesto.x, this.tope, puesto.z);
    const intermitentes = [];

    if (incidencia.tipo === "bateria_descargada") {
      const carro = Piezas3D.carroSimple(0xe5e7eb);
      carro.rotation.y = giro;
      for (const lado of [-0.7, 0.7]) {
        const luz = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
        luz.position.set(2.2, 0.8, lado);
        carro.add(luz);
        intermitentes.push(luz);
      }
      grupo.add(carro);
    } else if (incidencia.tipo === "vehiculo_mal_estacionado") {
      const carro = Piezas3D.carroSimple(0xdc2626);
      carro.rotation.y = giro + 0.65; // atravesado sobre dos puestos
      carro.position.set(u.x * 1.3, 0, u.z * 1.3);
      grupo.add(carro);
    } else {
      // Conos atravesados en el pasillo frente al puesto
      const azar = Aleatorio.desdeTexto(incidencia.id);
      const pasillo = (largoPuesto / 2 + 3) * (puesto.haciaPasillo ?? 1);
      for (let i = -2; i <= 2; i++) {
        const cono = Piezas3D.cono();
        cono.position.set(v.x * pasillo + u.x * i * 1.4 + (azar.siguiente() - 0.5), 0, v.z * pasillo + u.z * i * 1.4 + (azar.siguiente() - 0.5));
        if (azar.siguiente() < 0.4) cono.rotation.z = Math.PI / 2; // uno que otro tumbado
        grupo.add(cono);
      }
    }
    this.#escena.add(grupo);

    const { textura, aspecto } = Texturas3D.etiqueta(
      `⚠ ${Medidas3D.ICONO_INCIDENCIA[incidencia.tipo] ?? ""} ${incidencia.nombreTipo ?? incidencia.tipo}`,
      { color: "#fff7ed", fondo: "rgba(194, 65, 12, 0.94)", borde: "#fed7aa" },
    );
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: textura, transparent: true }));
    sprite.center.set(0.5, 0);
    this.#escena.add(sprite);
    return { grupo, sprite, aspecto, intermitentes, indice, base: this.tope + 5 + indice * 0.2 };
  }
}
