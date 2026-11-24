// Ayuda para las pruebas de los controladores del front: un servicio de mentira que responde lo que
// se le diga y recuerda lo que recibió, y un navegador de mentira que recuerda adónde se redirigió.
export class ServicioDePrueba {
  constructor(respuestas = {}) {
    this.respuestas = respuestas;
    this.llamadas = [];
    return new Proxy(this, {
      get: (objetivo, nombre) => {
        if (nombre in objetivo) return objetivo[nombre];
        return async (...argumentos) => {
          objetivo.llamadas.push({ metodo: nombre, argumentos });
          const r = objetivo.respuestas[nombre];
          return typeof r === "function" ? r(...argumentos) : r;
        };
      },
    });
  }
}

export class NavegadorDePrueba {
  rutas = [];
  push(ruta) {
    this.rutas.push(ruta);
  }
}

export const formulario = (datos) => {
  const f = new FormData();
  for (const [campo, valor] of Object.entries(datos)) f.append(campo, valor);
  return f;
};
